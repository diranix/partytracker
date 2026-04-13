from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.hashing import verify_password
from app.core.security import create_access_token
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import AuthResponse, UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=AuthResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user.id)
    return {"token": token, "user": UserResponse.model_validate(user)}
