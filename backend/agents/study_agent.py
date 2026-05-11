import anthropic
from dotenv import load_dotenv
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class StudyAgent:
    def __init__(self):
        load_dotenv()
        self.client = anthropic.Anthropic()

    def run(self, goal, structure, transcript):
        outline = self.generate_outline(transcript, structure, goal)
        summaries = self.generate_sumaries(transcript, goal)
        flashcards = self.generate_flashcards(transcript, goal)
        return {
            "outline": outline,
            "summaries": summaries,
            "flashcards": flashcards
        }

    def generate_outline(self, transcript, structure, goal):
        prompt = f"""
        You are an expert academic study assistant.

        The lecture has already been analyzed. Use this structure as your guide:

        Structure: {structure}

        Using that structure and the full transcript, produce a detailed outline.
        Student goal: {goal}
        Transcript: {transcript}

        Return the outline in exactly this format:

        ## SECTION 1: [Title] - Start time: [M:SS]
        - **[M:SS]** Key point from transcript
        - **[M:SS]** Key point from transcript
        - Key point without timestamp if no specific moment applies
        NOTE: [only if the professor explicitly signaled this was important]
        Key Terms
        [Term one]
        [Term two]

        ## SECTION 2: [Title] - Start time: [M:SS]
        - **[M:SS]** Key point
        - Key point

        ## SECTION 3: [Title] - Start time: [M:SS]
        - **[M:SS]** Key point
        - Key point

        Rules:
        - Section headers must start with ## SECTION followed by the number, a colon, the title, a dash, and Start time
        - Timestamps in bullet points must be wrapped in double asterisks like **1:23**
        - Use NOTE: only when the professor explicitly signaled emphasis
        - Key Terms section at the end of each section: the label on its own line, then one term per line
        - Every section must have a real timestamp from the transcript
        - Only include what was actually said - do not invent content
        - One sentence per bullet point maximum
        """
        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        except Exception:
            raise ValueError("Response from Claude failed")

    def generate_sumaries(self, transcript, goal):
        prompt = f"""
        You are an expert academic study assistant writing study materials for college students.
        Be accurate, direct, and concise. No filler phrases like "it's important to note" or "as mentioned above."

        Student goal: {goal}
        Transcript: {transcript}

        Write three summaries at different depths using exactly these headers:

        # 90 SECOND SUMMARY:
        [3-4 sentences. The core argument only. What is this lecture fundamentally about?]

        # 5 MINUTE SUMMARY:
        [2-3 short paragraphs. Cover the main concepts in the order they appeared. One concrete example per major concept.]

        # FULL SUMMARY:
        [Detailed prose organized by lecture section. Every significant concept with enough context to reconstruct the logic. Written in paragraphs, not bullets.]

        Rules:
        - Do not add any headers other than the three above
        - No motivational framing
        - Cite timestamps inline like (4:38) when referencing a specific moment
        - Do not invent examples not in the transcript
        """
        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        except Exception:
            raise ValueError("Response from Claude failed")

    def generate_flashcards(self, transcript, goal):
        prompt = f"""
        Generate 12 flashcards from this transcript. Only use what was actually said.

        Student goal: {goal}
        Transcript: {transcript}

        CARD 1:
        Front: [question or term]
        Back: [answer, 1-3 sentences]
        Type: [Multiple Choice / Short Answer / True or False]
        Timestamp: [M:SS]

        [repeat through CARD 12]

        - Mix types evenly: 4 of each
        - Real timestamps only
        - Add [!] to Front if the professor flagged it as important
        """
        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        except Exception:
            raise ValueError("Response from Claude failed")