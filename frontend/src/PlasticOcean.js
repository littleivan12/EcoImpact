import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/PlasticOcean.css"; // New CSS file

function PlasticOcean() {
  const [year, setYear] = useState(2025);

  // Projected percentage of ocean plastic coverage
  const plasticCoverage = {
    2025: 0.1,
    2030: 0.3,
    2040: 0.7,
    2050: 1.5,
    2060: 3.0,
    2070: 5.0,
  };

  return (
    <div className="plastic-ocean-page">
      {/* Home Button (Top Left) */}
      <Link to="/" className="home-icon"></Link>

      <h1 className="page-title">Ecolmpact</h1>
      <h2 className="section-title">Plastic in the Ocean</h2>

      <p className="description">
        By {year}, an estimated <strong>{plasticCoverage[year]}%</strong> of the ocean could be plastic waste.
      </p>

      {/* Visual Representation */}
      <div className="ocean-container">
        <div className="ocean">
          <div
            className="plastic-overlay"
            style={{ height: `${plasticCoverage[year] * 10}%` }}
          ></div>
        </div>
      </div>

      {/* Year Selection Slider */}
      <div className="slider-container">
        <input
          type="range"
          min="2025"
          max="2070"
          step="5"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="slider"
        />
        <p>Year: {year}</p>
      </div>
    </div>
  );
}

export default PlasticOcean;