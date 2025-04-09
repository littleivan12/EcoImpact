from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from database_ben import SessionLocal, engine
import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS to allow frontend access
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
    number_code: int

class AirSuperCreate(AirSuperBase):
    pass

class AirSuperResponse(AirSuperBase):
    class Config:
        orm_mode = True

# Root endpoint to test if FastAPI is running
@app.get("/")
def read_root():
    return {"message": "Welcome to the EcoImpact API"}

# Air Super Routes
@app.post("/air_super/")
def create_air_super(data: AirSuperCreate, db: Session = Depends(get_db)):
    query = text("""
        INSERT INTO air_super (country, country_code, Year, total, coal, oil, gas, cement, flaring, other, per_capita, number_code)
        VALUES (:country, :country_code, :Year, :total, :coal, :oil, :gas, :cement, :flaring, :other, :per_capita, :number_code)
        RETURNING *;
    """)
    result = db.execute(query, data.dict())
    db.commit()
    inserted_row = result.fetchone()
    return dict(inserted_row._mapping)  # Convert to dictionary for JSON response

@app.get("/air_super/")
def get_air_super(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM air_super")).fetchall()
    return [dict(row._mapping) for row in result]

@app.get("/air_super/{country_code}")
def get_air_super_by_country_code(country_code: str, db: Session = Depends(get_db)):
    query = text("SELECT * FROM air_super WHERE country_code = :country_code;")
    result = db.execute(query, {"country_code": country_code}).fetchall()
    if not result:
        raise HTTPException(status_code=404, detail="Country code not found")
    return [dict(row._mapping) for row in result]

@app.get("/air_super/year/{year}")
def get_air_super_by_year(year: int, db: Session = Depends(get_db)):
    query = text('SELECT * FROM air_super WHERE "Year" = :year;')
    result = db.execute(query, {"year": year}).fetchall()
    if not result:
        raise HTTPException(status_code=404, detail="No records found for the given year")
    return [dict(row._mapping) for row in result]

@app.get("/air_super/{number_code}/past_five_years")
def get_past_five_years_by_country(number_code: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT * 
        FROM air_super 
        WHERE number_code = :number_code;
    """)
    result = db.execute(query, {"number_code": number_code}).fetchall()
    data = [dict(row._mapping) for row in result]
    print(f"Total records from the past 5 years for {number_code}: {len(data)}")  # Debugging output
    return data

# Companies Routes
@app.get("/companies/")
def get_companies(db: Session = Depends(get_db)):
    query = text("""
        SELECT parent_entity, MAX(total_emissions) AS max_emissions
        FROM companies
        WHERE parent_type = 'Investor-owned Company'
        GROUP BY parent_entity
        ORDER BY max_emissions DESC
        LIMIT 5;
    """)
    result = db.execute(query).fetchall()
    return [
        {
            "name": row[0],
            "yearly_emissions": row[1] * 1_000_000,
            "monthly_emissions": (row[1] * 1_000_000) / 12,
            "weekly_emissions": (row[1] * 1_000_000) / 52,
            "daily_emissions": (row[1] * 1_000_000) / 365,
            "hourly_emissions": (row[1] * 1_000_000) / (365 * 24),
        }
        for row in result
    ]

# Ocean Projections Routes
@app.get("/ocean-projections")
def get_ocean_projections(db: Session = Depends(get_db)):
    query = text("SELECT year, coverage, impact FROM plastic_projections ORDER BY year;")
    result = db.execute(query).fetchall()
    return [
        {"year": row[0], "coverage": float(row[1]), "impact": row[2]} for row in result
    ]

# Country Impact Routes
@app.get("/country-impact/{country_code}")
def get_country_impact(country_code: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT country, per_capita_waste_kg, recycling_rate, coastal_waste_risk
        FROM water_super
        WHERE country_code = :code
        LIMIT 1;
    """)
    row = db.execute(query, {"code": country_code.upper()}).fetchone()
    if not row:
        return {"error": "Country not found"}
    return {
        "country": row[0],
        "per_capita_waste_kg": float(row[1]),
        "recycling_rate": float(row[2]),
        "coastal_waste_risk": row[3],
    }

@app.get("/countries")
def get_country_list(db: Session = Depends(get_db)):
    query = text("""
        SELECT DISTINCT country, country_code
        FROM water_super
        ORDER BY country;
    """)
    result = db.execute(query).fetchall()
    return [{"name": row[0], "code": row[1]} for row in result]
