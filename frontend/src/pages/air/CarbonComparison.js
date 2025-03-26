import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/CarbonComparison.css"; // Ensure this CSS file exists

function CarbonComparison() {
  const [weeklyMiles, setWeeklyMiles] = useState(""); // User's weekly driving miles
  const [userFootprint, setUserFootprint] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyEmissions, setCompanyEmissions] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [userCircleSize, setUserCircleSize] = useState(0);
  const [companyCircleSize, setCompanyCircleSize] = useState(0);
  const [comparisonType, setComparisonType] = useState("hourly"); // hourly or daily

  // Fetch company emissions data from FastAPI backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/companies/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Top Polluting Companies:", data); // Debugging

        const formattedCompanies = data.map((company) => ({
          name: company.name,
          hourlyEmissions: company.daily_emissions / 24, // Convert daily to hourly
          dailyEmissions: company.daily_emissions,
        }));

        console.log("Processed Companies:", formattedCompanies); // Debugging
        setCompanies(formattedCompanies);
      })
      .catch((error) => console.error("Error fetching company data:", error));
  }, []);

  // Calculate user emissions based on weekly miles
  const handleCalculateEmissions = () => {
    if (!weeklyMiles || isNaN(weeklyMiles) || weeklyMiles <= 0) return;

    const milesPerYear = weeklyMiles * 52; // Convert weekly to yearly miles
    const carEmissionsPerMile = 0.404; // Avg CO₂ per mile in metric tons
    const lifetimeYears = 50; // Assume 50 years of driving

    const lifetimeEmissions = milesPerYear * carEmissionsPerMile * lifetimeYears;
    setUserFootprint(lifetimeEmissions.toFixed(2));
  };

  const handleCompare = () => {
    if (userFootprint && selectedCompany) {
      const selectedCompanyData = companies.find((c) => c.name === selectedCompany);
      if (selectedCompanyData) {
        let companyOutput;

        switch (comparisonType) {
          case "daily":
            companyOutput = selectedCompanyData.dailyEmissions;
            break;
          case "hourly":
          default:
            companyOutput = selectedCompanyData.hourlyEmissions;
        }

        setCompanyEmissions(companyOutput);
        setShowComparison(true);
        animateCircles(parseFloat(userFootprint), companyOutput);
      }
    }
  };

  const animateCircles = (userEmissions, companyEmissions) => {
    let userSize = 5;
    let companySize = 5;

    // Scale at the same rate for accurate proportionality
    const scaleFactor = 0.1; // Adjust as needed
    const userMaxSize = Math.min(userEmissions * scaleFactor, 200); // Keep user visible
    const companyMaxSize = Math.min(companyEmissions * scaleFactor, 1000); // Keep company proportional

    const interval = setInterval(() => {
      userSize = Math.min(userSize + userMaxSize / 100, userMaxSize);
      companySize = Math.min(companySize + companyMaxSize / 100, companyMaxSize);

      setUserCircleSize(userSize);
      setCompanyCircleSize(companySize);

      if (userSize >= userMaxSize && companySize >= companyMaxSize) {
        clearInterval(interval);
      }
    }, 100);
  };

  return (
    <div className="carbon-page">
      {/* Go back to air page*/}
      <Link to="/air" className="home-icon"></Link>

      <h1 className="page-title">Ecolmpact</h1>
      <h2 className="section-title">Carbon Comparison</h2>

      {!showComparison ? (
        <div className="input-section">
          {/* User Mileage Input */}
          <div className="input-group">
            <label>Q1. How many miles do you drive per week? </label>
            <input
              type="number"
              placeholder="Enter miles"
              value={weeklyMiles}
              onChange={(e) => setWeeklyMiles(e.target.value)}
            />
            <button className="calculate-button" onClick={handleCalculateEmissions}>
              Calculate My CO₂ Emissions
            </button>
          </div>

          {/* Show user's lifetime emissions */}
          {userFootprint > 0 && (
            <p>
              Your estimated lifetime CO₂ emissions: <strong>{userFootprint} tons</strong>
            </p>
          )}

          {/* Company Dropdown */}
          <div className="input-group">
            <label>What company would you like to compare to? </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a company</option>
              {companies.length > 0 ? (
                companies.map((company, index) => (
                  <option key={`${company.name}-${index}`} value={company.name}>
                    {company.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading companies...</option>
              )}
            </select>
          </div>

          {/* Timeframe Selection */}
          <div className="input-group">
            <label>Compare against company's emissions for: </label>
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
            Your lifetime footprint vs. {selectedCompany}'s **{comparisonType}** emissions
          </h3>
          <div className="footprint-container">
            <div className="footprint">
              <div
                className="circle user-circle"
                style={{
                  width: `${userCircleSize}px`,
                  height: `${userCircleSize}px`,
                }}
              ></div>
              <p>You: {userFootprint} tons in your lifetime</p>
            </div>
            <div className="footprint">
              <div
                className="circle company-circle"
                style={{
                  width: `${companyCircleSize}px`,
                  height: `${companyCircleSize}px`,
                }}
              ></div>
              <p>
                {selectedCompany}: {companyEmissions.toFixed(2)} tons {comparisonType}
              </p>
            </div>
          </div>
          <button className="reset-button" onClick={() => setShowComparison(false)}>
            Reset Comparison
          </button>
        </div>
      )}
    </div>
  );
}

export default CarbonComparison;