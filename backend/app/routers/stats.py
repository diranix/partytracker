from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.database import get_db
from app.models.like import Like
from app.models.night import Night
from app.models.user import User

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    """Global stats (public)."""
    total_nights = db.query(func.count(Night.id)).scalar() or 0
    total_drinks = db.query(func.sum(Night.drinks_count)).scalar() or 0
    avg_rating = db.query(func.avg(Night.rating)).scalar()

    return {
        "total_nights": total_nights,
        "total_drinks": total_drinks,
        "avg_rating": round(avg_rating, 1) if avg_rating is not None else None,
    }


@router.get("/me")
def get_my_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Per-user stats for the profile and memories pages."""
    uid = current_user.id

    nights_count = db.query(func.count(Night.id)).filter(Night.user_id == uid).scalar() or 0
    drinks_total = db.query(func.sum(Night.drinks_count)).filter(Night.user_id == uid).scalar() or 0
    avg_rating = db.query(func.avg(Night.rating)).filter(Night.user_id == uid).scalar()

    # Total likes received on this user's nights
    likes_received = (
        db.query(func.count(Like.id))
        .join(Night, Like.night_id == Night.id)
        .filter(Night.user_id == uid)
        .scalar() or 0
    )

    return {
        "nights_count": nights_count,
        "drinks_total": drinks_total,
        "avg_rating": round(avg_rating, 1) if avg_rating is not None else None,
        "likes_received": likes_received,
    }
