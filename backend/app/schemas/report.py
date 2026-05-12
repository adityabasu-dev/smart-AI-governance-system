from pydantic import BaseModel
from typing import Optional

class ReportCreate(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float

class StatusUpdate(BaseModel):
    status: str # e.g., "resolved", "in-progress"