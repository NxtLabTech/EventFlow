from django.contrib import admin
from django.urls import path

admin.site.site_header = "EventFlow Admin"
admin.site.site_title = "EventFlow Admin"

urlpatterns = [path("", admin.site.urls)]
