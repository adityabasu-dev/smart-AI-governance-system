from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_v1.endpoints import api_router

app = FastAPI(title="Smart City E-Gov AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; in production, use ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "AI Governance Backend is Live"}