from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import messaging
from .models import FCMToken, NotificationLog
import traceback
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import messaging
from .models import FCMToken, NotificationLog
import traceback
# Save FCM token
@api_view(['POST'])
def save_fcm_token(request):
    token = request.data.get('token')
    if not token:
        return Response({'error': 'token required'}, status=status.HTTP_400_BAD_REQUEST)

    obj, created = FCMToken.objects.get_or_create(token=token)
    if not obj.is_active:
        obj.is_active = True
        obj.save()
    return Response({'message': 'token saved', 'created': created}, status=status.HTTP_200_OK)


# Send notification to all active tokens

@api_view(['POST'])
def send_notification(request):
    title = request.data.get('title')
    body = request.data.get('body')
    if not title or not body:
        return Response({'error': 'title and body required'}, status=status.HTTP_400_BAD_REQUEST)

    tokens = list(FCMToken.objects.filter(is_active=True).values_list('token', flat=True))
    if not tokens:
        return Response({'error': 'no active tokens'}, status=status.HTTP_404_NOT_FOUND)

    success_count = 0
    failure_count = 0

    for token in tokens:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=token
        )
        try:
            messaging.send(message)
            success_count += 1
        except Exception as e:
            print("🚨 Firebase send error:\n", traceback.format_exc())
            FCMToken.objects.filter(token=token).update(is_active=False)
            failure_count += 1

    # Log notification
    NotificationLog.objects.create(title=title, body=body, sent_to_count=success_count)

    return Response({
        'success_count': success_count,
        'failure_count': failure_count,
        'total': len(tokens)
    }, status=status.HTTP_200_OK)

# Optional: Get all saved tokens
@api_view(['GET'])
def get_tokens(request):
    tokens = list(FCMToken.objects.all().values('id', 'token', 'is_active', 'created_at'))
    return Response(tokens)


# Optional: Get last 50 notifications
@api_view(['GET'])
def get_notifications(request):
    logs = NotificationLog.objects.all().order_by('-sent_at')[:50]
    data = [{
        'id': l.id,
        'title': l.title,
        'body': l.body,
        'sent_to_count': l.sent_to_count,
        'sent_at': l.sent_at
    } for l in logs]
    return Response(data)
