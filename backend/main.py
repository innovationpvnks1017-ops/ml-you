import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.websockets import WebSocket
from starlette.websockets import WebSocketDisconnect
from starlette.middleware.sessions import SessionMiddleware
from backend.app.api.api_v1 import auth, training, admin, dashboard
from backend.app.core.config import settings
from fastapi.exceptions import HTTPException

app = FastAPI(title="MLops Intelligent Analyzer Backend")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(training.router, prefix="/training")
app.include_router(admin.router, prefix="/admin")
app.include_router(dashboard.router, prefix="/dashboard")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    return JSONResponse(status_code=422, content={"detail": errors})

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
