import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/StickAround.css"; // Updated styles
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";

function CupType({type}){
  if(type === "biodegradable-cup"){
    return <img src={`/visuals/ground/cups/cup0.png`} alt="Biodegradable Cup" className="degrade-img" />;
  } else if(type === "plastic-cup") {
    return <img src={`/visuals/ground/cups/cup1.png`} alt="Plastic Cup" className="degrade-img" />;
  } else if(type === "metal-cup") {
    return <img src={`/visuals/ground/cups/cup2.png`} alt="Metal Cup" className="degrade-img" />;
  } else {
    return null;
  }
}

function StickAround() {
  const [selectedMaterial, setSelectedMaterial] = useState("");

  // Data: Degradation periods in years
  const degradationData = {
    "metal-cup": { years: 5000, degradesIn: "Year 3000+" },
    "plastic-cup": { years: 450, degradesIn: "Year 2450" },
    "biodegradable-cup": { years: 1, degradesIn: "Year 1 AD" },
  };

  return (
    <div>
      <TopBar hex1="#2bd634" hex2="#0b7e2c"/>
      <div className="stick-around-page">
        {/* Go back to ground page*/}
        <BackButton pageType="ground"/>

        <h1 className="page-title">Stick Around</h1>
        <p className="subtitle">
          See how long daily items last before they degrade
        </p>

        {/* Selection Controls */}
        <div className="selection-container">
          <h2 className="selection-title">
            Choose an Item to Litter in Ancient Rome
          </h2>

          <div className="material-buttons">
            <button
              className={`material-button ${
                selectedMaterial === "metal-cup" ? "selected" : ""
              }`}
              onClick={() => setSelectedMaterial("metal-cup")}
            >
              Metal Cup
            </button>
            <button
              className={`material-button ${
                selectedMaterial === "plastic-cup" ? "selected" : ""
              }`}
              onClick={() => setSelectedMaterial("plastic-cup")}
            >
              Plastic Cup
            </button>
            <button
              className={`material-button ${
                selectedMaterial === "biodegradable-cup" ? "selected" : ""
              }`}
              onClick={() => setSelectedMaterial("biodegradable-cup")}
            >
              Biodegradable Cup
            </button>
          </div>
        </div>

        {/* Display Result */}
        {selectedMaterial && (
          <div className="degradation-result">
            <CupType type={selectedMaterial}/>
            
            <h3>
              You dropped a {selectedMaterial.replace("-", " ")} in Ancient
              Rome...
            </h3>
            <p>
              It will fully degrade by{" "}
              <strong>{degradationData[selectedMaterial].degradesIn}</strong>.
            </p>

            {/* Timeline Visualization */}
            <div className="timeline-container">
              <p className="timeline-label">Degradation Timeline</p>
              <div className="timeline">
                <div
                  className="timeline-marker"
                  style={{
                    left: `${
                      (degradationData[selectedMaterial].years / 5000) * 100
                    }%`,
                  }}
                >
                  {degradationData[selectedMaterial].degradesIn}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default StickAround;
