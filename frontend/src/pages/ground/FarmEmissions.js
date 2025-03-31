import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/FarmEmissions.css";

function FarmEmissions() {
  const [selectedSource, setSelectedSource] = useState(null);
  const [gasSizes, setGasSizes] = useState({ cow: 0, rice: 0, industrial: 0 });
  const [clickCounts, setClickCounts] = useState({ cow: 0, rice: 0, industrial: 0 });

  const emissionsData = {
    cow: {
      name: "Cow Burps",
      description: "Cows release methane (CH₄) when digesting food.",
      growth: 80,  // Dramatic increase
    },
    rice: {
      name: "Rice Fields",
      description: "Rice paddies produce methane due to waterlogged conditions.",
      growth: 40,
    },
    industrial: {
      name: "Industrial Farming",
      description: "Factories and transport emit significant CO₂ emissions.",
      growth: 120,  // Largest growth
    },
  };

  const handleClick = (source) => {
    setSelectedSource(source);
    setGasSizes((prev) => ({
      ...prev,
      [source]: prev[source] + emissionsData[source].growth,
    }));
    setClickCounts((prev) => ({
      ...prev,
      [source]: prev[source] + 1,
    }));
  };

  const handleReset = () => {
    setSelectedSource(null);
    setGasSizes({ cow: 0, rice: 0, industrial: 0 });
    setClickCounts({ cow: 0, rice: 0, industrial: 0 });
  };

  return (
    <div className="farm-emissions-page">
      <Link to="/ground" className="home-icon"></Link>
      <h1 className="page-title">Farm Emissions Showdown</h1>
      <p className="description">
        Click on a source to see how their emissions grow!
      </p>

      <div className="visualization-container">
        <div className="emissions-bubble">
          <div
            className="gas-cloud cow-cloud"
            style={{ width: `${gasSizes.cow}px`, height: `${gasSizes.cow}px` }}
          >
            🐄
          </div>
          <div
            className="gas-cloud rice-cloud"
            style={{ width: `${gasSizes.rice}px`, height: `${gasSizes.rice}px` }}
          >
            🌾
          </div>
          <div
            className="gas-cloud industrial-cloud"
            style={{ width: `${gasSizes.industrial}px`, height: `${gasSizes.industrial}px` }}
          >
            🏭
          </div>
        </div>

        <div className="controls-container">
          <div className="emission-sources">
            {Object.keys(emissionsData).map((source) => (
              <button
                key={source}
                className="emission-button"
                onClick={() => handleClick(source)}
              >
                {source === "cow" ? "🐄 Cow" : source === "rice" ? "🌾 Rice" : "🏭 Industrial"}
              </button>
            ))}
          </div>

          <div className="click-counts">
            <h4>Click Counts</h4>
            <ul>
              <li>Cow 🐄: {clickCounts.cow}</li>
              <li>Rice 🌾: {clickCounts.rice}</li>
              <li>Industrial 🏭: {clickCounts.industrial}</li>
            </ul>
          </div>

          {selectedSource && (
            <div className="emission-info">
              <h3>{emissionsData[selectedSource].name}</h3>
              <p>{emissionsData[selectedSource].description}</p>
            </div>
          )}

          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default FarmEmissions;