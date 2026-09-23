from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone
from config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # needed for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id             = Column(Integer, primary_key=True, index=True)
    model_used     = Column(String, nullable=False)
    prediction     = Column(Integer, nullable=False)   # 0 or 1
    prediction_label = Column(String, nullable=False)  # "No Default" / "Default"
    confidence     = Column(Float, nullable=True)      # probability of predicted class
    # Input features (stored as JSON string)
    input_features = Column(Text, nullable=False)
    created_at     = Column(DateTime, default=lambda: datetime.now(timezone.utc))


def create_tables():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
