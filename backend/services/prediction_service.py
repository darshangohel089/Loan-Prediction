"""
prediction_service.py
~~~~~~~~~~~~~~~~~~~~~
Handles the prediction logic for a single model or all models.
"""

from typing import Optional
import numpy as np

from services.model_loader import get_model, get_scaler, list_models
from utils.preprocessing import preprocess_input
from schemas.loan_schema import SingleModelResult
from config import MODEL_METRICS


LABELS = {0: "No Default", 1: "Default"}

MODEL_DISPLAY_NAMES = {
    "logistic_regression": "Logistic Regression",
    "decision_tree":       "Decision Tree",
    "knn":                 "K-Nearest Neighbors (k=5)",
    "naive_bayes":         "Naive Bayes",
}


def _run_single(model_name: str, X_scaled: np.ndarray) -> SingleModelResult:
    """Run prediction for one model on already-scaled features."""
    model = get_model(model_name)

    pred_class: int = int(model.predict(X_scaled)[0])
    pred_label: str = LABELS[pred_class]

    # Probability (some models support predict_proba)
    conf: Optional[float] = None
    prob_default: Optional[float] = None
    prob_no_default: Optional[float] = None

    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X_scaled)[0]   # shape (2,) → [P(0), P(1)]
        prob_no_default = float(proba[0])
        prob_default = float(proba[1])
        conf = float(proba[pred_class])

    return SingleModelResult(
        model_name=model_name,
        model_label=MODEL_DISPLAY_NAMES.get(model_name, model_name),
        prediction=pred_class,
        prediction_label=pred_label,
        confidence=conf,
        default_probability=prob_default,
        no_default_probability=prob_no_default,
    )


def predict_single(raw_features: dict, model_name: str) -> SingleModelResult:
    """Preprocess features and predict with the specified model."""
    scaler = get_scaler()
    X_scaled = preprocess_input(raw_features, scaler)
    return _run_single(model_name, X_scaled)


def predict_all(raw_features: dict) -> list[SingleModelResult]:
    """Preprocess features once and predict with all loaded models."""
    scaler = get_scaler()
    X_scaled = preprocess_input(raw_features, scaler)
    results = []
    for name in list_models():
        results.append(_run_single(name, X_scaled))
    return results
