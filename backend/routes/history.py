"""
routes/history.py
~~~~~~~~~~~~~~~~~
GET    /api/history          → list all prediction history (paginated)
GET    /api/history/{id}     → get single record
DELETE /api/history/{id}     → delete a record
DELETE /api/history          → clear all history
"""

import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from database import get_db, PredictionHistory
from schemas.loan_schema import HistoryItem

router = APIRouter(prefix="/api/history", tags=["History"])


def _serialize(record: PredictionHistory) -> HistoryItem:
    return HistoryItem(
        id=record.id,
        model_used=record.model_used,
        prediction=record.prediction,
        prediction_label=record.prediction_label,
        confidence=record.confidence,
        input_features=json.loads(record.input_features),
        created_at=record.created_at,
    )


@router.get("", response_model=List[HistoryItem])
async def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Return prediction history, newest first."""
    records = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_serialize(r) for r in records]


@router.get("/count")
async def get_history_count(db: Session = Depends(get_db)):
    """Return total count of stored predictions."""
    count = db.query(PredictionHistory).count()
    return {"count": count}


@router.get("/{record_id}", response_model=HistoryItem)
async def get_history_item(record_id: int, db: Session = Depends(get_db)):
    record = db.query(PredictionHistory).filter(PredictionHistory.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Record {record_id} not found")
    return _serialize(record)


@router.delete("/{record_id}")
async def delete_history_item(record_id: int, db: Session = Depends(get_db)):
    record = db.query(PredictionHistory).filter(PredictionHistory.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Record {record_id} not found")
    db.delete(record)
    db.commit()
    return {"detail": f"Record {record_id} deleted"}


@router.delete("")
async def clear_history(db: Session = Depends(get_db)):
    """Delete all prediction history records."""
    deleted = db.query(PredictionHistory).delete()
    db.commit()
    return {"detail": f"Deleted {deleted} records"}
