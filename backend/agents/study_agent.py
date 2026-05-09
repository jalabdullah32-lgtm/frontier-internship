import anthropic
from dotenv import load_dotenv
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
class StudyAgent:
    # I want to eventually go back and tailor each agent. 
    # I am an expert summary writer xyz
    def __init__(self):
        load_dotenv()
        self.client = anthropic.Anthropic()

    def run(self, goal, structure, transcript):
        outline = self.generate_outline(transcript, structure, goal)
        summaries = self.generate_sumaries(transcript, goal)
        flashcards = self.generate_flashcards(transcript, goal)
        return{
            "outline": outline,
            "summaries": summaries,
            "flashcards": flashcards
        }

    def generate_outline(self, transcript, structure, goal):
        prompt = f"""
        You are an expert academic study assistant.

        The lecture has already been analyzed. Use this structure 
        as your guide — do not re-analyze from scratch:

        Structure: {structure}

        Now using that structure and the full transcript, 
        produce a detailed outline:

        Student goal: {goal}
        Transcript: {transcript}
        Return a structured outline with the following format:

        SECTION 1: [Title] — Start time: [timestamp]
        - Key point
        - Key point
        - Key point
        ⚠️ IMPORTANT: [any professor emphasis moments]

        SECTION 2: [Title] — Start time: [timestamp]
        - Key point
        - Key point

        SECTION 3: [Title] — Start time: [timestamp]
        - Key point
        - Key point

        Rules:
        - Every section must have a real timestamp from the transcript
        - Only include what was actually said in the transcript
        - Flag any moment the professor signaled was important
        - Keep bullet points to one sentence maximum        
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

    def generate_sumaries(self, transcript, goal):
            prompt = f""" 
            You are an expert academic study assistant.
            Generate three summaries of this lecture at different depths.
            Only use information from the transcript — do not invent anything.

            Student goal: {goal}
            Transcript: {transcript}

            Return exactly this format:

            90 SECOND SUMMARY:
            [3-4 sentences maximum. The absolute essentials only. 
            What would a student need to know if they had 90 seconds 
            before an exam.]

            5 MINUTE SUMMARY:
            [One paragraph per major topic. Key concepts with just enough 
            context to understand them. Highlight anything the professor 
            signaled as important.]

            FULL SUMMARY:
            [Comprehensive overview of everything covered. Use the three 
            sections as headers. Include all key terms, concepts, and 
            professor emphasis moments.]

            Rules:
            - Tailor depth and focus to the student's goal: {goal}
            - Never include information not found in the transcript
            - Flag professor emphasis moments with ⚠️
            - Write in plain language a college student can understand
            - Each summary must be clearly separated and labeled
            """
            try:
                response = self.client.messages.create(
                    model="claude-sonnet-4-5",
                    max_tokens=4000,
                    messages=[{"role": "user","content": prompt}]
                )
                return response.content[0].text
            except Exception:
                raise ValueError("Response from Claude Failed")


    def generate_flashcards(self, transcript, goal):
        prompt = f""" 
        You are an expert academic study assistant.
        Generate a deck of flashcards from this lecture transcript.
        Only use information from the transcript — do not invent anything.

        Student goal: {goal}
        Transcript: {transcript}

        Return exactly this format for each card:

        CARD [number]:
        Front: [question or key term]
        Back: [plain language answer or definition]
        Type: [Multiple Choice / Short Answer / True or False]
        Timestamp: [exact timestamp from transcript where this was taught]
        Source: [one short phrase from the transcript that proves this answer]

        Rules:
        - Generate 12 cards total
        - Mix card types — at least 4 multiple choice, 4 short answer, 4 true or false
        - Focus on concepts most relevant to student goal: {goal}
        - Every card must have a real timestamp from the transcript
        - Never include information not found in the transcript
        - Flag cards from professor emphasis moments with ⚠️
        """
        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=4000,
                messages=[{"role": "user","content": prompt}]
            )
            return response.content[0].text
        except Exception:
            raise ValueError("Response from Claude Failed")

if __name__ == "__main__":
    from agents.ingest_agent import IngestAgent
    
    ingest = IngestAgent()
    ingest_result = ingest.run("https://www.youtube.com/watch?v=scL2pbCgMRQ", "exam prep")
    
    study = StudyAgent()
    result = study.run(
        goal="exam prep",
        structure=ingest_result["structure"],
        transcript=ingest_result["transcript"]
    )
    print(result)