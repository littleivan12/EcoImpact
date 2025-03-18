import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/IceSheets.css"; // New CSS file
import iceSheetImage from "../../assets/ice-sheet-placeholder.png"; // Placeholder image for ice sheet
import seaLevelImage from "../../assets/sea-level-placeholder.png"; // Placeholder image for sea level

function IceSheets() {
  const [meltedSheets, setMeltedSheets] = useState(0);

  return (
    <div className="ice-sheet-page">
      {/* Go back to water page*/}
      <Link to="/water" className="home-icon"></Link>

      <h1 className="page-title">Ecolmpact</h1>

      {/* Ice Sheet and Sea Level Visualization */}
      <div className="visualization-container">
        {/* Ice Sheet Melting Section */}
        <div className="ice-sheet-section">
          <img src={iceSheetImage} alt="Ice Sheet" className="ice-sheet-img" />
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="10"
              value={meltedSheets}
              onChange={(e) => setMeltedSheets(e.target.value)}
              className="slider"
            />
            <span className="slider-label">
              {meltedSheets} Ice Sheets Melted
            </span>
          </div>
        </div>

        {/* Sea Level Change Section */}
        <div className="sea-level-section">
          <img src={seaLevelImage} alt="Sea Level" className="sea-level-img" />
          <p className="sea-level-label">Current Sea Level</p>
        </div>
      </div>
    </div>
  );
}

export default IceSheets;
