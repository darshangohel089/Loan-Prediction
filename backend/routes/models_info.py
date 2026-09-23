"""
routes/models_info.py
~~~~~~~~~~~~~~~~~~~~~
GET /api/models          → list all models with their metrics
GET /api/models/{key}    → metrics for a specific model
"""

from fastapi import APIRouter, HTTPException
from schemas.loan_schema import ModelMetrics
from config import MODEL_METRICS, DATASET_STATS

router = APIRouter(prefix="/api/models", tags=["Models"])


@router.get("", response_model=list[ModelMetrics])
async def get_all_models():
    """Return metrics for all available classification models."""
    return [
        ModelMetrics(key=k, **v)
        for k, v in MODEL_METRICS.items()
    ]


@router.get("/dataset-stats")
async def get_dataset_stats():
    """Return high-level dataset statistics."""
    return DATASET_STATS


@router.get("/{model_key}", response_model=ModelMetrics)
async def get_model_info(model_key: str):
    """Return metrics for a specific model."""
    if model_key not in MODEL_METRICS:
        raise HTTPException(
            status_code=404,
            detail=f"Model '{model_key}' not found. "
                   f"Available: {list(MODEL_METRICS.keys())}"
        )
    return ModelMetrics(key=model_key, **MODEL_METRICS[model_key])
