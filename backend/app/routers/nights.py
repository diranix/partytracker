from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.night import Night
from backend.app.schemas.night import NightCreate, NightResponse

router = APIRouter(prefix="/nights", tags=["Nights"])


@router.get("/", response_model=List[NightResponse])
def get_nights(db: Session = Depends(get_db)):
    nights = db.query(Night).all()
    return nights


@router.post("/", response_model=NightResponse)
def create_night(night: NightCreate, db: Session = Depends(get_db)):
    db_night = Night(
        title=night.title,
        location=night.location,
        mood=night.mood
    )
    db.add(db_night)
    db.commit()
    db.refresh(db_night)
    return db_night 