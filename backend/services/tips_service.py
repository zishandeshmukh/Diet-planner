import random


TIPS = [
    "Drink water before meals to control calorie intake",
    "Include protein in every meal for better muscle recovery",
    "Avoid sugary drinks and switch to water or lemon water",
    "Eat slowly to improve digestion and satiety",
    "Include fruits and vegetables daily",
    "Sleep at least 7 hours for proper recovery",
    "Stay consistent with workouts rather than going extreme"
]


def get_daily_tip():
    return random.choice(TIPS)