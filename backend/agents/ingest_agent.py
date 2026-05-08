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
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs

class IngestAgent:

    def __init__(self):
        load_dotenv()
        self.client = anthropic.Anthropic()

    def run(self, url, goal):
        video_id = self.validate(url)
        transcript = self.fetch_transcript(video_id)
        structure = self.analyze_structure(transcript["transcript"],goal)
        self.store(video_id,transcript,structure)

        return{
            "transcript": transcript,
            "structure": structure
        }

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
        except Exception:
            raise ValueError("Could not fetch transcript")

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
        You are analyzing a lecture transcrpt. Find
        key points in the lecture that will assit 
        user in learning in the most efficient
        way possible depending on their learning goals. 
        Chunk the video into 3 parts begining, middle, 
        and end. And make note of improtant time stamps 
        so they can easily find them. 

        Student goal: {goal}
        Transcript: {transcript}

        Return:
        1. Three sections (beginning, middle, end) with start time stamps
        2. Key terms introduced in each section
        3. Important timestamps to note
        4. Moments that are signaled as important 
        """

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=4000,
                messages=[{"role": "user","content": prompt}]
            )
            return response.content[0].text
        except Exception:
            raise ValueError("Response from Claude failed")
    def store(self, video_id, transcript, structure):
        #implement Azure Blob Storage caching
        pass

# if __name__ == "__main__":
    # agent = IngestAgent()
    # result = agent.run("https://www.youtube.com/watch?v=scL2pbCgMRQ&t=1s","exam prep")
    # print(result)