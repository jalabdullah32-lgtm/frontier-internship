import anthropic
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
    IpBlocked,
    RequestBlocked,
    InvalidVideoId
)
from youtube_transcript_api.proxies import GenericProxyConfig
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs

class IngestAgent:

    def __init__(self):
        load_dotenv()
        self.client = anthropic.Anthropic()

    def run(self, url, goal):
        video_id = self.validate(url)
        transcript = self.fetch_transcript(video_id)
        compressed = self.compress_transcript(transcript["transcript"])
        structure = self.analyze_structure(compressed, goal)
        self.store(video_id,transcript,structure)

        return{
            "transcript": transcript,
            "structure": structure,
            "compressed": compressed
        }
    def validate(self, url):
        parsed = urlparse(url)

        if parsed.netloc not in ["www.youtube.com", "youtube.com", "youtu.be"]:
            raise ValueError("Please enter a valid YouTube URL.")

        if "/shorts/" in parsed.path:
            raise ValueError("Shorts are not supported, please use a lecture video")

        params = parse_qs(parsed.query)
        if "v" not in params:
            raise ValueError("No video found in this URL, please use a direct video link")

        video_id = params["v"] [0]
        return video_id

    def fetch_transcript(self, video_id):
        try:
            ytt_api = YouTubeTranscriptApi(
                    proxy_config=GenericProxyConfig(
                    http_url=os.getenv("PROXY_URL"),
                    https_url=os.getenv("PROXY_URL")))
            fetched = ytt_api.fetch(video_id)
            raw_data = fetched.to_raw_data()                
            return {
                "video_id": video_id,
                "transcript": raw_data
            }
        except NoTranscriptFound:
            raise ValueError("No captions found for this video")
        except TranscriptsDisabled:
            raise ValueError("Captions are disabled for this video")
        except VideoUnavailable:
            raise ValueError("Video is private, deleted, or doesn't exist")
        except IpBlocked:
            raise ValueError("IP blocked by YouTube")
        except RequestBlocked:
            raise ValueError("Request blocked by YouTube")
        except InvalidVideoId:
            raise ValueError("Invalid video ID")
        except Exception as e:
            raise ValueError(f"Could not fetch transcript: {str(e)}")

    def compress_transcript(self, raw_data):
        full_text = " ".join([t["text"]for t in raw_data])
        
        return full_text[:15000]

    def analyze_structure(self, transcript, goal):
        #region note on claude prompt
        ''' 
        Im not sure how granular the return section
        has to be. There are a ton of things that I can
        think of: Suggestions, how many times a specific
        word or concept was spoken about, how was x thing
        spoken about, personal opinion on what should be 
        focused on.
        I wanted to lock down the user input, but If their
        goal is to do well on x assignment, it would be good
        if they could tell agent and the output would be based
        on that success.
        '''
        #endregion

        prompt = f"""
        SYSTEM:
        You are a lecture analyst. Your job is to produce a clean, scannable structural outline of a lecture for a student who needs to study efficiently. Output markdown only. No preamble, no meta-commentary.

        USER:
        Analyze this lecture transcript and produce a structured outline. Follow these rules exactly:

        - Divide the lecture into 2-4 logical sections based on topic shifts, not arbitrary time splits.
        - Each section: a heading with the time range, one sentence stating the core concept, then timestamped bullet points for key moments only — skip filler, transitions, and housekeeping.
        - Timestamps go in parentheses like (1:23), not bold labels.
        - One "Key terms" line per section, comma-separated. No bullets, no bolding of individual terms.
        - End with a single "Traffic flow" or "Core framework" block only if the lecture contains a process or architecture worth diagramming. Plain text or minimal ASCII only.
        - No emoji. No ALL CAPS. No redundant labels. If a section header already says "0:00–3:00", don't repeat "Start Time: 0:00" inside it.
        - Do not add any section that wasn't in the lecture (no "exam strategy", no "additional resources" unless the lecturer explicitly recommended them).

        Transcript:
        {transcript}        
        """

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=4000,
                messages=[{"role": "user","content": prompt}]
            )
            return response.content[0].text
        except Exception as e:
            raise ValueError(f"Response from Claude failed: {str(e)}")

    def store(self, video_id, transcript, structure):
        #implement Azure Blob Storage caching
        pass
