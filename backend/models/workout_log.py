from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from database import Base


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    workout_type = Column(String(100))
    duration_min = Column(Integer)
    intensity = Column(String(50))
    logged_at = Column(TIMESTAMP, server_default=func.now())