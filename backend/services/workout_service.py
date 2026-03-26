from services.rule_engine import load_rule


def get_workout_recommendation(bmi_category: str, goal: str = "general", beginner: bool = True):
    rules = load_rule("workout_rules.json")

    base = rules.get(bmi_category, {
        "focus": "General Fitness",
        "intensity": "Moderate",
        "duration_min": 30
    })

    # 🔥 Adjust based on goal
    if goal == "fat_loss":
        exercises = ["Jump Rope", "Running", "Burpees", "Cycling"]
    elif goal == "muscle_gain":
        exercises = ["Push-ups", "Squats", "Deadlifts", "Pull-ups"]
    else:
        exercises = ["Walking", "Light Jogging", "Stretching"]

    # 🔥 Adjust based on beginner level
    if beginner:
        sets = 2
        reps = "10-12"
        duration = base["duration_min"]
        safety = "Start slow, focus on form, avoid overtraining"
    else:
        sets = 4
        reps = "12-15"
        duration = base["duration_min"] + 15
        safety = "Maintain intensity, ensure proper recovery"

    return {
        "focus": base["focus"],
        "intensity": base["intensity"],
        "duration_min": duration,
        "exercises": exercises,
        "sets": sets,
        "reps": reps,
        "safety_note": safety
    }