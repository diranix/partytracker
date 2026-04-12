from datetime import datetime

from pydantic import BaseModel, Field


class NightCreate(BaseModel):
    title: str
    location: str
    mood: str
    drinks_count: int = Field(default=0, ge=0)
    rating: int = Field(default=5, ge=1, le=10)


class NightAuthor(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


class NightResponse(NightCreate):
    id: int
    user_id: int
    user: NightAuthor
    created_at: datetime
    like_count: int = 0

    class Config:
        from_attributes = True
