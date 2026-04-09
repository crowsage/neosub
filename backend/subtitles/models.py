from django.db import models
import uuid


# Create your models here.
class TranscriptionJob(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("done", "Done"),
        ("failed", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    video_file = models.FileField(upload_to="videos/")
    srt_file = models.FileField(upload_to="subtitles/", null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
