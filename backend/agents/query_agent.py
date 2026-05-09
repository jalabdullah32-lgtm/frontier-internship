import anthropic
from dotenv import load_dotenv
from fpdf import FPDF
from deep_translator import GoogleTranslator

class QueryAgent:
    def __init__(self):
        load_dotenv()
        self.client = anthropic.Anthropic()


    def search(self, question, transcript):
    # semantic search — find moment in transcript that answers question
        prompt = f""" 
        You are an expert academic study assistant with perfect recall.
        
        A student has asked a question about a lecture they watched.
        Only answer using information found in the transcript.
        If the answer is not in the transcript, say "This topic was not covered in this lecture."
        
        Student question: {question}
        Transcript: {transcript}
        
        Return:
        - A direct plain language answer to the question
        - The timestamp where this was discussed
        - A short quote from that moment as evidence   
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


    def regenerate_flashcard(self, card, transcript):
    # takes rejected card, returns better one
        prompt = f""" 
        You are an expert academic study assistant.
        
        A student found this flashcard unhelpful and wants a better one.
        Use the same concept from the transcript but rewrite it more clearly.
        Only use information found in the transcript.
        
        Original card: {card}
        Transcript: {transcript}
        
        Return in this exact format:
        Front: [question or key term]
        Back: [plain language answer]
        Timestamp: [where this was taught]
        Source: [short quote from transcript]    
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


    def translate(self, materials, language):
    # translates outline, summaries, flashcards to target language
    # Might use claude to translate, we'll see
        try:
            translator = GoogleTranslator(source="en", target=language)

            return{
                "outline":translator.translate(materials["outline"]),
                "summaries":translator.translate(materials["summaries"]),
                "flashcards":translator.translate(materials["flashcards"])
            }
        except Exception:
            raise ValueError("Translation failed")


    def export_pdf(self, outline, summaries, flashcards):
    # packages everything into downloadable PDF
        try:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Arial", size=12)

            pdf.cell(200, 10, txt="OUTLINE", ln=True)
            pdf.multi_cell(0, 10, txt=outline)

            pdf.add_page()
            pdf.cell(200, 10, txt="SUMMARIES", ln=True)
            pdf.multi_cell(0, 10, txt=summaries)

            pdf.add_page()
            pdf.cell(200, 10, txt="FLASHCARDS", ln=True)
            pdf.multi_cell(0, 10, txt=flashcards)
            
            return pdf.output(dest="S").encode("latin-1")
        except Exception:
            raise ValueError("PDF export failed")