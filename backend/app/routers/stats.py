from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.night import Night

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    total_nights = db.query(func.count(Night.id)).scalar() or 0
    total_drinks = db.query(func.sum(Night.drinks_count)).scalar() or 0
    avg_rating = db.query(func.avg(Night.rating)).scalar()

    return {
        "total_nights": total_nights,
        "total_drinks": total_drinks,
        "avg_rating": round(avg_rating, 1) if avg_rating is not None else None,
    }