"""
model_loader.py
~~~~~~~~~~~~~~~
Loads all trained .pkl model files and the scaler from disk at startup.
Raises a clear error if models have not been trained yet (run train_models.py first).
"""

import joblib
from pathlib import Path
from typing import Any
from config import MODEL_FILES, SCALER_FILE


# In-memory store populated at startup
_models: dict[str, Any] = {}
_scaler: Any = None


def load_all_models() -> None:
    """Load models and scaler from disk. Called once during app startup."""
    global _scaler

    missing = []
    for name, path in MODEL_FILES.items():
        if not Path(path).exists():
            missing.append(str(path))

    if not Path(SCALER_FILE).exists():
        missing.append(str(SCALER_FILE))

    if missing:
        raise RuntimeError(
            "Trained model files not found. "
            "Please run  `python train_models.py`  from the backend/ directory first.\n"
            "Missing files:\n  " + "\n  ".join(missing)
        )

    for name, path in MODEL_FILES.items():
        _models[name] = joblib.load(path)

    _scaler = joblib.load(SCALER_FILE)


def get_model(name: str) -> Any:
    if name not in _models:
        raise KeyError(f"Model '{name}' is not loaded. Available: {list(_models.keys())}")
    return _models[name]


def get_scaler() -> Any:
    if _scaler is None:
        raise RuntimeError("Scaler not loaded. Was load_all_models() called?")
    return _scaler


def list_models() -> list[str]:
    return list(_models.keys())
