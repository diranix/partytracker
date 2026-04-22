from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class NightCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    caption: Optional[str] = Field(default=None, max_length=500)
    location: Optional[str] = Field(default=None, max_length=120)
    lat: Optional[float] = Field(default=None, ge=-90, le=90)
    lng: Optional[float] = Field(default=None, ge=-180, le=180)
    mood: Optional[str] = Field(default=None, max_length=30)
    drinks_count: int = Field(default=0, ge=0, le=100)
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
