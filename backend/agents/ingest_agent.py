import anthropic
from youtube_transcript_api import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
    IpBlocked,
    RequestBlocked,
    InvalidVideoId
)
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs

class IngestAgent:

    def __init__(self):
        load_dotenv()
        self.client = anthropic.Anthropic()

    def run(self, url, goal):
        video_id = self.validate(url)

    def validate(self, url):
        parsed = urlparse(url)

        if parsed.netloc not in ["www.youtube.com", "youtube.com", "youtu.be"]:
            raise ValueError("not a vaild input")

        if "/shorts/" in parsed.path:
            raise ValueError("Shorts are not supported, please use a lecture video")

        params = parse_qs(parsed.query)
        if "v" not in params:
            raise ValueError("No video found in this URL, please use a direct video link")

        video_id = params["v"] [0]
        return video_id

    # grab video_id from validate
    # Pass it into youtubeapi import 
    # grab transcript and other video data
    # return those fields
    def fetch_transcript(self, video_id):
        try:
            ytt_api = YouTubeTranscriptApi()
            fetched = ytt_api.fetch(video_id)
            raw_data = fetched.to_raw_data()
            return {
                "video_id": video_id,
                "transcript": raw_data
            }
        except Exception as e:
            raise ValueError(f"Could not fetch transcript: {str(e)}")      

    # def analyze_structure(self, transcript, goal)
    # def store(self, video_id, transcript, structure)
