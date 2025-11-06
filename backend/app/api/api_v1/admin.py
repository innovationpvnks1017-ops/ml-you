from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.api.deps import get_current_admin_user, get_db
from backend.app.models.user import User
from backend.app.models.training import Training
from backend.app.models.log import Log
from backend.app.schemas.user import UserOut
from backend.app.schemas.training import TrainingOut
from typing import List, Optional
from sqlalchemy.future import select

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[UserOut])
async def get_users(skip: int = 0, limit: int = 20, email: Optional[str] = None, db: AsyncSession = Depends(get_db), current_admin=Depends(get_current_admin_user)):
    query = select(User)
    if email:
        query = query.filter(User.email.ilike(f"%{email}%"))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    return users

@router.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db), current_admin=Depends(get_current_admin_user)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=UserOut)
async def update_user(user_id: int, is_active: Optional[bool] = None, is_admin: Optional[bool] = None, db: AsyncSession = Depends(get_db), current_admin=Depends(get_current_admin_user)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if is_active is not None:
        user.is_active = is_active
    if is_admin is not None:
        user.is_admin = is_admin
    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db), current_admin=Depends(get_current_admin_user)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(user)
    await db.commit()
    return

@router.get("/trainings", response_model=List[TrainingOut])
async def get_trainings(skip: int = 0, limit: int = 20, status: Optional[str] = None, user_id: Optional[int] = None, db: AsyncSession = Depends(get_db), current_admin=Depends(get_current_admin_user)):
    query = select(Training)
    if status:
        query = query.filter(Training.status == status)
    if user_id:
        query = query.filter(Training.user_id == user_id)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    trainings = result.scalars().all()
    return trainings

@router.delete("/trainings/{training_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_training(training_id: int, db: AsyncSession = Depends(get_db), current_admin=Depends(get_current_admin_user)):
    training = await db.get(Training, training_id)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")
    await db.delete(training)
    await db.commit()
    return

@router.get("/logs")
async def get_logs(skip: int = 0, limit: int = 50, user_id: Optional[int] = None, action: Optional[str] = None, db: AsyncSession = Depends(get_db), current_admin=Depends(get_current_admin_user)):
    query = select(Log)
    if user_id:
        query = query.filter(Log.user_id == user_id)
    if action:
        query = query.filter(Log.action.ilike(f"%{action}%"))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    logs = result.scalars().all()
    return logs
