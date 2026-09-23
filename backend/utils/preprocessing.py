"""
preprocessing.py
~~~~~~~~~~~~~~~~
Mirrors the EXACT preprocessing pipeline from Loan_default.ipynb:

  1. LabelEncoder applied per column in alphabetical order.
     Since we cannot persist individual encoders for each column,
     we hardcode the mapping dictionaries derived from the notebook's
     alphabetical LabelEncoder behaviour.

  2. Column ordering matches the trained model's feature order
     (after df.columns.str.lower()).

  3. StandardScaler is loaded from disk (fitted on training data)
     and applied to new inputs.
"""

import numpy as np
import pandas as pd
from typing import Any

# ── Hardcoded LabelEncoder mappings (alphabetical order = sklearn default) ────

LABEL_MAPS = {
    "education": {
        "Bachelor's": 0,
        "High School": 1,
        "Master's":  2,
        "PhD":       3,
    },
    "employmenttype": {
        "Full-time":    0,
        "Part-time":    1,
        "Self-employed": 2,
        "Unemployed":   3,
    },
    "maritalstatus": {
        "Divorced": 0,
        "Married":  1,
        "Single":   2,
    },
    "hasmortgage": {
        "No":  0,
        "Yes": 1,
    },
    "hasdependents": {
        "No":  0,
        "Yes": 1,
    },
    "loanpurpose": {
        "Auto":      0,
        "Business":  1,
        "Education": 2,
        "Home":      3,
        "Other":     4,
    },
    "hascosigner": {
        "No":  0,
        "Yes": 1,
    },
}

# Feature order after notebook preprocessing (all lowercased)
FEATURE_ORDER = [
    "age",
    "income",
    "loanamount",
    "creditscore",
    "monthsemployed",
    "numcreditlines",
    "interestrate",
    "loanterm",
    "dti_ratio",
    "education",
    "employmenttype",
    "maritalstatus",
    "hasmortgage",
    "hasdependents",
    "loanpurpose",
    "hascosigner",
]


def encode_input(raw: dict) -> dict:
    """Apply label encoding to categorical fields."""
    encoded = dict(raw)
    for col, mapping in LABEL_MAPS.items():
        if col in encoded:
            val = encoded[col]
            if val not in mapping:
                raise ValueError(
                    f"Unknown value '{val}' for field '{col}'. "
                    f"Expected one of: {list(mapping.keys())}"
                )
            encoded[col] = mapping[val]
    return encoded


def build_feature_array(encoded: dict) -> np.ndarray:
    """Order features and return a 2-D numpy array (1 sample)."""
    row = [encoded[feat] for feat in FEATURE_ORDER]
    return np.array(row, dtype=float).reshape(1, -1)


def preprocess_input(raw: dict, scaler: Any) -> np.ndarray:
    """
    Full preprocessing pipeline for a single prediction:
      raw dict → label encode → ordered array → StandardScaler transform
    """
    encoded = encode_input(raw)
    arr = build_feature_array(encoded)
    return scaler.transform(arr)
