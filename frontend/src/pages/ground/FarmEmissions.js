import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/FarmEmissions.css"; // New CSS file
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";

function FarmEmissions() {
  const [selectedSource, setSelectedSource] = useState(null);
  const [gasSizes, setGasSizes] = useState({ cow: 0, rice: 0, industrial: 0 });

  // Emission data (placeholder values)
  const emissionsData = {
    cow: {
      name: "Cow Burps",
      description: "Cows release methane (CH₄) when digesting food.",
      growth: 30,
    },
    rice: {
      name: "Rice Fields",
      description:
        "Rice paddies produce methane due to waterlogged conditions.",
      growth: 20,
    },
    industrial: {
      name: "Industrial Farming",
      description: "Factories and transport contribute CO₂ emissions.",
      growth: 40,
    },
  };

  const handleClick = (source) => {
    setSelectedSource(source);
    setGasSizes((prevSizes) => ({
      ...prevSizes,
      [source]: prevSizes[source] + emissionsData[source].growth, // Gas cloud grows
    }));
  };

  const handleReset = () => {
    setSelectedSource(null);
    setGasSizes({ cow: 0, rice: 0, industrial: 0 });
  };

  return (
    <div>
      <TopBar hex1="#2bd634" hex2="#0b7e2c"/>
      <div className="farm-emissions-page">
        {/* Go back to ground page*/}
        <BackButton pageType="ground"/>

        <h1 className="page-title">Farm Emissions Showdown</h1>

        <p className="description">
          Click on a source below to see how its emissions grow.
        </p>

        {/* Emissions Bubble (Main Visualization) */}
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
            style={{
              width: `${gasSizes.industrial}px`,
              height: `${gasSizes.industrial}px`,
            }}
          >
            🏭
          </div>
        </div>

        {/* Clickable Sources */}
        <div className="emission-sources">
          {Object.keys(emissionsData).map((source) => (
            <button
              key={source}
              className="emission-button"
              onClick={() => handleClick(source)}
            >
              {source === "cow"
                ? "🐄 Cow"
                : source === "rice"
                ? "🌾 Rice"
                : "🏭 Industrial"}
            </button>
          ))}
        </div>

        {/* Selected Info */}
        {selectedSource && (
          <div className="emission-info">
            <h3>{emissionsData[selectedSource].name}</h3>
            <p>{emissionsData[selectedSource].description}</p>
          </div>
        )}

        {/* Reset Button */}
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default FarmEmissions;
