from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from backend.app.db.database import Base

class TrainingStatusEnum(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"

class Training(Base):
    __tablename__ = "trainings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    model_version = Column(Integer, nullable=False, default=1)
    status = Column(Enum(TrainingStatusEnum), default=TrainingStatusEnum.pending, nullable=False)
    parameters = Column(JSON, nullable=False)
    results = Column(JSON, nullable=True)
    model_path = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="trainings")
