from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.db.firebase_admin import db
from app.services.nlp import NLPService
from pydantic import BaseModel
from google.cloud import firestore
router = APIRouter()
nlp = NLPService()

class GrievanceSubmit(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float

class CitizenRegister(BaseModel):
    full_name: str
    email: str
    password: str
    ward_number: str

def process_ai_classification(doc_id: str, description: str):
    try:
        analysis = nlp.classify_grievance(description)
        print(f"Analysis result: {analysis}")  # add this
        db.collection("grievances").document(doc_id).update({
            "category": analysis["category"],
            "confidence": analysis["confidence"],
            "urgency_score": analysis["urgency_pct"],
            "urgency_level": analysis["urgency_level"],
        })
        print(f"Updated doc {doc_id} with urgency {analysis['urgency_pct']}")  # and this
    except Exception as e:
        print(f"AI classification error: {e}")  # catch silent failures

@router.post("/submit")
async def submit_grievance(data: GrievanceSubmit, background_tasks: BackgroundTasks):
    try:
        # 1. Store initial data in Firestore
        new_doc = db.collection("grievances").document()
        doc_id = new_doc.id
        
        grievance_data = {
            "id": doc_id,
            "title": data.title,
            "description": data.description,
            "latitude": data.latitude,
            "longitude": data.longitude,
            "status": "pending",
            "category": "Analyzing...",
            "created_at": firestore.SERVER_TIMESTAMP
        }
        new_doc.set(grievance_data)

        # 2. Trigger AI processing in the background (so frontend doesn't wait)
        background_tasks.add_task(process_ai_classification, doc_id, data.description)

        return {"status": "success", "message": "Grievance submitted", "id": doc_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register")
async def register_citizen(data: CitizenRegister):
    try:
        user_data = {
            "full_name": data.full_name,
            "email": data.email,
            "ward_number": data.ward_number,
            "created_at": firestore.SERVER_TIMESTAMP
        }
        db.collection("users").document(data.email).set(user_data)
        return {"status": "success", "message": "Citizen registered"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))