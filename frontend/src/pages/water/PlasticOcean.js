import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/PlasticOcean.css";

function PlasticOcean() {
  const [projections, setProjections] = useState([]);
  const [step, setStep] = useState(0);

  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [countryImpact, setCountryImpact] = useState(null);
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/ocean-projections")
      .then((res) => res.json())
      .then((data) => setProjections(data))
      .catch((err) => console.error("Failed to fetch projections:", err));

    fetch("http://localhost:8000/countries")
      .then((res) => res.json())
      .then((data) => setCountryList(data))
      .catch((err) => console.error("Failed to fetch country list:", err));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch(`http://localhost:8000/country-impact/${selectedCountry}`)
        .then((res) => res.json())
        .then((data) => setCountryImpact(data))
        .catch((err) => console.error("Failed to fetch country impact:", err));
    }
  }, [selectedCountry]);

  if (projections.length === 0) return <p>Loading ocean data...</p>;

  const { year, coverage, impact } = projections[step];

  const handleClick = () => {
    if (step < projections.length - 1) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Very_High":
        return "#ff3e3e";
      case "High":
        return "#ff9f43";
      case "Medium":
        return "#ffe082";
      case "Low":
        return "#81c784";
      default:
        return "#e0f7fa";
    }
  };

  return (
    <div
      className="plastic-ocean-page"
      style={{
        backgroundColor: countryImpact
          ? getRiskColor(countryImpact.coastal_waste_risk)
          : "#e0f7fa",
      }}
    >
      <Link to="/water" className="home-icon"></Link>
      <h1 className="page-title">Plastic in the Ocean</h1>
      {/* Clarification Text */}
      <p className="explanation">
        Litter to see how plastic waste accumulates globally in the ocean over
        time. Select a country to see its impact on coastal waste risk and
        recycling rates.
      </p>
      {/* Country Selector */}
      <div className="selector-container">
        <label htmlFor="country">
          Choose a country{" "}
          <span title="This shows regional impact only. It doesn't affect the plastic level.">
            ❓
          </span>
        </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countryList.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {countryImpact && (
        <div className="country-impact">
          <p>
            <strong>{countryImpact.country}</strong>
          </p>
          <p>
            Coastal Waste Risk:{" "}
            <strong>{countryImpact.coastal_waste_risk}</strong>
          </p>
          <p>
            Recycling Rate: <strong>{countryImpact.recycling_rate}%</strong>
          </p>
          <p>
            Per Capita Waste:{" "}
            <strong>{countryImpact.per_capita_waste_kg}kg</strong>
          </p>
        </div>
      )}

      <p className="description">
        By <strong>{year}</strong>, an estimated <strong>{coverage}%</strong> of
        the ocean may be covered in plastic.
      </p>

      <div className="ocean-container">
        <div className="ocean">
          <div
            className="plastic-overlay"
            style={{ height: `${coverage * 10}%` }}
          ></div>

          {/* Floating plastic cups */}
          {Array.from({ length: Math.floor(coverage * 10) }).map((_, i) => (
            <img
              key={`cup-${i}`}
              src="/visuals/ground/cups/cup1.png"
              alt="Plastic Cup"
              className="floating-plastic"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}

          {/* Fish flee with more plastic */}
          {Array.from({ length: Math.max(0, 5 - step) }).map((_, i) => (
            <img
              key={`fish-${i}`}
              src="/visuals/water/fish/fish1.png"
              alt="Fish"
              className="swimming-fish"
              style={{
                left: `${10 + i * 15}%`,
                bottom: `${10 + i * 5}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="button-group">
        <button
          className="litter-button"
          onClick={handleClick}
          disabled={step >= projections.length - 1}
        >
          🧴 Litter some plastic
        </button>

        <button className="reset-button" onClick={handleReset}>
          🔄 Reset
        </button>
      </div>

      <p className="impact-blurb">{impact}</p>
    </div>
  );
}

export default PlasticOcean;
