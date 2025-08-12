from django.contrib import admin
from .models import FCMToken, NotificationLog

@admin.register(FCMToken)
class FCMTokenAdmin(admin.ModelAdmin):
    list_display = ('id', 'token_preview', 'is_active', 'created_at')
    search_fields = ('token',)

    def token_preview(self, obj):
        return obj.token[:50] + ('...' if len(obj.token) > 50 else '')
    token_preview.short_description = 'token'

@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('title', 'sent_to_count', 'sent_at')
    readonly_fields = ('sent_at',)
