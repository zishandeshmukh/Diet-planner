import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes.metrics import router as metrics_router
from routes.nutrition import router as nutrition_router
from routes.auth import router as auth_router
from routes.user import router as user_router
from models import user, body_metric, food, portion_unit, hydration_log, workout_log

load_dotenv()

app = FastAPI(title="FitFuel API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:8080")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Create tables ─────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── Routers ───────────────────────────────────────────
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(user_router, prefix="/user", tags=["User"])
app.include_router(metrics_router, prefix="/metrics", tags=["Metrics"])
app.include_router(nutrition_router, prefix="/nutrition", tags=["Nutrition"])


@app.get("/")
def root():
    return {"message": "FitFuel API running", "status": "ok"}