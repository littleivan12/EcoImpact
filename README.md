Video Walkthrough: https://youtu.be/NU14Ic7x9K8
Final Documentation: https://uncg-my.sharepoint.com/:w:/g/personal/mkalova_uncg_edu/Eds99QRy7OFBosfyOm585woB_N7D1NNsZIvbh1z0NAzQSw?e=3Ie9UK

# EcoImpact
EcoImpact is an interactive web application designed to help users explore humanity’s environmental impact across three major domains: Air, Water, and Ground. Through a collection of data-driven visualizations and hands-on simulations, EcoImpact turns abstract climate metrics into compelling experiences that foster deeper understanding and inspire sustainable choices.

## Features
- **Super-Category Navigation**: Start on the home screen and choose Air, Water, or Ground to access dedicated dashboards.
- **Carbon Comparison (Air)**: Enter driving miles, electricity use, and flights to calculate a lifetime CO₂ footprint and compare it against top corporate emitters with animated circle visualizations.
- **Emissions Map (Air)**: Interactively include or exclude countries on a world map, watch the global CO₂ total adjust, and drill into a country’s five-year emissions history.
- **Ice? Sheet! (Water)**: Slide through 0–10 ticks of Greenland ice melting to see sea-level rise, gigatonnes lost, and narrative impacts.
- **A Plastic Ocean (Water)**: Step through projected years of ocean plastic coverage, watch a rising overlay and fleeing fish, and inspect any country’s coastal-waste risk and recycling rate.
- **Stick Around? (Ground)**: Compare how long metal, plastic, and biodegradable cups take to degrade (or recycle) with timeline animations and contextual narratives.
- **Farm Emissions Showdown (Ground)**: Click agricultural sources (cow burps, rice paddies, manure management) to grow proportional “gas clouds” and learn annual emissions figures.

## Architecture
EcoImpact follows a three-tier pattern:
1. **Data Storage**: PostgreSQL tables for country CO₂ (air_super), plastic-waste data (water_super), ocean projections, corporate emissions, and material degradation.
2. **Backend API**: FastAPI (Python 3.8+), SQLAlchemy, and parameterized queries expose JSON endpoints.
3. **Frontend Visualization**: React (17+), React Router, and D3.js power all charts, maps, and animations.

## Getting Started
### Prerequisites
- Python 3.8 or later
- Node.js 14 or later
- PostgreSQL 12 or later

### Installation
1. **Clone this repository**
   ```bash
   git clone https://github.com/your-org/ecoimpact.git
   cd ecoimpact
   ```
2. **Backend setup**
   - Create and activate a Python virtual environment:
     ```bash
     python3 -m venv venv
     source venv/bin/activate   # macOS/Linux
     # venv\Scripts\activate  # Windows
     ```
   - Install dependencies:
     ```bash
     pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic
     ```
   - Set the database URL:
     ```bash
     export DATABASE_URL="postgresql://user:password@localhost:5432/ecoimpact"
     ```
   - Load the initial database dump:
     ```bash
     psql $DATABASE_URL -f datasets/Setup/ecoimpact_dump.sql
     ```
3. **Frontend setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the App
1. **Start the backend API**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```
3. Open http://localhost:3000 in your browser.

## API Endpoints
- **GET /** – Welcome message
- **POST /air_super/** – Insert new air data
- **GET  /air_super/** – List all air data
- **GET  /air_super/{country}** – Data for a specific country_code
- **GET  /air_super/year/{year}** – Records for a specific year
- **GET  /air_super/{code}/past_five_years** – Last five years for a numeric code
- **GET  /companies/** – Top 5 investor-owned companies by emissions
- **GET  /ocean-projections** – Ocean plastic projections time series
- **GET  /countries/** – List of countries for water data
- **GET  /country-impact/{code}** – Per-country coastal-waste impact

## Frontend Routes
| Path                | Description                         |
|---------------------|-------------------------------------|
| /                   | Home (super-category selection)     |
| /air                | Air dashboard                       |
| /water              | Water dashboard                     |
| /ground             | Ground dashboard                    |
| /carbon-comparison  | Carbon Comparison (Air)             |
| /map                | Emissions Map (Air)                 |
| /ice-sheets         | Ice? Sheet! (Water)                 |
| /plastic-ocean      | A Plastic Ocean (Water)             |
| /stick-around       | Stick Around? (Ground)              |
| /farm-emissions     | Farm Emissions Showdown (Ground)    |
## Project Structure
```bash
├── main.py           # FastAPI application and route definitions
├── database.py       # SQLAlchemy engine, session, Base
├── models.py         # ORM models for tables
├── datasets/         # CSV and SQL dumps for initial data load
├── frontend/         # React application (Create React App)
└── ...               # supporting scripts and notebooks
```

## Future Work
EcoImpact’s roadmap includes automated data ingestion from public APIs, a mobile-first redesign, enhanced accessibility (ARIA labels, keyboard navigation, high-contrast themes), new climate metrics (temperature anomalies, tree-cover change), and user-authentication with saved scenarios and social sharing. For details, see the project Wiki.