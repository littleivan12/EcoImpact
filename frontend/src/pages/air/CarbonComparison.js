import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/CarbonComparison.css"; // New CSS file

function CarbonComparison() {
  const [userFootprint, setUserFootprint] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showComparison, setShowComparison] = useState(false);

  // Mock company carbon footprints in units
  const companyFootprints = {
    Amazon: 18000,
    Google: 9000,
    Tesla: 4000,
    ExxonMobil: 50000,
  };

  const handleCompare = () => {
    if (userFootprint && selectedCompany) {
      setShowComparison(true);
    }
  };

  return (
    <div className="carbon-page">
      {/* Go back to air page*/}
      <Link to="/air" className="home-icon"></Link>

      <h1 className="page-title">Ecolmpact</h1>
      <h2 className="section-title">Carbon Comparison</h2>

      {!showComparison ? (
        <div className="input-section">
          {/* Question Input */}
          <div className="input-group">
            <label>Q1. How many miles do you drive per week?</label>
            <input
              type="number"
              placeholder="Enter miles"
              value={userFootprint}
              onChange={(e) => setUserFootprint(e.target.value)}
            />
          </div>

          {/* Company Dropdown */}
          <div className="input-group">
            <label>What company would you like to compare to?</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a company</option>
              {Object.keys(companyFootprints).map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Placeholder */}
          <div className="progress-container">
            <p>Progress</p>
            <div className="progress-bar"></div>
          </div>

          <button className="compare-button" onClick={handleCompare}>
            Compare
          </button>
        </div>
      ) : (
        <div className="comparison-section">
          <h3>Your footprint vs. {selectedCompany}</h3>
          <div className="footprint-container">
            <div className="footprint">
              <div className="circle user-circle"></div>
              <p>You: {userFootprint || 0} Units</p>
            </div>
            <div className="footprint">
              <div className="circle company-circle"></div>
              <p>
                {selectedCompany}: {companyFootprints[selectedCompany]} Units
              </p>
            </div>
          </div>
          <button
            className="reset-button"
            onClick={() => setShowComparison(false)}
          >
            Reset Comparison
          </button>
        </div>
      )}
    </div>
  );
}

export default CarbonComparison;
