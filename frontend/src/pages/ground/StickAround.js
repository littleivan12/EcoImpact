import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/StickAround.css"; // Updated styles
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";

function CupType({ type }) {
  if (type === "biodegradable-cup") {
    return (
      <img
        src={`/visuals/ground/cups/cup0.png`}
        alt="Biodegradable Cup"
        className="degrade-img"
      />
    );
  } else if (type === "plastic-cup") {
    return (
      <img
        src={`/visuals/ground/cups/cup1.png`}
        alt="Plastic Cup"
        className="degrade-img"
      />
    );
  } else if (type === "metal-cup") {
    return (
      <img
        src={`/visuals/ground/cups/cup2.png`}
        alt="Metal Cup"
        className="degrade-img"
      />
    );
  } else {
    return null;
  }
}

function StickAround() {
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [recycled, setRecycled] = useState(false);

  // Degradation periods in years
  const degradationData = {
    "metal-cup": { years: 5000, degradesIn: "Year 3000+" },
    "plastic-cup": { years: 450, degradesIn: "Year 2450" },
    "biodegradable-cup": { years: 1, degradesIn: "Year 1 AD" },
  };

  return (
    <div>
      <TopBar hex1="#2bd634" hex2="#0b7e2c"/>
      <div className="stick-around-page">
        <BackButton pageType="ground"/>

        <h1 className="page-title">Stick Around</h1>
        <p className="subtitle">
          See how long three different materials last before they degrade
        </p>

        {/* Selection Controls */}
        <div className="selection-container">
          <h2 className="selection-title">
            Choose an Item to Litter in Ancient Rome, year 1
          </h2>

          <div className="material-buttons">
            <button
              className={`material-button ${
                selectedMaterial === "metal-cup" ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedMaterial("metal-cup");
                setRecycled(true);
              }}
            >
              Metal Cup
            </button>
            <button
              className={`material-button ${
                selectedMaterial === "plastic-cup" ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedMaterial("plastic-cup");
                setRecycled(false);
              }}
            >
              Plastic Cup
            </button>
            <button
              className={`material-button ${
                selectedMaterial === "biodegradable-cup" ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedMaterial("biodegradable-cup");
                setRecycled(false);
              }}
            >
              Biodegradable Cup
            </button>
          </div>
        </div>

        {/* Display Result */}
        {selectedMaterial && (
          <div className="degradation-result">
            <CupType type={selectedMaterial} />

            <h3>
              You dropped a {selectedMaterial.replace("-", " ")} in Ancient
              Rome...
            </h3>

            {selectedMaterial === "metal-cup" && recycled ? (
              <>
                <p>
                  Metal takes thousands of years to degrade… but can be{" "}
                  <strong>recycled in just a few months</strong>! ♻️
                </p>
                <p>
                  If recycled, your cup is reused by <strong>Year 1 AD</strong>{" "}
                  again — without losing its integrity.
                </p>
                <p className="flavor-text">
                  Just in time to see Tiberius quell some revolts in Germania.
                </p>
              </>
            ) : selectedMaterial === "plastic-cup" ? (
              <>
                <p>
                  Plastic might not seem bad at first... but it takes{" "}
                  <strong>centuries</strong> to break down, and releases
                  microplastics along the way. 😬
                </p>
                <p>
                  It will fully degrade by{" "}
                  <strong>{degradationData[selectedMaterial].degradesIn}</strong>.
                </p>
                <p className="flavor-text">
                  If we last that long, humanity might be spread across the
                  galaxy.
                </p>
              </>
            ) : selectedMaterial === "biodegradable-cup" ? (
              <>
                <p>
                  This cup is designed to break down quickly and safely in nature.
                  🌿
                </p>
                <p>
                  It will fully degrade by{" "}
                  <strong>{degradationData[selectedMaterial].degradesIn}</strong>.
                </p>
                <p className="flavor-text">
                  Just in time to catch the birth of Christianity.
                </p>
              </>
            ) : null}

            {/* Timeline Visualization */}
            <div className="timeline-container">
              <p className="timeline-label">Degradation Timeline</p>
              <div className="timeline">
                <div
                  className={`timeline-marker ${
                    selectedMaterial === "plastic-cup" && !recycled
                      ? "end-marker"
                      : ""
                  }`}
                  style={{
                    left: `${
                      recycled
                        ? 0
                        : selectedMaterial === "plastic-cup"
                        ? 100
                        : (degradationData[selectedMaterial].years / 5000) * 100
                    }%`,
                    transition: "left 1s ease-in-out",
                  }}
                >
                  {recycled
                    ? "Recycled!"
                    : degradationData[selectedMaterial].degradesIn}
                </div>
              </div>
            </div>

            {/* Recycling animation for metal cup */}
            <br />
            {recycled && (
              <video
                className="recycle-animation"
                autoPlay
                loop
                muted
              >
                <source src="/visuals/ground/cups/recycle.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
      </div>
    <Footer />
    </div>
  );
}

export default StickAround;