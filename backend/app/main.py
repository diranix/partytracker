from fastapi import FastAPI
from app.db.database import Base, engine
from app.models.night import Night  # noqa: F401
from app.models.user import User  # noqa: F401
from app.routers import auth, nights, stats, users
from app.routers import nights, users

app = FastAPI(title="Party Tracker API", root_path="/api")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Party Tracker API is running"}


app.include_router(auth.router)
app.include_router(nights.router)
app.include_router(stats.router)
app.include_router(users.router)