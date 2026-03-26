from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal

# 🔹 Services
from services.calorie_service import calculate_calories
from services.nutrition_service import (
    get_food_by_category,
    search_food,
    generate_basic_meal_plan,
    calculate_portion
)
from services.hydration_service import calculate_hydration
from services.workout_service import get_workout_recommendation
from services.tips_service import get_daily_tip

router = APIRouter()


# 🔹 DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔥 1. CALORIES
@router.post("/calories")
def get_calories(data: dict):
    required = ["weight", "height", "age", "gender", "activity", "goal"]

    for field in required:
        if field not in data:
            return {"error": f"{field} is required"}

    return {
        "calories": calculate_calories(
            data["weight"],
            data["height"],
            data["age"],
            data["gender"],
            data["activity"],
            data["goal"]
        )
    }


# 🔥 2. FOOD BY CATEGORY
@router.get("/food/category/{category}")
def fetch_food_by_category(category: str, db: Session = Depends(get_db)):
    foods = get_food_by_category(db, category)

    return [
        {
            "id": f.id,
            "name": f.food_name,
            "category": f.category,
            "calories_per_100g": f.calories_per_100g,
            "protein_g": f.protein_g,
            "carbs_g": f.carbs_g,
            "fat_g": f.fat_g
        }
        for f in foods
    ]


# 🔥 3. SEARCH FOOD
@router.get("/food/search")
def search_food_api(keyword: str, db: Session = Depends(get_db)):
    foods = search_food(db, keyword)

    return [
        {
            "id": f.id,
            "name": f.food_name,
            "category": f.category,
            "calories_per_100g": f.calories_per_100g,
            "protein_g": f.protein_g,
            "carbs_g": f.carbs_g,
            "fat_g": f.fat_g
        }
        for f in foods
    ]


# 🔥 4. PORTION CALCULATION
@router.post("/portion")
def get_portion(data: dict, db: Session = Depends(get_db)):
    food_name = data.get("food_name")
    calories = data.get("calories")

    if not food_name or not calories:
        return {"error": "food_name and calories are required"}

    foods = search_food(db, food_name)

    if not foods:
        return {"error": "food not found"}

    food = foods[0]

    portion = calculate_portion(food, calories)

    return {
        "food": food.food_name,
        "portion_grams": portion,
        "target_calories": calories
    }


# 🔥 5. MEAL PLAN
@router.post("/meal-plan")
def get_meal_plan(data: dict, db: Session = Depends(get_db)):
    calories = data.get("calories")

    if not calories:
        return {"error": "calories is required"}

    return {
        "total_calories": calories,
        "meal_plan": generate_basic_meal_plan(db, calories)
    }


# 🔥 6. HYDRATION
@router.post("/hydration")
def get_hydration(data: dict):
    weight = data.get("weight")
    activity = data.get("activity")

    if weight is None or activity is None:
        return {"error": "weight and activity are required"}

    return {
        "hydration_ml_per_day": calculate_hydration(weight, activity)
    }


# 🔥 7. WORKOUT
@router.post("/workout")
def get_workout(data: dict):
    bmi_category = data.get("bmi_category")
    goal = data.get("goal", "general")
    beginner = data.get("beginner", True)

    if not bmi_category:
        return {"error": "bmi_category is required"}

    return get_workout_recommendation(bmi_category, goal, beginner)


# 🔥 8. DAILY TIP
@router.get("/tips")
def get_tip():
    return {
        "tip": get_daily_tip()
    }