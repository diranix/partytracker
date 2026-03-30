from fastapi import FastAPI
from app.routers import users, nights, stats

app = FastAPI(title="Party Tracker API")

@app.get("/")
def root():
    return {"message": "Party Tracker API is running"}

app.include_router(users.router)
app.include_router(nights.router)
app.include_router(stats.router)