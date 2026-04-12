from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Night(Base):
    __tablename__ = "nights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    mood = Column(String, nullable=False)
    drinks_count = Column(Integer, nullable=False, default=0)
    rating = Column(Integer, nullable=False, default=5)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    user = relationship("User", back_populates="nights")
    likes = relationship("Like", back_populates="night", cascade="all, delete-orphan")
