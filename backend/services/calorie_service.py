from services.rule_engine import load_rule


def calculate_bmr(weight, height, age, gender):
    if gender == "male":
        return (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        return (10 * weight) + (6.25 * height) - (5 * age) - 161


def calculate_calories(weight, height, age, gender, activity, goal):
    rules = load_rule("calorie_rules.json")

    bmr = calculate_bmr(weight, height, age, gender)
    tdee = bmr * rules["activity_multipliers"][activity]
    adjusted = tdee + rules["goal_adjustment"][goal]

    return round(adjusted)
