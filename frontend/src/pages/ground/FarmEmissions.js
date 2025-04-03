import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/FarmEmissions.css"; // New CSS file
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";

// Accurate EPA emissions data (2022, approx. US)
const emissionsData = {
  cow: {
    name: "Cow Burps (Enteric Fermentation)",
    description: "Cows release methane (CH₄) while digesting food.",
    annualEmissions: 178, // Million metric tons CO₂ equivalent (highest)
  },
  rice: {
    name: "Rice Cultivation",
    description: "Rice paddies emit methane due to waterlogged fields.",
    annualEmissions: 15, // Smaller scale
  },
  industrial: {
    name: "Manure Management",
    description: "Manure storage and treatment release methane (CH₄).",
    annualEmissions: 68, // Moderate scale
  },
};

// Scale factor for visual growth
const SCALE_FACTOR = 0.5;

function FarmEmissions() {
  const [selectedSource, setSelectedSource] = useState(null);
  const [clickCounts, setClickCounts] = useState({ cow: 0, rice: 0, industrial: 0 });
  const [gasSizes, setGasSizes] = useState({ cow: 0, rice: 0, industrial: 0 });

  const handleClick = (source) => {
    setSelectedSource(source);

    setClickCounts((prevCounts) => ({
      ...prevCounts,
      [source]: prevCounts[source] + 1,
    }));

    setGasSizes((prevSizes) => ({
      ...prevSizes,
      [source]: prevSizes[source] + emissionsData[source].annualEmissions * SCALE_FACTOR,
    }));
  };


  const handleReset = () => {
    setSelectedSource(null);
    setGasSizes({ cow: 0, rice: 0, industrial: 0 });
    setClickCounts({ cow: 0, rice: 0, industrial: 0 });
  };

  return (
    <div>
      <TopBar hex1="#2bd634" hex2="#0b7e2c"/>
      <div className="farm-emissions-page">
        {/* Go back to ground page*/}
        <BackButton pageType="ground"/>

        <h1 className="page-title">Farm Emissions Showdown</h1>
        <p className="description">
          Click a source to see its annual greenhouse gas emissions grow proportionally.
        </p>

        <div className="content-container">
          {/* Visualization Bubble */}
          <div className="emissions-bubble">
            <div
              className="gas-cloud cow-cloud"
              style={{ width: gasSizes.cow, height: gasSizes.cow }}
            >
              🐄
            </div>
            <div
              className="gas-cloud rice-cloud"
              style={{ width: gasSizes.rice, height: gasSizes.rice }}
            >
              🌾
            </div>
            <div
              className="gas-cloud industrial-cloud"
              style={{ width: gasSizes.industrial, height: gasSizes.industrial }}
            >
              🏭
            </div>
          </div>

          {/* Options and click counts */}
          <div className="options-container">
            <h3>Emission Sources:</h3>
            {Object.keys(emissionsData).map((source) => (
              <button
                key={source}
                className="emission-button"
                onClick={() => handleClick(source)}
              >
                {source === "cow" ? "🐄 Cow Burps" : source === "rice" ? "🌾 Rice Cultivation" : "🏭 Manure Management"}
                <span className="click-count">Clicked: {clickCounts[source]} times</span>
              </button>
            ))}

            {selectedSource && (
              <div className="emission-info">
                <h4>{emissionsData[selectedSource].name}</h4>
                <p>{emissionsData[selectedSource].description}</p>
                <p>
                  Annual Emissions:{" "}
                  <strong>{emissionsData[selectedSource].annualEmissions} Million Metric Tons CO₂ Eq.</strong>
                </p>
              </div>
            )}

            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FarmEmissions;