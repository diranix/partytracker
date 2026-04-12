from fastapi import FastAPI

from app.db.database import Base, engine
from app.models.like import Like  # noqa: F401 — needed for SQLAlchemy to register the table
from app.models.night import Night  # noqa: F401
from app.models.user import User  # noqa: F401
from app.routers import auth, likes, nights, stats, users

app = FastAPI(title="Party Tracker API", root_path="/api")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Party Tracker API is running"}


app.include_router(auth.router)
app.include_router(nights.router)
app.include_router(likes.router)
app.include_router(stats.router)
app.include_router(users.router)
