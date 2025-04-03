import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/MapPage.css";
import worldMap from "../../assets/world-map-placeholder.png";
import AirEffects from "../../components/AirEffects.js";
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";

function EffectNames({value, thresholds}){
  /* Modify threshold values for words here */
  const [effectWords, setEffectWords] = useState([]);
  
  useEffect(() => {
    let newWords = [];

    if (value > thresholds[0]) newWords.push("Acid Rain");
    if (value > thresholds[1]) newWords.push("Plant Death");
    if (value > thresholds[2]) newWords.push("Animal Death");

    setEffectWords(newWords);

  }, [value]);

  return (
    <div className="effect-container">
      {effectWords.map((word, index) => (
        <div
          key={index}
          className={`effect-word ${effectWords.includes(word) ? 'show' : ''}`}
        >
          {word}
        </div>
      ))}
    </div>
  );
}

function MapPage() {
  /* Change Environment Impact thresholds here */
  const limitArr = [5000, 10000, 15000];

  const countries = [
    { name: "USA", emissions: 5000 },
    { name: "China", emissions: 10000 },
    { name: "India", emissions: 3000 },
    { name: "Europe", emissions: 4000 },
    { name: "Brazil", emissions: 2000 },
    { name: "Russia", emissions: 3500 },
  ];

  const totalInitialEmissions = countries.reduce(
    (sum, country) => sum + country.emissions,
    0
  );

  const [selectedCountries, setSelectedCountries] = useState(
    countries.reduce((acc, country) => ({ ...acc, [country.name]: true }), {})
  );

  const totalEmissions = countries.reduce(
    (sum, country) =>
      selectedCountries[country.name] ? sum + country.emissions : sum,
    0
  );

  const deselectCountry = (countryName) => {
    setSelectedCountries((prev) => ({
      ...prev,
      [countryName]: !prev[countryName],
    }));
  };

  return (
    <div>
      <TopBar hex1="#f6e36a" hex2="#97840c"/>
      <div className="map-page-container">
        {/* Go back to air page*/}
        <BackButton pageType="air"/>

        <h1 className="map-title">National Impact</h1>
        <p className="map-subtitle">Click a location to remove their emissions</p>

        {/* Flex container for Map & Environmental Effects */}
        <div className="map-impact-container">
          {/* Map Section */}
          <div className="map-container">
            <img src={worldMap} alt="World Map" className="world-map" />
            <div className="country-buttons">
              {countries.map((country) => (
                <button
                  key={country.name}
                  className={`country-button ${
                    selectedCountries[country.name] ? "selected" : "deselected"
                  }`}
                  onClick={() => deselectCountry(country.name)}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          {/* Environmental Effects Section */}
          <div className="effects-container">
            <h2>Environmental Impact</h2>
            <div className="effects-placeholder">
              <AirEffects value={totalEmissions} set={limitArr}/>
            </div>
            <EffectNames value={totalEmissions} thresholds={limitArr}/>
          </div>
        </div>

        {/* CO2 Levels Section */}
        <div className="co2-container">
          <h2>CO₂ Levels in 50 Years</h2>
          <div className="co2-bar">
            <div
              className="co2-progress"
              style={{
                width: `${(totalEmissions / totalInitialEmissions) * 100}%`,
              }}
            ></div>
          </div>
          <p>{totalEmissions.toLocaleString()} million metric tons</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MapPage;
