from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User

router = APIRouter()


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    user = db.query(User).filter(User.email == email).first()

    if not user or user.password != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
        "token": f"fitfuel-token-{user.id}",
    }


@router.post("/signup")
def signup(data: dict, db: Session = Depends(get_db)):
    required = ["name", "email", "password", "age", "gender", "height_cm"]
    for field in required:
        if field not in data:
            raise HTTPException(status_code=400, detail=f"{field} is required")

    # Check if email already exists
    existing = db.query(User).filter(User.email == data["email"]).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    new_user = User(
        name=data["name"],
        email=data["email"],
        password=data["password"],
        age=data["age"],
        gender=data["gender"],
        height_cm=data["height_cm"],
        weight_kg=data.get("weight_kg", 70.0),
        activity_level=data.get("activity_level", "moderate"),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
        },
        "token": f"fitfuel-token-{new_user.id}",
    }
