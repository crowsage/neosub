from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path("upload/", view=views.upload_video, name="upload-video"),
    path("jobs/<str:job_id>/", view=views.job_status, name="job-status"),
    path("jobs/<str:job_id>/download/", view=views.download_srt, name="download-srt"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
