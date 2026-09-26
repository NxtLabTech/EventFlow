from django.db import models


class Event(models.Model):
    """Read-only snapshot of a document from MongoDB's `events` collection."""

    mongo_id = models.CharField(max_length=24, unique=True, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.CharField(max_length=5)
    location = models.CharField(max_length=200)
    organizer = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ["date", "time"]

    def __str__(self):
        return self.title


class Registration(models.Model):
    """Read-only snapshot of a document from MongoDB's `registrations` collection."""

    mongo_id = models.CharField(max_length=24, unique=True, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="registrations")
    registered_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ["-registered_at"]

    def __str__(self):
        return f"{self.name} <{self.email}>"
