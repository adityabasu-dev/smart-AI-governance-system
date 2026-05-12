from fastapi import APIRouter, HTTPException
from app.db.firebase_admin import db

router = APIRouter()

@router.get("/prioritized-list")
async def get_prioritized_list():
    # Fetch all grievances sorted by urgency
    docs = db.collection("grievances").order_by("urgency_score", direction="DESCENDING").stream()
    
    reports = []
    for doc in docs:
        reports.append(doc.to_dict())
    
    return reports

@router.patch("/resolve/{id}")
async def resolve_grievance(id: str):
    try:
        db.collection("grievances").document(id).update({"status": "resolved"})
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/grievance/{id}")
async def delete_grievance(id: str):
    try:
        db.collection("grievances").document(id).delete()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))