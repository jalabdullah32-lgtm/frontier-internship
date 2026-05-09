from fastapi import FastAPI, HTTPException
from agents.ingest_agent import IngestAgent
from agents.study_agent import StudyAgent
from agents.query_agent import QueryAgent

app = FastAPI()

@app.post("/analyze")
async def analyze(url: str, goal: str):
    try:
        ingest = IngestAgent()
        ingest_result = ingest.run(url, goal)

        study = StudyAgent()
        study_result = study.run(
            goal=goal,
            structure=ingest_result["structure"],
            transcript=ingest_result["transcript"]
        )
        return study_result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


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

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")