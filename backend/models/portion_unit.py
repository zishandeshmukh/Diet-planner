from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base


class PortionUnit(Base):
    __tablename__ = "portion_units"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("foods.id", ondelete="CASCADE"))
    unit_name = Column(String(50), nullable=False)
    grams_equivalent = Column(Float, nullable=False)