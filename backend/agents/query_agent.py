import anthropic
from dotenv import load_dotenv
from fpdf import FPDF

class QueryAgent:
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

    def search(self, question, transcript):
    # semantic search — find moment in transcript that answers question
        prompt = f""" 
        You are a Mike Ross from suits.
        You read the entire "transcript":{transcript} and memorized it with 100% perfect
        recall. 
        The student asked a "question":{question} regarding the "transcript": {transcript}
        Response:
        1. Be concise
        2. Don't be a fool
    """
        try:
            response = self.client.messages.create(
                    model="claude-sonnet-4-5",
                    max_tokens=4000,
                    messages=[{"role": "user","content": prompt}]
                )        
            return response.content[0]
        except Exception:
            raise("Response from Claude failed")


    def regenerate_flashcard(self, card, transcript):
    # takes rejected card, returns better one
        prompt = f""" 
        You're kira from deathnote. 
        Rewrite the cards. they sucked
        Use this "transcript": {transcript}
        and this "card": {card}
        Response:
        2. Don't be a fool
    """
        
        try:
            response = self.client.messages.create(
                    model="claude-sonnet-4-5",
                    max_tokens=4000,
                    messages=[{"role": "user","content": prompt}]
                )        
            return response.content[0]
        except Exception:
            raise("Response from Claude failed")


    def translate(self, materials, language):
    # translates outline, summaries, flashcards to target language
    # Might use claude to translate, we'll see
        pass


    def export_pdf(self, outline, summaries, flashcards):
    # packages everything into downloadable PDF
        prompt = """

"""