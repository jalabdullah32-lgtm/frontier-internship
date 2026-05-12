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
        Answer this student's question using only the transcript.
        If the answer isn't there, say "This topic was not covered in this lecture."

        Question: {question}
        Transcript: {transcript}

        Return:
        - A direct answer
        - The timestamp where it was discussed
        - A short quote as evidence
        If the answer is not in the transcript, return exactly:
        OUT_OF_SCOPE
        """
        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            result = response.content[0].text.strip()

            if "OUT_OF_SCOPE" in result:
                return {"answer": "That topic wasn't covered in this lecture. We're continuously working on improving your experience.", "timestamp": None}

            return {"answer": result, "timestamp": None}
        except Exception:
            raise ValueError("Response from Claude failed")

    def regenerate_flashcard(self, card, transcript):
    # takes rejected card, returns better one
        prompt = f""" 
        Rewrite this flashcard more clearly using the same concept.
        Only use information from the transcript.

        Original card: {card}
        Transcript: {transcript}

        Front: [question or key term]
        Back: [plain language answer]
        Timestamp: [M:SS]   
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
        try:
            translator = GoogleTranslator(source="en", target=language)
            return {
                "short": translator.translate(materials["short"]),
                "medium": translator.translate(materials["medium"]),
                "full": translator.translate(materials["full"]),
            }
        except Exception as e:
            raise ValueError(f"Translation failed: {str(e)}")

    def export_pdf(self, outline, summaries, flashcards):
    # packages everything into downloadable PDF
        try:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("helvetica", size=12)

            def safe_text(text):
                return text.encode('latin-1','replace').decode('latin-1')
            pdf.cell(200, 10, txt="OUTLINE", ln=True)
            pdf.multi_cell(0, 10, txt=safe_text(outline))

            pdf.add_page()
            pdf.cell(200, 10, txt="SUMMARIES", ln=True)
            pdf.multi_cell(0, 10, txt=safe_text(summaries))

            pdf.add_page()
            pdf.cell(200, 10, txt="FLASHCARDS", ln=True)
            pdf.multi_cell(0, 10, txt=safe_text(flashcards))
            
            return bytes(pdf.output())
        except Exception:
            raise ValueError("PDF export failed")
