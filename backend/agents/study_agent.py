import anthropic
from dotenv import load_dotenv

class StudyAgent:
    
    def __init__(self):
        load_dotenv()
        self.client = anthropic.Anthropic()

    def run(self, goal, structure, transcript):
        outline = self.generate_outline(transcript["transcript"], structure, goal)
        summaries = self.generate_sumaries(transcript["transcript"], goal)
        flashcards = self.generate_flashcards(transcript["transcript"], goal)
        return{
            "outline": outline,
            "summaries": summaries,
            "flashcards": flashcards
        }
    def generate_outline(self, transcript, structure, goal):
        pass
    
    def generate_sumaries(self, transcript, goal):
        pass

    def generate_flashcards(self, transcript, goal):
        pass

