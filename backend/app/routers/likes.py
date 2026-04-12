from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.database import get_db
from app.models.like import Like
from app.models.night import Night
from app.models.user import User

router = APIRouter(prefix="/nights", tags=["Likes"])


@router.post("/{night_id}/like")
def toggle_like(
    night_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    night = db.query(Night).filter(Night.id == night_id).first()
    if night is None:
        raise HTTPException(status_code=404, detail="Night not found")

    existing = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.night_id == night_id,
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        liked = False
    else:
        db.add(Like(user_id=current_user.id, night_id=night_id))
        db.commit()
        liked = True

    like_count = db.query(Like).filter(Like.night_id == night_id).count()
    return {"liked": liked, "like_count": like_count}
