from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.schemas.user import UserCreate, UserLogin, UserOut
from backend.app.models.user import User
from backend.app.utils.security import get_password_hash, verify_password, create_access_token
from backend.app.api.deps import get_db
from sqlalchemy.future import select
from backend.app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
async def register_user(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    query = select(User).filter(User.email == user_create.email)
    result = await db.execute(query)
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user_create.password)
    is_admin = user_create.email.lower() in [email.lower() for email in settings.ADMIN_EMAILS]
    new_user = User(email=user_create.email, hashed_password=hashed_password, is_admin=is_admin)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login")
async def login_user(user_login: UserLogin, db: AsyncSession = Depends(get_db)):
    query = select(User).filter(User.email == user_login.email)
    result = await db.execute(query)
    user = result.scalars().first()
    if user is None or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(data={"sub": user.email, "is_admin": user.is_admin})
    return {"access_token": access_token, "token_type": "bearer"}
