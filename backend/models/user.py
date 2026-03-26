from sqlalchemy import Column, Integer, String, Float, TIMESTAMP
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    height_cm = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())