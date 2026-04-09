from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import TranscriptionJob
from .tasks import transcribe_video
from django.http import FileResponse


# /subtitles/upload/
@api_view(["POST"])
def upload_video(request):
    file = request.FILES.get("video")
    if not file:
        return Response(
            {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    if file.size > 100 * 1024 * 1024:
        return Response({"error": "File too large"}, status=400)

    job = TranscriptionJob.objects.create(video_file=file)
    transcribe_video.delay(str(job.id))

    return Response({"job_id": str(job.id)}, status=status.HTTP_201_CREATED)


# /subtitles/jobs/<job:id>/
@api_view(["GET"])
def job_status(request, job_id):
    try:
        job = TranscriptionJob.objects.get(id=job_id)
        return Response({"status": job.status})
    except TranscriptionJob.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)


# /subtitles/jobs/<job:id>/download/
@api_view(["GET"])
def download_srt(request, job_id):

    try:
        job = TranscriptionJob.objects.get(id=job_id)
        if job.status != "done":
            return Response(
                {"error": "Not ready yet"}, status=status.HTTP_400_BAD_REQUEST
            )

        return FileResponse(
            open(job.srt_file.path, "rb"), as_attachment=True, filename=f"{job_id}.srt"
        )

    except TranscriptionJob.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
