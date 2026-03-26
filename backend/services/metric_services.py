from services.rule_engine import load_rule, classify_range


def calculate_bmi(weight: float, height_cm: float):
    height_m = height_cm / 100
    bmi = weight / (height_m ** 2)

    bmi_rules = load_rule("bmi_rules.json")
    category = classify_range(bmi, bmi_rules)

    return round(bmi, 2), category


def calculate_bodyfat_male(bmi, age):
    # Deurenberg Formula
    return round((1.20 * bmi) + (0.23 * age) - 16.2, 2)


def calculate_bodyfat_female(bmi, age):
    return round((1.20 * bmi) + (0.23 * age) - 5.4, 2)


def classify_bodyfat(value, gender):
    rules = load_rule("bodyfat_rules.json")
    gender_rules = rules[gender]
    return classify_range(value, gender_rules)
