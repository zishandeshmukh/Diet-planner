from sqlalchemy import Column, Integer, Float, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from database import Base


class BodyMetric(Base):
    __tablename__ = "body_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    weight_kg = Column(Float, nullable=False)
    bmi = Column(Float)
    body_fat = Column(Float)
    recorded_at = Column(TIMESTAMP, server_default=func.now())