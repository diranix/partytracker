from fastapi import APIRouter

router = APIRouter(prefix="/nights", tags=["Nights"])

@router.get("/")
def get_nights():
    return [
        {
            "id": 1,
            "title": "Friday Madness",
            "location": "Ronne",
            "mood": "chaotic good"
        }
    ]

@router.post("/")
def create_night():
    return {"message": "Night created"}