from celery import shared_task
from .models import TranscriptionJob
import whisper
from django.conf import settings
import os
import logging

logger = logging.getLogger(__name__)


@shared_task
def transcribe_video(job_id):

    abs_path = f"{settings.MEDIA_ROOT}/subtitles/{job_id}.srt"

    try:
        job = TranscriptionJob.objects.get(id=job_id)
        job.status = "processing"
        job.save()

        # TRANSCRIBING USING WHISPER
        model = whisper.load_model("base")
        result = model.transcribe(job.video_file.path)

        srt_content = generate_srt(result["segments"])

        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        with open(abs_path, "w") as f:
            f.write(srt_content)

        # UPDATING PROGRESS
        job.srt_file = f"subtitles/{job.id}.srt"
        job.status = "done"
        job.save()

    except Exception as e:
        job.status = "failed"
        job.save()
        raise e


def generate_srt(segments):
    srt = ""
    for i, segment in enumerate(segments, 1):
        start = format_timestamp(segment["start"])
        end = format_timestamp(segment["end"])
        text = segment["text"].strip()
        srt += f"{i}\n{start} --> {end}\n{text}\n\n"
    return srt


def format_timestamp(secounds):
    hours = int(secounds // 3600)
    minutes = int((secounds % 3600) // 60)
    secs = int(secounds % 60)
    millis = int((secounds % 1) * 1000)

    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"
