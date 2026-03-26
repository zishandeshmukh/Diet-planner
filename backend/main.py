from fastapi import FastAPI
from database import Base, engine
from routes.metrics import router as metrics_router
from routes.nutrition import router as nutrition_router
from models import user, body_metric, food, portion_unit, hydration_log, workout_log

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(metrics_router, prefix="/metrics")
app.include_router(nutrition_router, prefix="/nutrition")

@app.get("/")
def root():
    return {"message": "FitFuel API running"}