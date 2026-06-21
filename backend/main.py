from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from ml_pipeline import generate_question, ingest_knowledge_base
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database (using JSON/dict structure in-memory for speed, replace with SQLite if desired)
db = {}

class AnswerPayload(BaseModel):
    session_id: str
    answer: str

@app.on_event("startup")
async def startup_event():
    # Make sure to put one of the required PDFs in the backend folder and name it 'textbook.pdf'
    if os.path.exists("textbook.pdf"):
        ingest_knowledge_base("textbook.pdf")

@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...), role: str = Form(...)):
    session_id = str(uuid.uuid4())
    
    # In a full version, you would parse the PDF here. We will mock the extracted skills for now.
    extracted_skills = "Python, Machine Learning, JSON APIs" 
    
    db[session_id] = {
        "role": role,
        "skills": extracted_skills,
        "history": []
    }
    return {"session_id": session_id, "skills": extracted_skills}

@app.get("/api/question/{session_id}")
async def get_question(session_id: str):
    if session_id not in db:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = db[session_id]
    
    # Generate question using local RAG
    question = generate_question(session["role"], session["skills"])
    session["history"].append({"question": question, "answer": None})
    
    return {"question": question}

@app.post("/api/answer")
async def submit_answer(payload: AnswerPayload):
    session = db.get(payload.session_id)
    if not session:
        raise HTTPException(status_code=404)
    
    session["history"][-1]["answer"] = payload.answer
    return {"status": "success"}

@app.get("/api/summary/{session_id}")
async def get_summary(session_id: str):
    return {"summary": db.get(session_id, {}).get("history", [])}