# main.py
from agents.ingest_agent import IngestAgent
from agents.study_agent import StudyAgent
from agents.query_agent import QueryAgent

app = FastAPI()

@app.post("/analyze")
async def analyze(url: str, goal: str):
    
    # Step 1 - IngestAgent
    ingest = IngestAgent()
    transcript, structure = ingest.run(url, goal)
    
    # Step 2 - StudyAgent
    study = StudyAgent()
    results = study.run(transcript, structure, goal)
    
    # Step 3 - return to frontend
    return results