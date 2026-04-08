from pydantic import BaseModel, Field


class NightCreate(BaseModel):
    title: str
    location: str
    mood: str
    drinks_count: int = Field(default=0, ge=0)
    rating: int = Field(default=5, ge=1, le=10)


class NightResponse(NightCreate):
    id: int

    class Config:
        from_attributes = True