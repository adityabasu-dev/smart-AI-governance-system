from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_v1.endpoints import api_router
from app.db.firebase_admin import db
from app.services.nlp import NLPService

app = FastAPI(title="Smart City E-Gov AI")
nlp_service = NLPService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "AI Governance Backend is Live"}