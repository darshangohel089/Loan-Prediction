import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Base directory (backend/)
BASE_DIR = Path(__file__).resolve().parent

DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/loan_predictions.db")

ALLOWED_ORIGINS: list[str] = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

MODEL_DIR: Path = BASE_DIR / os.getenv("MODEL_DIR", "models")

DATA_PATH: Path = BASE_DIR / os.getenv("DATA_PATH", "../Loan_default.csv")

# --- Model filenames ---
MODEL_FILES = {
    "logistic_regression": MODEL_DIR / "logistic_regression.pkl",
    "decision_tree":       MODEL_DIR / "decision_tree.pkl",
    "knn":                 MODEL_DIR / "knn.pkl",
    "naive_bayes":         MODEL_DIR / "naive_bayes.pkl",
}
SCALER_FILE = MODEL_DIR / "scaler.pkl"

# --- Stored metrics from notebook outputs ---
MODEL_METRICS = {
    "logistic_regression": {
        "name": "Logistic Regression",
        "accuracy":  0.8858625416095555,
        "precision": 0.6203389830508474,
        "recall":    0.031016949152542373,
        "f1_score":  0.05907990314769976,
        "confusion_matrix": [[45058, 112], [5717, 183]],
    },
    "decision_tree": {
        "name": "Decision Tree",
        "accuracy":  0.8024672018797728,
        "precision": 0.19722382880277617,
        "recall":    0.2311864406779661,
        "f1_score":  0.2128589263420724,
        "confusion_matrix": [[39618, 5552], [4536, 1364]],
    },
    "knn": {
        "name": "K-Nearest Neighbors (k=5)",
        "accuracy":  0.8756804386136675,
        "precision": 0.32529182879377433,
        "recall":    0.07084745762711864,
        "f1_score":  0.1163535142658316,
        "confusion_matrix": [[44303, 867], [5482, 418]],
    },
    "naive_bayes": {
        "name": "Naive Bayes",
        "accuracy":  0.8853730174270609,
        "precision": 0.6642857142857143,
        "recall":    0.01576271186440678,
        "f1_score":  0.030794701986754967,
        "confusion_matrix": [[45123, 47], [5807, 93]],
    },
}

# --- Dataset statistics ---
DATASET_STATS = {
    "total_rows": 255347,
    "total_features": 16,
    "target": "Default (Loan_Status)",
    "default_rate": 0.2192,   # approx from dataset
    "no_default_rate": 0.7808,
}
