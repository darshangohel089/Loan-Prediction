"""
routes/predict.py
~~~~~~~~~~~~~~~~~
POST /api/predict        → predict with selected model
POST /api/predict/all    → compare prediction from all models
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from schemas.loan_schema import LoanInput, PredictionResponse, AllModelsResult, SingleModelResult
from services.prediction_service import predict_single, predict_all
from database import get_db, PredictionHistory

router = APIRouter(prefix="/api/predict", tags=["Prediction"])


def _raw_features(inp: LoanInput) -> dict:
    """Extract raw (non-encoded) features from the input object."""
    data = inp.model_dump(exclude={"model_name"})
    return data


def _save_history(db: Session, result: SingleModelResult, raw: dict) -> None:
    record = PredictionHistory(
        model_used=result.model_name,
        prediction=result.prediction,
        prediction_label=result.prediction_label,
        confidence=result.confidence,
        input_features=json.dumps(raw),
    )
    db.add(record)
    db.commit()


@router.post("", response_model=PredictionResponse)
async def predict_one(inp: LoanInput, db: Session = Depends(get_db)):
    """
    Predict loan default using the selected model.
    """
    raw = _raw_features(inp)
    try:
        result = predict_single(raw, inp.model_name)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    _save_history(db, result, raw)

    return PredictionResponse(
        result=result,
        input_summary=raw,
    )


@router.post("/all", response_model=AllModelsResult)
async def predict_compare(inp: LoanInput, db: Session = Depends(get_db)):
    """
    Run prediction on ALL models and return all results for comparison.
    """
    raw = _raw_features(inp)
    try:
        results = predict_all(raw)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    # Save each model's result to history
    for result in results:
        _save_history(db, result, raw)

    return AllModelsResult(results=results, input_summary=raw)
