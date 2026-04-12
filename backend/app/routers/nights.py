from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.database import get_db
from app.models.like import Like
from app.models.night import Night
from app.models.user import User
from app.schemas.night import NightCreate, NightResponse

router = APIRouter(prefix="/nights", tags=["Nights"])


def with_like_count(night: Night, db: Session) -> dict:
    data = NightResponse.model_validate(night).model_dump()
    data["like_count"] = db.query(Like).filter(Like.night_id == night.id).count()
    return data


@router.get("/", response_model=List[NightResponse])
def get_nights(db: Session = Depends(get_db)):
    nights = db.query(Night).order_by(Night.created_at.desc()).all()
    return [with_like_count(n, db) for n in nights]


@router.get("/my", response_model=List[NightResponse])
def get_my_nights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    nights = db.query(Night).filter(Night.user_id == current_user.id).order_by(Night.created_at.desc()).all()
    return [with_like_count(n, db) for n in nights]


@router.get("/{night_id}", response_model=NightResponse)
def get_night(night_id: int, db: Session = Depends(get_db)):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")
    return with_like_count(night, db)


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
    return with_like_count(db_night, db)


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
    return with_like_count(night, db)


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
