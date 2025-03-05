import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./StickAround.css"; // Updated styles

function StickAround() {
  const [selectedMaterial, setSelectedMaterial] = useState("");

  // Data: Degradation periods in years
  const degradationData = {
    "metal-cup": { years: 5000, degradesIn: "Year 3000+" },
    "plastic-cup": { years: 450, degradesIn: "Year 2450" },
    "biodegradable-cup": { years: 1, degradesIn: "Year 1 AD" },
  };

  return (
    <div className="stick-around-page">
      {/* Home Button (Top Left) */}
      <Link to="/" className="home-icon"></Link>

      <h1 className="page-title">Stick Around</h1>
      <p className="subtitle">See how long daily items last before they degrade</p>

      {/* Selection Controls */}
      <div className="selection-container">
        <h2 className="selection-title">Choose an Item to Litter in Ancient Rome</h2>

        <div className="material-buttons">
          <button
            className={`material-button ${selectedMaterial === "metal-cup" ? "selected" : ""}`}
            onClick={() => setSelectedMaterial("metal-cup")}
          >
            Metal Cup
          </button>
          <button
            className={`material-button ${selectedMaterial === "plastic-cup" ? "selected" : ""}`}
            onClick={() => setSelectedMaterial("plastic-cup")}
          >
            Plastic Cup
          </button>
          <button
            className={`material-button ${selectedMaterial === "biodegradable-cup" ? "selected" : ""}`}
            onClick={() => setSelectedMaterial("biodegradable-cup")}
          >
            Biodegradable Cup
          </button>
        </div>
      </div>

      {/* Display Result */}
      {selectedMaterial && (
        <div className="degradation-result">
          <h3>You dropped a {selectedMaterial.replace("-", " ")} in Ancient Rome...</h3>
          <p>
            It will fully degrade by <strong>{degradationData[selectedMaterial].degradesIn}</strong>.
          </p>

          {/* Timeline Visualization */}
          <div className="timeline-container">
            <p className="timeline-label">Degradation Timeline</p>
            <div className="timeline">
              <div
                className="timeline-marker"
                style={{ left: `${(degradationData[selectedMaterial].years / 5000) * 100}%` }}
              >
                {degradationData[selectedMaterial].degradesIn}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StickAround;
