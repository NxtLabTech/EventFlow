from django.contrib import admin

from .models import Event, Registration


class ReadOnlyAdmin(admin.ModelAdmin):
    """The data belongs to the Express app; this admin only inspects the snapshot.
    Change data through the EventFlow app, then re-run `python manage.py sync_from_mongo`."""

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class RegistrationInline(admin.TabularInline):
    model = Registration
    extra = 0
    can_delete = False
    fields = ("name", "email", "registered_at")
    readonly_fields = fields

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Event)
class EventAdmin(ReadOnlyAdmin):
    list_display = ("title", "date", "time", "location", "organizer", "capacity", "registration_count")
    list_filter = ("date", "organizer")
    search_fields = ("title", "location", "organizer")
    date_hierarchy = "date"
    inlines = [RegistrationInline]

    @admin.display(description="Registrations")
    def registration_count(self, obj):
        return obj.registrations.count()


@admin.register(Registration)
class RegistrationAdmin(ReadOnlyAdmin):
    list_display = ("name", "email", "event", "registered_at")
    list_filter = ("event", "registered_at")
    search_fields = ("name", "email", "event__title")
