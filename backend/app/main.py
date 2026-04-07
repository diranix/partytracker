from fastapi import FastAPI
from app.db.database import Base, engine
from app.models.night import Night
from app.routers import nights

app = FastAPI(title="Party Tracker API", root_path="/api"")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Party Tracker API is running"}


app.include_router(nights.router) 
