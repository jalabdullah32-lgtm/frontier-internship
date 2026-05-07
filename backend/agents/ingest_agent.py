import anthropic
from youtube_transcript_api import YouTubeTranscriptApi
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

    def fetch_transcript(self, video_id):
    # def analyze_structure(self, transcript, goal)
    # def store(self, video_id, transcript, structure)
