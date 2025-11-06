from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.api.deps import get_current_active_user, get_db
from backend.app.models.training import Training, TrainingStatusEnum
from backend.app.models.user import User
from sqlalchemy.future import select
from typing import List
from backend.app.schemas.training import TrainingOut
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
async def get_summary(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Training).filter(Training.user_id == current_user.id)
    result = await db.execute(stmt)
    trainings = result.scalars().all()

    count = len(trainings)
    if count == 0:
        return {
            "count": 0,
            "last_training": None,
            "success_rate": 0.0,
        }
    last_training = max(trainings, key=lambda t: t.created_at)
    completed_count = sum(1 for t in trainings if t.status == TrainingStatusEnum.completed)
    success_rate = completed_count / count if count > 0 else 0.0

    return {
        "count": count,
        "last_training": last_training.created_at,
        "success_rate": success_rate,
    }

@router.get("/results", response_model=List[TrainingOut])
async def get_results(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Training).filter(Training.user_id == current_user.id).order_by(Training.created_at.desc())
    result = await db.execute(stmt)
    trainings = result.scalars().all()
    return trainings
