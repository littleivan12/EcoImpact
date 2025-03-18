from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import text


from database import SessionLocal, engine
import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models for Validation
class AirSuperBase(BaseModel):
    country: str
    country_code: str
    Year: int
    total: float
    coal: float
    oil: float
    gas: float
    cement: float
    flaring: float
    other: float
    per_capita: float
class AirSuperCreate(AirSuperBase):
    pass

class AirSuperResponse(AirSuperBase):
    class Config:
        orm_mode = True

# Routes

@app.get("/")
def read_root():
    return {"message": "Welcome to the EcoImpact API"}

@app.post("/air_super/")
def create_air_super(data: AirSuperCreate, db: Session = Depends(get_db)):
    query = text("""
        INSERT INTO air_super (country, country_code, Year, total, coal, oil, gas, cement, flaring, other, per_capita)
        VALUES (:country, :country_code, :Year, :total, :coal, :oil, :gas, :cement, :flaring, :other, :per_capita)
        RETURNING *;
    """)
    
    result = db.execute(query, data.dict())
    db.commit()
    
    # Fetch the inserted row
    inserted_row = result.fetchone()
    
    return dict(inserted_row._mapping)  # Convert to dictionary for JSON response

@app.get("/air_super/")
def get_air_super(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM air_super")).fetchall()
    
    # Convert each row to a dictionary
    data = [dict(row._mapping) for row in result]
    
    print(f"Total records from raw SQL: {len(data)}")  # Debugging output
    return data


@app.get("/air_super/{country_code}")
def get_air_super_by_country_code(country_code: str, db: Session = Depends(get_db)):
    query = text("SELECT * FROM air_super WHERE country_code = :country_code;")
    result = db.execute(query, {"country_code": country_code}).fetchall()

    # Print out the result to debug
    print(f"Raw Result: {result}")  # Debugging output

    if not result:
        raise HTTPException(status_code=404, detail="Country code not found")
    
    # Convert to dictionary and return
    return [dict(row._mapping) for row in result]

