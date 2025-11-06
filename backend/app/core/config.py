from pydantic import BaseSettings, Field, validator
from typing import List
import os

class Settings(BaseSettings):
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    ADMIN_EMAILS: List[str] = Field(default_factory=list, env="ADMIN_EMAILS")

    @validator("ADMIN_EMAILS", pre=True)
    def split_admin_emails(cls, v):
        if isinstance(v, str):
            return [email.strip() for email in v.split(",") if email.strip()]
        elif isinstance(v, list):
            return v
        return []

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../backend.env")
        env_file_encoding = "utf-8"

settings = Settings()
