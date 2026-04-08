from sqlalchemy import Column, Integer, String
from app.db.database import Base


class Night(Base):
    __tablename__ = "nights"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    mood = Column(String, nullable=False)
    drinks_count = Column(Integer, nullable=False, default=0)
    rating = Column(Integer, nullable=False, default=5)
