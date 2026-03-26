from sqlalchemy import Column, Integer, String, Float
from database import Base


class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)

    food_name = Column(String, unique=True, index=True)
    category = Column(String)

    calories_per_100g = Column(Float)
    protein_g = Column(Float)
    carbs_g = Column(Float)
    fat_g = Column(Float)