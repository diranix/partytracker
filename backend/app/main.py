import logging
import os
import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.db.database import Base, engine
from app.models.like import Like  # noqa: F401 — registers table with SQLAlchemy
from app.models.night import Night  # noqa: F401
from app.models.user import User  # noqa: F401
from app.routers import auth, likes, nights, stats, users

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_IS_DEV = os.getenv("ENV", "production").lower() in ("dev", "development", "local")


def _run_migrations():
    """Add columns that may be missing from existing tables (no Alembic)."""
    migrations = [
        "ALTER TABLE nights ADD COLUMN IF NOT EXISTS caption  VARCHAR",
        "ALTER TABLE nights ADD COLUMN IF NOT EXISTS location VARCHAR",
        "ALTER TABLE nights ADD COLUMN IF NOT EXISTS mood     VARCHAR",
        "ALTER TABLE nights ADD COLUMN IF NOT EXISTS lat      DOUBLE PRECISION",
        "ALTER TABLE nights ADD COLUMN IF NOT EXISTS lng      DOUBLE PRECISION",
        "ALTER TABLE users  ADD COLUMN IF NOT EXISTS bio      VARCHAR",
        "ALTER TABLE users  ADD COLUMN IF NOT EXISTS location VARCHAR",
    ]
    with engine.connect() as conn:
        for sql in migrations:
            try:
                conn.execute(text(sql))
            except Exception as e:
                logger.warning("Migration skipped: %s", e)
        conn.commit()
    logger.info("Migrations applied")


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    _run_migrations()
    logger.info("Database tables ensured")
    yield


app = FastAPI(title="Party Tracker API", lifespan=lifespan)


@app.exception_handler(Exception)
async def global_exception_handler(_request: Request, exc: Exception):
    logger.error(traceback.format_exc())
    # Never leak internal details (SQL, stack traces) to the client in production
    detail = str(exc) if _IS_DEV else "Internal server error"
    return JSONResponse(status_code=500, content={"detail": detail})


@app.get("/")
def root():
    return {"message": "Party Tracker API is running"}


app.include_router(auth.router)
app.include_router(nights.router)
app.include_router(likes.router)
app.include_router(stats.router)
app.include_router(users.router)
