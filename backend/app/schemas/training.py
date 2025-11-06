from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class TrainingStatusEnum(str, Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"

class TrainingCreate(BaseModel):
    parameters: Dict[str, Any]
    csv_file: Optional[bytes] = None  # Optional raw CSV file bytes

class TrainingOut(BaseModel):
    id: int
    user_id: int
    model_version: int
    status: TrainingStatusEnum
    parameters: Dict[str, Any]
    results: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class TrainingUpdate(BaseModel):
    status: TrainingStatusEnum
