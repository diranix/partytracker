import logging
import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse

from app.db.database import Base, engine
from app.models.like import Like  # noqa: F401 — registers table with SQLAlchemy
from app.models.night import Night  # noqa: F401
from app.models.user import User  # noqa: F401
from app.routers import auth, likes, nights, stats, users

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _run_migrations():
    """Add columns that may be missing from existing tables (no Alembic)."""
    migrations = [
        "ALTER TABLE nights ADD COLUMN IF NOT EXISTS caption  VARCHAR",
        "ALTER TABLE nights ADD COLUMN IF NOT EXISTS location VARCHAR",
        "ALTER TABLE nights ADD COLUMN IF NOT EXISTS mood     VARCHAR",
    ]
    with engine.connect() as conn:
        for sql in migrations:
            try:
                conn.execute(__import__('sqlalchemy').text(sql))
            except Exception as e:
                logger.warning("Migration skipped: %s", e)
        conn.commit()


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
    return PlainTextResponse(str(exc), status_code=500)


@app.get("/")
def root():
    return {"message": "Party Tracker API is running"}


app.include_router(auth.router)
app.include_router(nights.router)
app.include_router(likes.router)
app.include_router(stats.router)
app.include_router(users.router)
