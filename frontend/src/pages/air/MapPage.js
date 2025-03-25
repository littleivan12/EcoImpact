import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/MapPage.css";
import worldMap from "../../assets/world-map-placeholder.png";

function MapPage() {
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
    <div className="map-page-container">
      {/* Go back to air page*/}
      <Link to="/air" className="home-icon"></Link>

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
            <p>(Animated impact preview based on emissions)</p>
          </div>
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
  );
}

export default MapPage;
