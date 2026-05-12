from fastapi import APIRouter
from . import citizen, admin

api_router = APIRouter()
api_router.include_router(citizen.router, prefix="/citizen", tags=["citizen"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])