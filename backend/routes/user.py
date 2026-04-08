from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User

router = APIRouter()


@router.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "age": user.age,
        "gender": user.gender,
        "height": user.height_cm,
        "weight": user.weight_kg,
        "activityLevel": user.activity_level,
    }


@router.put("/profile/{user_id}")
def update_profile(user_id: int, data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update only provided fields
    if "name" in data:
        user.name = data["name"]
    if "age" in data:
        user.age = int(data["age"])
    if "gender" in data:
        user.gender = data["gender"]
    if "height" in data:
        user.height_cm = float(data["height"])
    if "weight" in data:
        user.weight_kg = float(data["weight"])
    if "activityLevel" in data:
        user.activity_level = data["activityLevel"]

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "age": user.age,
        "gender": user.gender,
        "height": user.height_cm,
        "weight": user.weight_kg,
        "activityLevel": user.activity_level,
    }
