from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class NightCreate(BaseModel):
    title: str
    caption: Optional[str] = None
    location: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    mood: Optional[str] = None
    drinks_count: int = Field(default=0, ge=0)
    rating: int = Field(default=5, ge=1, le=10)


class NightAuthor(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


class NightResponse(BaseModel):
    id: int
    title: str
    caption: Optional[str] = None
    location: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    mood: Optional[str] = None
    drinks_count: int
    rating: int
    user_id: int
    user: NightAuthor
    created_at: datetime
    like_count: int = 0
    liked_by_me: bool = False

    class Config:
        from_attributes = True
