import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/IceSheets.css"; // New CSS file
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";

function SeaLvlImage({value}) {
  if(value >= 0 && value <= 2){
    return <img src={`/visuals/water/levels/levels0.png`} alt="Ice Sheet" className="ice-sheet-img" />;
  } else if(value >=3 && value <=5) {
    return <img src={`/visuals/water/levels/levels1.png`} alt="Ice Sheet" className="ice-sheet-img" />;
  } else if(value >=6 && value <=8) {
    return <img src={`/visuals/water/levels/levels2.png`} alt="Ice Sheet" className="ice-sheet-img" />;
  } else{
    return <img src={`/visuals/water/levels/levels3.png`} alt="Ice Sheet" className="ice-sheet-img" />;
  }
}

function IceSheets() {
  const [meltedSheets, setMeltedSheets] = useState(0);

  return (
    <div>
      <TopBar hex1="#4ebeee" hex2="#140b8d"/>
      <div className="ice-sheet-page">
        {/* Go back to water page*/}
        <BackButton pageType="water"/>

        <h1 className="page-title">Ecolmpact</h1>

        {/* Ice Sheet and Sea Level Visualization */}
        <div className="visualization-container">
          {/* Ice Sheet Melting Section */}
          <div className="ice-sheet-section">
            <img src={`/visuals/water/sheets/sheet${meltedSheets}.png`} alt="Ice Sheet" className="ice-sheet-img" />

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
            <SeaLvlImage value={meltedSheets} />
            <p className="sea-level-label">Current Sea Level</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default IceSheets;
