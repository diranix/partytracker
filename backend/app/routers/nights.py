from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.database import get_db
from app.models.night import Night
from app.models.user import User
from app.schemas.night import NightCreate, NightResponse

router = APIRouter(prefix="/nights", tags=["Nights"])


@router.get("/", response_model=List[NightResponse])
def get_nights(db: Session = Depends(get_db)):
    return db.query(Night).order_by(Night.created_at.desc()).all()


@router.get("/my", response_model=List[NightResponse])
def get_my_nights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Night).filter(Night.user_id == current_user.id).order_by(Night.created_at.desc()).all()


@router.get("/{night_id}", response_model=NightResponse)
def get_night(night_id: int, db: Session = Depends(get_db)):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")
    return night


@router.post("/", response_model=NightResponse)
def create_night(
    night: NightCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_night = Night(
        user_id=current_user.id,
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
def update_night(
    night_id: int,
    updated_night: NightCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")
    if night.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    night.title = updated_night.title
    night.location = updated_night.location
    night.mood = updated_night.mood
    night.drinks_count = updated_night.drinks_count
    night.rating = updated_night.rating

    db.commit()
    db.refresh(night)
    return night


@router.delete("/{night_id}")
def delete_night(
    night_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")
    if night.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(night)
    db.commit()
    return {"message": "Night deleted"}
