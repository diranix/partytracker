from pydantic import BaseModel


class NightCreate(BaseModel):
    title: str
    location: str
    mood: str


class NightResponse(NightCreate):
    id: int

    class Config:
        from_attributes = True