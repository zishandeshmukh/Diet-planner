import sys
import os
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models.food import Food

df = pd.read_csv("data/indian_food_cleaned.csv")

db = SessionLocal()

for _, row in df.iterrows():
    food = Food(
        food_name=row["food_name"],
        category=row["category"],
        calories_per_100g=row["calories_per_100g"],
        protein_g=row["protein_g"],
        carbs_g=row["carbs_g"],
        fat_g=row["fat_g"]
    )
    db.add(food)

db.commit()
db.close()

print("Food data imported successfully")