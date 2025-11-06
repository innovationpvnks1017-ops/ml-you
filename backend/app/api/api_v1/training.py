import io
import asyncio
from fastapi import APIRouter, Depends, UploadFile, File, WebSocket, WebSocketDisconnect, Query, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.api.deps import get_current_active_user, get_db
from backend.app.schemas.training import TrainingCreate, TrainingOut
from backend.app.models.training import Training, TrainingStatusEnum
from backend.app.models.user import User
from backend.app.utils.model import train_model, save_model
import pandas as pd
from sqlalchemy.future import select
from typing import Dict, Any, Optional

router = APIRouter(prefix="/training", tags=["training"])

training_progress = {}

@router.post("/start", response_model=TrainingOut)
async def start_training(training_create: TrainingCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    # Validate and parse CSV if provided
    csv_bytes = training_create.csv_file
    data = None
    if csv_bytes:
        try:
            csv_stream = io.BytesIO(csv_bytes)
            data = pd.read_csv(csv_stream)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid CSV file")
    else:
        # Manual parameters must include at least 'data' key for training
        if "data" not in training_create.parameters:
            raise HTTPException(status_code=400, detail="No CSV file or manual data provided")
        try:
            data_dict = training_create.parameters.pop("data")
            data = pd.DataFrame(data_dict)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid manual data format")

    # Create training record with status pending
    latest_version = 0
    res = await db.execute(select(Training.model_version).order_by(Training.model_version.desc()))
    latest = res.scalars().first()
    if latest is not None:
        latest_version = latest
    new_version = latest_version + 1
    new_training = Training(
        user_id=current_user.id,
        model_version=new_version,
        status=TrainingStatusEnum.pending,
        parameters=training_create.parameters,
        results=None,
        model_path=None,
    )
    db.add(new_training)
    await db.commit()
    await db.refresh(new_training)

    # start background training task
    asyncio.create_task(run_training(new_training.id, training_create.parameters, data, db))

    return new_training

async def run_training(training_id: int, parameters: Dict[str, Any], data: pd.DataFrame, db: AsyncSession):
    # update status to running
    training = await db.get(Training, training_id)
    training.status = TrainingStatusEnum.running
    await db.commit()
    training_progress[training_id] = 0  # 0% progress

    try:
        # Simulate progress updates
        for i in range(1, 6):
            await asyncio.sleep(1)
            training_progress[training_id] = i * 20  # 20%,40%,60%,80%,100%

        # Train the model
        model, metrics = train_model(parameters, data)

        # Save model
        model_path = save_model(model, training.model_version)

        # Update training record
        training = await db.get(Training, training_id)
        training.status = TrainingStatusEnum.completed
        training.results = metrics
        training.model_path = model_path
        await db.commit()
    except Exception as e:
        training = await db.get(Training, training_id)
        training.status = TrainingStatusEnum.failed
        training.results = {"error": str(e)}
        await db.commit()
    finally:
        training_progress.pop(training_id, None)

@router.websocket("/progress")
async def websocket_training_progress(websocket: WebSocket, training_id: int = Query(...)):
    await websocket.accept()
    try:
        while True:
            progress = training_progress.get(training_id, None)
            if progress is None:
                await websocket.send_json({"progress": 100})
                break
            await websocket.send_json({"progress": progress})
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass

@router.get("/{training_id}", response_model=TrainingOut)
async def get_training(training_id: int, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    training = await db.get(Training, training_id)
    if training is None or training.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Training not found")
    return training
