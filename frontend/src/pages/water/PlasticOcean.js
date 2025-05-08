import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/PlasticOcean.css";
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";

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
  const coveragePercent = (coverage * 100).toFixed(3); // "0.442"
  const coverageAreaKm2 = (coverage * 361_900_000).toLocaleString();
  const overlayHeight = Math.min(100, coverage * 2000);

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
    <div>
      <TopBar hex1="#4ebeee" hex2="#140b8d" />
      <div
        className="plastic-ocean-page"
        style={{
          backgroundColor: countryImpact
            ? getRiskColor(countryImpact.coastal_waste_risk)
            : "#e0f7fa",
        }}
      >
        <BackButton pageType="water" />

        <h1 className="page-title">A Plastic Ocean</h1>

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
          By <strong>{year}</strong>, plastic spread could blanket&nbsp;
          <strong>{coveragePercent}%</strong> of the ocean (
          <em>{coverageAreaKm2}&nbsp;km²</em>).
        </p>

        {/* Visual Representation */}
        <div className="ocean-container">
          <div className="ocean">
            <div
              className="plastic-overlay"
              style={{ height: `${overlayHeight}%` }}
            ></div>

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
      <Footer />
    </div>
  );
}

export default PlasticOcean;
