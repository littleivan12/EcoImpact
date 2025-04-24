import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/CarbonComparison.css"; // Ensure this CSS file exists
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";


function CarbonComparison() {
  const [weeklyMiles, setWeeklyMiles] = useState("");
  // Rough proxy for household electricity use
  const [monthlyBill, setMonthlyBill] = useState("");            // average $/month electric bill
  const [flightsPerYear, setFlightsPerYear] = useState("");        // number of flights
  const [userFootprint, setUserFootprint] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyEmissions, setCompanyEmissions] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [userCircleSize, setUserCircleSize] = useState(0);
  const [companyCircleSize, setCompanyCircleSize] = useState(0);
  const [comparisonType, setComparisonType] = useState("hourly");
  const [hasEaten, setHasEaten] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/companies/")
      .then((response) => response.json())
      .then((data) => {
        const formatted = data.map((company) => ({
          name: company.name,
          dailyEmissions: company.daily_emissions,
          hourlyEmissions: company.daily_emissions / 24,
        }));
        setCompanies(formatted);
      })
      .catch(() => setError("Failed to fetch company data. Please try again later."));
  }, []);

  const handleCalculateEmissions = () => {
    setError(""); // Clear any previous errors

    // Basic validation — all three questions must have positive numeric answers
    if (
      !weeklyMiles || isNaN(weeklyMiles) || weeklyMiles <= 0 ||
      !monthlyBill || isNaN(monthlyBill) || monthlyBill < 0 ||
      flightsPerYear === "" || isNaN(flightsPerYear) || flightsPerYear < 0
    ) {
      setError("Please enter valid (positive) numbers for all questions.");
      return;
    }

    const lifetimeYears = 50; // assumed driving / lifestyle span

    // ---- Annual emissions calculations ----
    const yearlyMiles = parseFloat(weeklyMiles) * 52;
    const drivingAnnual = yearlyMiles * 0.404;                  // ton CO₂ per mile

    // Approximate kWh from bill: average US cost ≈ $0.15 per kWh
    const yearlyKwh = (parseFloat(monthlyBill) / 0.15) * 12;
    const electricityAnnual = yearlyKwh * 0.00092;              // ton CO₂ per kWh (0.92 kg)

    const flightsAnnual = parseFloat(flightsPerYear) * 0.45;    // ton CO₂ per short‑haul flight

    const totalLifetime = (drivingAnnual + electricityAnnual + flightsAnnual) * lifetimeYears;

    setUserFootprint(totalLifetime.toFixed(2));
  };

  const handleCompare = () => {
    setError(""); // Clear any previous errors
    if (!userFootprint || userFootprint <= 0) {
      setError("Please calculate your emissions before comparing.");
      return;
    }
    if (!selectedCompany) {
      setError("Please select a company to compare against.");
      return;
    }

    const selectedCompanyData = companies.find(
      (c) => c.name === selectedCompany
    );
    if (selectedCompanyData) {
      const companyOutput =
        comparisonType === "daily"
          ? selectedCompanyData.dailyEmissions
          : selectedCompanyData.hourlyEmissions;

      setCompanyEmissions(companyOutput);
      setShowComparison(true);
      animateCircles(parseFloat(userFootprint), companyOutput);
    }
  };

  const animateCircles = (userEmissions, companyEmissions) => {
    let userSize = 5;
    let companySize = 5;
    const scaleFactor = 0.1;
    const userMax = Math.min(userEmissions * scaleFactor, 200);
    const companyMax = Math.min(companyEmissions * scaleFactor, 1000);

    const interval = setInterval(() => {
      userSize = Math.min(userSize + userMax / 100, userMax);
      companySize = Math.min(companySize + companyMax / 100, companyMax);

      setUserCircleSize(userSize);
      setCompanyCircleSize(companySize);

      if (userSize >= userMax && companySize >= companyMax) {
        clearInterval(interval);
        setHasEaten(true);
      
        // Stop the mouth after 1.5s
        setTimeout(() => {
          const pacmanEl = document.querySelector(".pacman");
          if (pacmanEl) {
            pacmanEl.classList.add("pacman-stop");
          }
        }, 1500);
      }
    }, 50);
  };

  const isCompanyBigger = companyCircleSize > userCircleSize;

  return (
    <div>
      <TopBar hex1="#f6e36a" hex2="#97840c"/>
      <div className="carbon-page">
        <BackButton pageType="air"/>

        <h1 className="page-title">Ecolmpact</h1>
        <h2 className="section-title">Carbon Comparison</h2>

        {error && <p className="error-message">{error}</p>}

        {!showComparison ? (
          <div className="input-section">
            <div className="input-group">
              <label>Q1. How many miles do you drive per week?</label>
              <input
                type="number"
                placeholder="Enter miles"
                value={weeklyMiles}
                onChange={(e) => setWeeklyMiles(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Q2. About how much is your electric bill per month (USD)?</label>
              <input
                type="number"
                placeholder="Enter $ amount"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Q3. How many short flights (&lt;3 h) do you take per year?</label>
              <input
                type="number"
                placeholder="Enter number of flights"
                value={flightsPerYear}
                onChange={(e) => setFlightsPerYear(e.target.value)}
              />
            </div>

            {/* Calculate button (restored) */}
            <button
              className="calculate-button"
              onClick={handleCalculateEmissions}
            >
              Calculate My CO₂ Emissions
            </button>

            {userFootprint > 0 && (
              <p>
                Your estimated lifetime CO₂ emissions:{" "}
                <strong>{userFootprint} tons</strong>
              </p>
            )}

            <div className="input-group">
              <label>What company would you like to compare to?</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Select a company</option>
                {companies.map((company, idx) => (
                  <option key={idx} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Compare against company's emissions for:</label>
              <select
                value={comparisonType}
                onChange={(e) => setComparisonType(e.target.value)}
              >
                <option value="hourly">1 Hour</option>
                <option value="daily">1 Day</option>
              </select>
            </div>

            <button className="compare-button" onClick={handleCompare}>
              Compare
            </button>
          </div>
        ) : (
          <div className="comparison-section">
            <h3>
              Your lifetime footprint vs. {selectedCompany}'s{" "}
              <strong>{comparisonType}</strong> emissions
            </h3>
            <div className="footprint-container">
              <div className="footprint">
                <div
                  className={`circle user-circle ${
                    hasEaten && isCompanyBigger ? "pacman-attack" : ""
                  }`}
                  style={{
                    width: `${userCircleSize}px`,
                    height: `${userCircleSize}px`,
                  }}
                ></div>
                <p>You: {userFootprint} tons</p>
              </div>

              <div className="footprint">
                <div
                  className={`circle ${
                    hasEaten && isCompanyBigger
                      ? "pacman pacman-move"
                      : "company-circle"
                  }`}
                  style={{
                    width: `${companyCircleSize}px`,
                    height: `${companyCircleSize}px`,
                  }}
                ></div>
                <p>
                  {selectedCompany}: {companyEmissions.toFixed(2)} tons
                </p>
              </div>  
            </div>
            <button
              className="reset-button"
              onClick={() => {
                setShowComparison(false);
                setHasEaten(false);
                setUserCircleSize(0);
                setCompanyCircleSize(0);
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CarbonComparison;
