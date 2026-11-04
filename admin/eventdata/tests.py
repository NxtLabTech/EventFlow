
from datetime import datetime, timezone
from io import StringIO
from unittest.mock import patch

import mongomock
from bson import ObjectId
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import SimpleTestCase, TestCase, override_settings
from pymongo.errors import PyMongoError

from .models import Event, Registration
from .sync import sync_from_mongo


def make_db():
    db = mongomock.MongoClient().eventflow
    event_id = ObjectId()

    db.events.insert_one(
        {
            "_id": event_id,
            "title": "Node Meetup",
            "description": "Talks",
            "date": datetime(2099, 1, 15, tzinfo=timezone.utc),
            "time": "18:30",
            "location": "Hyderabad",
            "organizer": "NxtLabTech",
            "capacity": 10,
            "createdAt": datetime(2026, 1, 1, tzinfo=timezone.utc),
            "updatedAt": datetime(2026, 1, 2, tzinfo=timezone.utc),
        }
    )

    db.registrations.insert_many(
        [
            {
                "name": "Asha",
                "email": "asha@example.com",
                "eventId": event_id,
                "registeredAt": datetime(2026, 2, 1, tzinfo=timezone.utc),
            },
            {
                "name": "Orphan",
                "email": "o@example.com",
                "eventId": ObjectId(),
            },
        ]
    )

    return db


class SyncTests(TestCase):

    def test_sync_copies_events_and_registrations(self):
        events, registrations = sync_from_mongo(make_db())

        self.assertEqual((events, registrations), (1, 1))

        event = Event.objects.get()
        self.assertEqual(event.title, "Node Meetup")
        self.assertEqual(str(event.date), "2099-01-15")
        self.assertEqual(Registration.objects.get().event, event)

    def test_sync_is_repeatable(self):
        db = make_db()

        sync_from_mongo(db)
        sync_from_mongo(db)

        self.assertEqual(Event.objects.count(), 1)
        self.assertEqual(Registration.objects.count(), 1)


class AdminTests(TestCase):

    def setUp(self):
        sync_from_mongo(make_db())
        get_user_model().objects.create_superuser(
            "admin", "a@example.com", "pw-for-tests-123"
        )
        self.client.login(username="admin", password="pw-for-tests-123")

    def test_lists_load(self):
        for path in ("/eventdata/event/", "/eventdata/registration/"):
            self.assertEqual(self.client.get(path).status_code, 200)

    def test_admin_is_read_only(self):
        self.assertEqual(self.client.get("/eventdata/event/add/").status_code, 403)
        self.assertEqual(self.client.get(f"/eventdata/event/{Event.objects.get().pk}/delete/").status_code, 403)


COMMAND_MODULE = "eventdata.management.commands.sync_from_mongo"


class SyncFromMongoCommandTests(SimpleTestCase):

    def test_missing_mongodb_uri(self):
        with override_settings(MONGODB_URI=""):
            with patch(f"{COMMAND_MODULE}.MongoClient") as mock_client:
                with self.assertRaisesMessage(
                    CommandError, "MONGODB_URI is not set"
                ):
                    call_command("sync_from_mongo")

                mock_client.assert_not_called()

    def test_mongodb_error_and_client_cleanup(self):
        with override_settings(
            MONGODB_URI="mongodb://localhost:27017/eventflow"
        ):
            with patch(f"{COMMAND_MODULE}.MongoClient") as mock_factory:
                client = mock_factory.return_value
                database = object()
                client.get_default_database.return_value = database

                with patch(
                    f"{COMMAND_MODULE}.sync_from_mongo",
                    side_effect=PyMongoError("Connection failed"),
                ) as mock_sync:
                    with self.assertRaisesMessage(
                        CommandError, "Could not read from MongoDB"
                    ):
                        call_command("sync_from_mongo")

                    mock_sync.assert_called_once_with(database)

                client.close.assert_called_once_with()

    def test_success_message_and_client_cleanup(self):
        output = StringIO()

        with override_settings(
            MONGODB_URI="mongodb://localhost:27017/eventflow"
        ):
            with patch(f"{COMMAND_MODULE}.MongoClient") as mock_factory:
                client = mock_factory.return_value
                database = object()
                client.get_default_database.return_value = database

                with patch(
                    f"{COMMAND_MODULE}.sync_from_mongo",
                    return_value=(2, 3),
                ) as mock_sync:
                    call_command(
                        "sync_from_mongo",
                        stdout=output,
                        no_color=True,
                    )

                    mock_sync.assert_called_once_with(database)

                client.close.assert_called_once_with()

        self.assertEqual(
            output.getvalue().strip(),
            "Synced 2 events and 3 registrations.",
        )
