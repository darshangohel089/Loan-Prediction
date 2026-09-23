# LoanGuard — Loan Default Prediction Web App

> A full-stack ML web application for predicting loan defaults, built using
> classification models from a college ML project (`Loan_default.ipynb`).

---

## 📂 Project Structure

```
ML/
├── Loan_default.csv          # Dataset (255,347 records)
├── Loan_default.ipynb        # Original ML notebook
│
├── backend/
│   ├── main.py               # FastAPI entry point
│   ├── config.py             # Config, model metrics, paths
│   ├── database.py           # SQLite / SQLAlchemy setup
│   ├── train_models.py       # One-time training script
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/               # Saved .pkl files (generated)
│   ├── routes/
│   │   ├── predict.py
│   │   ├── models_info.py
│   │   └── history.py
│   ├── schemas/
│   │   └── loan_schema.py
│   ├── services/
│   │   ├── model_loader.py
│   │   └── prediction_service.py
│   └── utils/
│       └── preprocessing.py
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/axios.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PredictionForm.jsx
        │   ├── PredictionResult.jsx
        │   ├── ModelCard.jsx
        │   └── ConfusionMatrix.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── Predict.jsx
            ├── ModelComparison.jsx
            ├── Statistics.jsx
            ├── History.jsx
            └── About.jsx
```

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Python 3.10+ (with pip)
- Node.js 18+ (with npm)

---

### Step 1 — Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

### Step 2 — Train & Save ML Models

> ⚠️ **Run this once.** It reads `Loan_default.csv`, replicates the notebook's
> exact preprocessing pipeline, trains all 4 models, and saves `.pkl` files to
> `backend/models/`.

```bash
cd backend
python train_models.py
```

Training takes ~3–5 minutes for KNN on the full dataset.

---

### Step 3 — Start the FastAPI Backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API is now available at: http://localhost:8000

- Swagger UI: http://localhost:8000/api/docs
- ReDoc:       http://localhost:8000/api/redoc

---

### Step 4 — Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### Step 5 — Start the React Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 🤖 ML Models

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|---------|
| Logistic Regression | **88.59%** | 62.03% | 3.10% | 5.91% |
| Decision Tree | 80.25% | 19.72% | 23.12% | 21.29% |
| KNN (k=5) | 87.57% | 32.53% | 7.08% | 11.64% |
| Naive Bayes | 88.54% | **66.43%** | 1.58% | 3.08% |

All metrics computed on 20% test split (`random_state=42`).

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Predict with selected model |
| POST | `/api/predict/all` | Compare all models |
| GET  | `/api/models` | All model metrics |
| GET  | `/api/models/dataset-stats` | Dataset statistics |
| GET  | `/api/history` | Prediction history |
| DELETE | `/api/history/{id}` | Delete a record |
| DELETE | `/api/history` | Clear all history |

---

## 📝 Preprocessing Pipeline (from notebook)

1. Load CSV → drop duplicates → reset index
2. Rename `DTIRatio` → `DTI_Ratio`
3. Drop `LoanID` and `index` columns
4. `LabelEncoder` on 7 categorical columns (alphabetical order)
5. Lowercase all column names
6. Rename `default` → `loan_status`
7. Train/test split 80/20 (`random_state=42`)
8. `StandardScaler` (fit on train, transform both)

---

## 🏫 College ML Project — Sem 5
