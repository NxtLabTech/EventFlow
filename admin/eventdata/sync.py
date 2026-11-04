from datetime import timezone

from django.db import transaction

from .models import Event, Registration


class MissingRequiredFieldError(Exception):
    """Raised when a MongoDB document is missing a field required for the admin snapshot."""

    def __init__(self, collection, document_id, field):
        self.collection = collection
        self.document_id = document_id
        self.field = field
        super().__init__(
            f"{collection} document {document_id!s} is missing required field '{field}'"
        )


EVENT_REQUIRED_FIELDS = ("title", "date", "time", "location", "organizer", "capacity")
REGISTRATION_REQUIRED_FIELDS = ("name", "email", "eventId")


def _aware(dt):
    # pymongo returns naive datetimes (always UTC) unless tz_aware is set
    return dt.replace(tzinfo=timezone.utc) if dt and dt.tzinfo is None else dt


def _require(doc, collection, fields):
    document_id = doc.get("_id", "<unknown>")
    for field in fields:
        if field not in doc:
            raise MissingRequiredFieldError(collection, document_id, field)


def sync_from_mongo(db):
    """Replace the local snapshot with the current contents of MongoDB.

    `db` is a pymongo Database (or mongomock). Returns (events, registrations) counts.
    """
    with transaction.atomic():
        Registration.objects.all().delete()
        Event.objects.all().delete()

        events = {}
        for doc in db["events"].find():
            _require(doc, "events", EVENT_REQUIRED_FIELDS)
            events[doc["_id"]] = Event.objects.create(
                mongo_id=str(doc["_id"]),
                title=doc["title"],
                description=doc.get("description", ""),
                date=doc["date"].date(),
                time=doc["time"],
                location=doc["location"],
                organizer=doc["organizer"],
                capacity=doc["capacity"],
                created_at=_aware(doc.get("createdAt")),
                updated_at=_aware(doc.get("updatedAt")),
            )

        registrations = 0
        for doc in db["registrations"].find():
            _require(doc, "registrations", REGISTRATION_REQUIRED_FIELDS)
            event = events.get(doc["eventId"])
            if event is None:  # orphaned registration; skip it
                continue
            Registration.objects.create(
                mongo_id=str(doc["_id"]),
                name=doc["name"],
                email=doc["email"],
                event=event,
                registered_at=_aware(doc.get("registeredAt")),
            )
            registrations += 1

    return len(events), registrations
