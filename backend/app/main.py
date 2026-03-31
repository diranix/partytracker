from fastapi import FastAPI
from backend.app.db.database import Base, engine
from backend.app.models.night import Night
from backend.app.routers import nights

app = FastAPI(title="Party Tracker API")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Party Tracker API is running"}


app.include_router(nights.router) 