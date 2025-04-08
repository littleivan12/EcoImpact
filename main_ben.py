from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database_ben import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
import models
from database_ben import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Fetch companies from MySQL database
@app.get("/companies/")
def get_companies(db: Session = Depends(get_db)):
    query = text(
        """
        SELECT parent_entity, MAX(total_emissions) AS max_emissions
        FROM companies
        WHERE parent_type = 'Investor-owned Company'  -- Only private companies
        GROUP BY parent_entity
        ORDER BY max_emissions DESC
        LIMIT 5;
    """
    )

    result = db.execute(query).fetchall()

    data = [
        {
            "name": row[0],
            "yearly_emissions": row[1]
            * 1_000_000,  # Convert from million metric tons to raw tons
            "monthly_emissions": (row[1] * 1_000_000)
            / 12,  # Divide by months in a year
            "weekly_emissions": (row[1] * 1_000_000) / 52,  # Divide by weeks in a year
            "daily_emissions": (row[1] * 1_000_000) / 365,  # Divide by days in a year
            "hourly_emissions": (row[1] * 1_000_000)
            / (365 * 24),  # Divide by hours in a year
        }
        for row in result
    ]

    return data


@app.get("/ocean-projections")
def get_ocean_projections(db: Session = Depends(get_db)):
    query = text(
        "SELECT year, coverage, impact FROM plastic_projections ORDER BY year;"
    )
    result = db.execute(query).fetchall()

    return [
        {"year": row[0], "coverage": float(row[1]), "impact": row[2]} for row in result
    ]

@app.get("/country-impact/{country_code}")
def get_country_impact(country_code: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT country, per_capita_waste_kg, recycling_rate, coastal_waste_risk
        FROM water_super
        WHERE country_code = :code
        LIMIT 1
    """)
    row = db.execute(query, {"code": country_code.upper()}).fetchone()

    if not row:
        return {"error": "Country not found"}

    return {
        "country": row[0],
        "per_capita_waste_kg": float(row[1]),
        "recycling_rate": float(row[2]),
        "coastal_waste_risk": row[3]
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

# Root endpoint to test if FastAPI is running
@app.get("/")
def read_root():
    return {"message": "Welcome to EcoImpact PostgreSQL API"}
