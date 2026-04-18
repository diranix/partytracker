from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_optional_user
from app.db.database import get_db
from app.models.like import Like
from app.models.night import Night
from app.models.user import User
from app.schemas.night import NightCreate, NightResponse

router = APIRouter(prefix="/nights", tags=["Nights"])


def _build_response(night: Night, like_count: int, liked_by_me: bool) -> dict:
    data = NightResponse.model_validate(night).model_dump()
    data["like_count"] = like_count
    data["liked_by_me"] = liked_by_me
    return data


def _attach_meta_batch(nights: List[Night], db: Session, current_user_id: Optional[int]) -> List[dict]:
    """Build response dicts for a list of nights using 2 queries total instead of 2*N."""
    if not nights:
        return []

    night_ids = [n.id for n in nights]

    counts: dict[int, int] = dict(
        db.query(Like.night_id, func.count(Like.id))
        .filter(Like.night_id.in_(night_ids))
        .group_by(Like.night_id)
        .all()
    )

    liked: set[int] = set()
    if current_user_id:
        liked = {
            row.night_id
            for row in db.query(Like.night_id)
            .filter(Like.night_id.in_(night_ids), Like.user_id == current_user_id)
            .all()
        }

    return [
        _build_response(n, counts.get(n.id, 0), n.id in liked)
        for n in nights
    ]


def _attach_meta_single(night: Night, db: Session, current_user_id: Optional[int]) -> dict:
    like_count = db.query(func.count(Like.id)).filter(Like.night_id == night.id).scalar() or 0
    liked_by_me = False
    if current_user_id:
        liked_by_me = db.query(Like).filter(
            Like.night_id == night.id,
            Like.user_id == current_user_id,
        ).first() is not None
    return _build_response(night, like_count, liked_by_me)


@router.get("/", response_model=List[NightResponse])
def get_nights(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    nights = db.query(Night).order_by(Night.created_at.desc()).all()
    return _attach_meta_batch(nights, db, current_user.id if current_user else None)


@router.get("/my", response_model=List[NightResponse])
def get_my_nights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    nights = (
        db.query(Night)
        .filter(Night.user_id == current_user.id)
        .order_by(Night.created_at.desc())
        .all()
    )
    return _attach_meta_batch(nights, db, current_user.id)


@router.get("/{night_id}", response_model=NightResponse)
def get_night(
    night_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")
    return _attach_meta_single(night, db, current_user.id if current_user else None)


@router.post("/", response_model=NightResponse, status_code=201)
def create_night(
    night: NightCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_night = Night(
        user_id=current_user.id,
        title=night.title,
        caption=night.caption,
        location=night.location,
        mood=night.mood,
        drinks_count=night.drinks_count,
        rating=night.rating,
    )
    db.add(db_night)
    db.commit()
    db.refresh(db_night)
    return _build_response(db_night, 0, False)


@router.put("/{night_id}", response_model=NightResponse)
def update_night(
    night_id: int,
    updated: NightCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")
    if night.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    night.title = updated.title
    night.caption = updated.caption
    night.location = updated.location
    night.mood = updated.mood
    night.drinks_count = updated.drinks_count
    night.rating = updated.rating

    db.commit()
    db.refresh(night)
    return _attach_meta_single(night, db, current_user.id)


@router.delete("/{night_id}", status_code=200)
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
