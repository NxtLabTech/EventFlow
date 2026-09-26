from datetime import datetime, timezone

import mongomock
from bson import ObjectId
from django.contrib.auth import get_user_model
from django.test import TestCase

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
            {"name": "Asha", "email": "asha@example.com", "eventId": event_id, "registeredAt": datetime(2026, 2, 1, tzinfo=timezone.utc)},
            {"name": "Orphan", "email": "o@example.com", "eventId": ObjectId()},
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
        get_user_model().objects.create_superuser("admin", "a@example.com", "pw-for-tests-123")
        self.client.login(username="admin", password="pw-for-tests-123")

    def test_lists_load(self):
        for path in ("/eventdata/event/", "/eventdata/registration/"):
            self.assertEqual(self.client.get(path).status_code, 200)

    def test_admin_is_read_only(self):
        self.assertEqual(self.client.get("/eventdata/event/add/").status_code, 403)
        self.assertEqual(self.client.get(f"/eventdata/event/{Event.objects.get().pk}/delete/").status_code, 403)
