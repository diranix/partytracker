from fastapi import APIRouter

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/")
def get_stats():
    return {
        "total_nights": 3,
        "total_drinks": 12,
        "party_score": 87
    }