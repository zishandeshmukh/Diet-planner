from services.rule_engine import load_rule


def calculate_hydration(weight, activity):
    rules = load_rule("hydration_rules.json")

    base = weight * rules["base_ml_per_kg"]
    bonus = rules["activity_bonus_ml"].get(activity, 0)

    return int(base + bonus)
