"""
main.py — FastAPI application entry point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ALLOWED_ORIGINS
from database import create_tables
from services.model_loader import load_all_models
from routes import predict, models_info, history


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create DB tables and load ML models."""
    create_tables()
    load_all_models()
    print("[OK] Models loaded and database ready.")
    yield
    # Shutdown actions (none needed)


app = FastAPI(
    title="Loan Default Prediction API",
    description=(
        "A complete ML API for predicting loan defaults using "
        "Logistic Regression, Decision Tree, KNN, and Naive Bayes classifiers."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(predict.router)
app.include_router(models_info.router)
app.include_router(history.router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Loan Default Prediction API",
        "docs": "/api/docs",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Root"])
async def health():
    return {"status": "ok"}
