from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ── Enums for categorical inputs ──────────────────────────────────────────────

class EducationEnum(str, Enum):
    bachelors   = "Bachelor's"
    high_school = "High School"
    masters     = "Master's"
    phd         = "PhD"


class EmploymentTypeEnum(str, Enum):
    full_time     = "Full-time"
    part_time     = "Part-time"
    self_employed = "Self-employed"
    unemployed    = "Unemployed"


class MaritalStatusEnum(str, Enum):
    divorced = "Divorced"
    married  = "Married"
    single   = "Single"


class YesNoEnum(str, Enum):
    yes = "Yes"
    no  = "No"


class LoanPurposeEnum(str, Enum):
    auto      = "Auto"
    business  = "Business"
    education = "Education"
    home      = "Home"
    other     = "Other"


class ModelNameEnum(str, Enum):
    logistic_regression = "logistic_regression"
    decision_tree       = "decision_tree"
    knn                 = "knn"
    naive_bayes         = "naive_bayes"


# ── Input schema ──────────────────────────────────────────────────────────────

class LoanInput(BaseModel):
    age:            int   = Field(..., ge=18, le=100,      description="Applicant age (18–100)")
    income:         int   = Field(..., ge=0,               description="Annual income in USD")
    loanamount:     int   = Field(..., ge=1000,            description="Loan amount in USD")
    creditscore:    int   = Field(..., ge=300, le=850,     description="Credit score (300–850)")
    monthsemployed: int   = Field(..., ge=0,               description="Months employed")
    numcreditlines: int   = Field(..., ge=0,               description="Number of open credit lines")
    interestrate:   float = Field(..., ge=0.0, le=30.0,   description="Interest rate (%)")
    loanterm:       int   = Field(..., ge=6, le=360,       description="Loan term in months")
    dti_ratio:      float = Field(..., ge=0.0, le=1.0,    description="Debt-to-Income ratio (0–1)")
    education:      EducationEnum
    employmenttype: EmploymentTypeEnum
    maritalstatus:  MaritalStatusEnum
    hasmortgage:    YesNoEnum
    hasdependents:  YesNoEnum
    loanpurpose:    LoanPurposeEnum
    hascosigner:    YesNoEnum
    model_name:     ModelNameEnum = Field(default=ModelNameEnum.logistic_regression)

    model_config = {"use_enum_values": True}


# ── Response schemas ───────────────────────────────────────────────────────────

class SingleModelResult(BaseModel):
    model_name:      str
    model_label:     str
    prediction:      int
    prediction_label: str
    confidence:      Optional[float]
    default_probability: Optional[float]
    no_default_probability: Optional[float]


class PredictionResponse(BaseModel):
    result: SingleModelResult
    input_summary: dict


class AllModelsResult(BaseModel):
    results: List[SingleModelResult]
    input_summary: dict


class HistoryItem(BaseModel):
    id:               int
    model_used:       str
    prediction:       int
    prediction_label: str
    confidence:       Optional[float]
    input_features:   dict
    created_at:       datetime

    model_config = {"from_attributes": True}


class ModelMetrics(BaseModel):
    key:       str
    name:      str
    accuracy:  float
    precision: float
    recall:    float
    f1_score:  float
    confusion_matrix: List[List[int]]
