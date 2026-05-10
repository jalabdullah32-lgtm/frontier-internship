#main
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from agents.ingest_agent import IngestAgent
from agents.study_agent import StudyAgent
from agents.query_agent import QueryAgent
from fpdf import FPDF

app = FastAPI()

@app.post("/analyze")
async def analyze(url: str, goal: str):

    if len(goal.split()) > 50:
        raise HTTPException(status_code=400, detail="Goal must be under 50 words")

    try:
        ingest = IngestAgent()
        ingest_result = ingest.run(url, goal)
    
        study = StudyAgent()
        study_result = study.run(
            goal=goal,
            structure=ingest_result["structure"],
            transcript=ingest_result["compressed"]
        )
        return {
            "outline": study_result["outline"],
            "summaries": study_result["summaries"],
            "flashcards": study_result["flashcards"],
            "compressed": ingest_result["compressed"]
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search")
async def search(question: str, transcript: str):
    try:
        query = QueryAgent()
        result = query.search(question, transcript)

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@app.post("/translate")
async def translate(materials: dict, language: str):
    try:
        query = QueryAgent()
        result = query.translate(materials, language)

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@app.post("/regenerate")
async def regenerate(card: str, transcript: str):
    try:
        query = QueryAgent()
        result = query.regenerate_flashcard(card, transcript)

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@app.get("/export")
async def export(outline: str, summaries: str, flashcards: str):
    try:
        query = QueryAgent()
        result = query.export_pdf(outline, summaries, flashcards)

        return Response(
                content=result,
                media_type="application/pdf",
                headers={"Content-Disposition": "attachment; filename=study_pack.pdf"}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")