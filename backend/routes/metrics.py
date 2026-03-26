from fastapi import APIRouter
from services.metric_services import (
    calculate_bmi,
    calculate_bodyfat_male,
    calculate_bodyfat_female,
    classify_bodyfat
)

router = APIRouter()


@router.post("/calculate")
def calculate_metrics(data: dict):
    weight = data["weight"]
    height = data["height"]
    age = data["age"]
    gender = data["gender"].lower()

    # BMI
    bmi, bmi_category = calculate_bmi(weight, height)

    # Body Fat
    if gender == "male":
        bodyfat = calculate_bodyfat_male(bmi, age)
    elif gender == "female":
        bodyfat = calculate_bodyfat_female(bmi, age)
    else:
        return {"error": "Invalid gender"}

    bodyfat_category = classify_bodyfat(bodyfat, gender)

    return {
        "bmi": bmi,
        "bmi_category": bmi_category,
        "bodyfat_percentage": bodyfat,
        "bodyfat_category": bodyfat_category
    }