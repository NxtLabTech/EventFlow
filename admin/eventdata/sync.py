from datetime import timezone

from django.db import transaction

from .models import Event, Registration


def _aware(dt):
    # pymongo returns naive datetimes (always UTC) unless tz_aware is set
    return dt.replace(tzinfo=timezone.utc) if dt and dt.tzinfo is None else dt


def sync_from_mongo(db):
    """Replace the local snapshot with the current contents of MongoDB.

    `db` is a pymongo Database (or mongomock). Returns (events, registrations) counts.
    """
    with transaction.atomic():
        Registration.objects.all().delete()
        Event.objects.all().delete()

        events = {}
        for doc in db["events"].find():
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
