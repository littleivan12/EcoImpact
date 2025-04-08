from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware


from database import SessionLocal, engine
import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORSMiddleware to your FastAPI app to allow requests from your frontend
origins = [
    "http://localhost:3000",  # Allow requests from the frontend
    "http://127.0.0.1:8000",  # Allow requests from the backend server itself (if needed)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from your frontend and backend servers
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


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
    number_code:int
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

@app.get("/companies/")
def get_companies(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT parent_entity, total_emissions FROM companies LIMIT 5")).fetchall()
    
    # Convert each row to a dictionary
    data = [{"name": row[0], "yearly_emissions": row[1]} for row in result]
    
    return data

@app.get("/air_super/year/{year}")
def get_air_super_by_year(year: int, db: Session = Depends(get_db)):
    query = text('SELECT * FROM air_super WHERE "Year" = :year;')
    result = db.execute(query, {"year": year}).fetchall()

    if not result:
        raise HTTPException(status_code=404, detail="No records found for the given year")

    return [dict(row._mapping) for row in result]
@app.get("/air_super/{number_code}/past_five_years")
def get_past_five_years_by_country(number_code: int , db: Session = Depends(get_db)):
    # SQL query to get the data from the last 5 years for a specific country
    query = text("""
    SELECT * 
    FROM air_super 
    WHERE number_code = :number_code;
    """)
    
    result = db.execute(query, {"number_code": number_code}).fetchall()
    
    # Convert each row to a dictionary
    data = [dict(row._mapping) for row in result]
    print(data)
    
    print(f"Total records from the past 5 years for {number_code}: {len(data)}")  # Debugging output
    return data

