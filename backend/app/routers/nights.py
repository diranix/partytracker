from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.night import Night
from app.schemas.night import NightCreate, NightResponse

router = APIRouter(prefix="/nights", tags=["Nights"])


@router.get("/", response_model=List[NightResponse])
def get_nights(db: Session = Depends(get_db)):
    nights = db.query(Night).all()
    return nights


@router.get("/{night_id}", response_model=NightResponse)
def get_night(night_id: int, db: Session = Depends(get_db)):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")
    return night


@router.post("/", response_model=NightResponse)
def create_night(night: NightCreate, db: Session = Depends(get_db)):
    db_night = Night(
        title=night.title,
        location=night.location,
        mood=night.mood,
        drinks_count=night.drinks_count,
        rating=night.rating,
    )
    db.add(db_night)
    db.commit()
    db.refresh(db_night)
    return db_night


@router.put("/{night_id}", response_model=NightResponse)
def update_night(night_id: int, updated_night: NightCreate, db: Session = Depends(get_db)):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")

    night.title = updated_night.title
    night.location = updated_night.location
    night.mood = updated_night.mood
    night.drinks_count = updated_night.drinks_count
    night.rating = updated_night.rating

    db.commit()
    db.refresh(night)
    return night


@router.delete("/{night_id}")
def delete_night(night_id: int, db: Session = Depends(get_db)):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")

    db.delete(night)
    db.commit()
    return {"message": "Night deleted"}
