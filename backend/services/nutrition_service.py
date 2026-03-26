from sqlalchemy.orm import Session
from sqlalchemy import func
from models.food import Food


# 🔹 EXISTING: Get foods by category
def get_food_by_category(db: Session, category: str):
    return db.query(Food).filter(Food.category == category).all()


# 🔹 EXISTING: Search food
def search_food(db: Session, keyword: str):
    return db.query(Food).filter(Food.food_name.ilike(f"%{keyword}%")).all()


# 🔥 NEW: Get RANDOM food (used in meal planning)
def get_random_food_by_category(db: Session, category: str):
    return (
        db.query(Food)
        .filter(Food.category == category)
        .order_by(func.random())
        .first()
    )


# 🔥 NEW: Basic meal calorie split
def split_calories(calories: int):
    return {
        "breakfast": int(calories * 0.3),
        "lunch": int(calories * 0.4),
        "dinner": int(calories * 0.3)
    }


# 🔥 NEW: Calculate portion size (grams)
def calculate_portion(food: Food, target_calories: int):
    if food.calories_per_100g == 0:
        return 0

    grams = (target_calories / food.calories_per_100g) * 100
    return round(grams, 2)


# 🔥 NEW: Generate simple meal plan (BASIC VERSION)
def generate_basic_meal_plan(db: Session, total_calories: int):
    meal_split = split_calories(total_calories)

    plan = {}

    # 🔹 Define category mapping (VERY IMPORTANT)
    meal_categories = {
        "breakfast": "grain",
        "lunch": "dal",
        "dinner": "protein"
    }

    for meal, calories in meal_split.items():
        category = meal_categories[meal]
        food = get_random_food_by_category(db, category)

        if not food:
            plan[meal] = {"error": "No food found"}
            continue

        portion = calculate_portion(food, calories)

        plan[meal] = {
            "food": food.food_name,
            "category": food.category,
            "portion_grams": portion,
            "calories_target": calories,
            "reason": f"Selected from {category} category to meet nutritional balance"
        }

    return plan