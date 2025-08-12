from django.urls import path
from . import views

urlpatterns = [
    path('save-fcm-token/', views.save_fcm_token, name='save_fcm_token'),
    path('send-notification/', views.send_notification, name='send_notification'),
    path('tokens/', views.get_tokens, name='get_tokens'),
    path('notifications/', views.get_notifications, name='get_notifications'),
]
