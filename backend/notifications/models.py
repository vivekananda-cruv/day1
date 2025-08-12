from django.db import models
from django.utils import timezone

class FCMToken(models.Model):
    token = models.TextField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.token[:64]

class NotificationLog(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    sent_to_count = models.IntegerField(default=0)
    sent_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} ({self.sent_to_count})"
