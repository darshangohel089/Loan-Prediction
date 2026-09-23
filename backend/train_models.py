# -*- coding: utf-8 -*-
"""
train_models.py
~~~~~~~~~~~~~~~
Replicates the EXACT preprocessing and model training pipeline from
Loan_default.ipynb, then saves all models and the scaler to disk.

Run this once from the backend/ directory:
    python train_models.py

This script reads ../Loan_default.csv (relative to backend/).
"""

import os
import sys
import time
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix
)

# ── Resolve paths ──────────────────────────────────────────────────────────────
BACKEND_DIR = Path(__file__).resolve().parent
CSV_PATH    = BACKEND_DIR / ".." / "Loan_default.csv"
MODEL_DIR   = BACKEND_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)

print("=" * 60)
print("  Loan Default Prediction -- Model Training Script")
print("=" * 60)

# ── Step 1: Load data ──────────────────────────────────────────────────────────
print(f"\n[1/9] Loading dataset from: {CSV_PATH.resolve()}")
if not CSV_PATH.exists():
    sys.exit(f"ERROR: CSV not found at {CSV_PATH.resolve()}")

df = pd.read_csv(CSV_PATH)
print(f"      Loaded {len(df):,} rows × {len(df.columns)} columns")

# ── Step 2: Drop duplicates + reset index (notebook cell 13-14) ───────────────
print("[2/9] Dropping duplicates and resetting index ...")
df = df.drop_duplicates().reset_index()   # adds 'index' column

# ── Step 3: Rename DTIRatio → DTI_Ratio (notebook cell 16) ───────────────────
print("[3/9] Renaming DTIRatio -> DTI_Ratio ...")
if "DTIRatio" in df.columns:
    df = df.rename(columns={"DTIRatio": "DTI_Ratio"})

# ── Step 4: Drop LoanID and index columns (notebook cells 50, 52) ─────────────
print("[4/9] Dropping LoanID and index columns ...")
drop_cols = [c for c in ["LoanID", "index"] if c in df.columns]
df = df.drop(columns=drop_cols)
df = df.drop_duplicates()   # notebook cell 55

# ── Step 5: Label-encode categorical columns (notebook cell 68) ───────────────
print("[5/9] Label-encoding categorical columns ...")
le = LabelEncoder()
cat_cols = df.select_dtypes(include=["object", "str"]).columns.tolist()
# exclude target
cat_cols = [c for c in cat_cols if c != "Default"]
for col in cat_cols:
    df[col] = le.fit_transform(df[col].astype(str))

# ── Step 6: Lowercase all column names (notebook cell 70) ─────────────────────
print("[6/9] Lowercasing column names ...")
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# ── Step 7: Rename target (notebook cell 72) ──────────────────────────────────
print("[7/9] Renaming 'default' -> 'loan_status' ...")
df = df.rename(columns={"default": "loan_status"})

# ── Step 8: Split features / target, train-test split, scale ──────────────────
print("[8/9] Splitting and scaling data ...")
X = df.drop("loan_status", axis=1)
y = df["loan_status"]

print(f"      Feature columns: {list(X.columns)}")
print(f"      Target distribution:\n{y.value_counts().to_string()}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# Save scaler
joblib.dump(scaler, MODEL_DIR / "scaler.pkl")
print(f"      Scaler saved -> {MODEL_DIR / 'scaler.pkl'}")

# ── Step 9: Train all 4 models ─────────────────────────────────────────────────
print("[9/9] Training models ...")

models = {
    "logistic_regression": LogisticRegression(random_state=42, max_iter=1000),
    "decision_tree":       DecisionTreeClassifier(random_state=42),
    "knn":                 KNeighborsClassifier(n_neighbors=5),
    "naive_bayes":         GaussianNB(),
}

results = {}
for name, model in models.items():
    t0 = time.time()
    print(f"\n  Training: {name} ...", end=" ", flush=True)
    model.fit(X_train_s, y_train)
    elapsed = time.time() - t0
    print(f"done ({elapsed:.1f}s)")

    y_pred = model.predict(X_test_s)

    acc  = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec  = recall_score(y_test, y_pred, zero_division=0)
    f1   = f1_score(y_test, y_pred, zero_division=0)
    cm   = confusion_matrix(y_test, y_pred).tolist()

    results[name] = {
        "accuracy": acc, "precision": prec,
        "recall": rec, "f1_score": f1, "confusion_matrix": cm
    }

    print(f"    Accuracy={acc:.4f}  Precision={prec:.4f}  "
          f"Recall={rec:.4f}  F1={f1:.4f}")

    out_path = MODEL_DIR / f"{name}.pkl"
    joblib.dump(model, out_path)
    print(f"    Saved -> {out_path}")

# ── Summary ────────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("  Training Complete! All models saved to backend/models/")
print("=" * 60)
print("\nMetrics summary:")
header = f"{'Model':<35} {'Acc':>7} {'Prec':>7} {'Rec':>7} {'F1':>7}"
print(header)
print("-" * len(header))
for name, m in results.items():
    print(f"{name:<35} {m['accuracy']:>7.4f} {m['precision']:>7.4f} "
          f"{m['recall']:>7.4f} {m['f1_score']:>7.4f}")

print("\nNow start the backend:")
print("  cd backend")
print("  uvicorn main:app --reload --host 0.0.0.0 --port 8000")
