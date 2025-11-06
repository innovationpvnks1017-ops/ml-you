from fastapi import APIRouter

api_router = APIRouter()

from backend.app.api.api_v1 import auth, training, admin, dashboard

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(training.router, prefix="/training", tags=["training"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
