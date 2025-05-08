import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/IceSheets.css";
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";

function SeaLvlImage({ value }) {
  if (value >= 0 && value <= 2) {
    return <img src={`/visuals/water/levels/levels0.png`} alt="Sea Level Low" className="sea-level-img" />;
  } else if (value >= 3 && value <= 5) {
    return <img src={`/visuals/water/levels/levels1.png`} alt="Sea Level Moderate" className="sea-level-img" />;
  } else if (value >= 6 && value <= 8) {
    return <img src={`/visuals/water/levels/levels2.png`} alt="Sea Level High" className="sea-level-img" />;
  } else {
    return <img src={`/visuals/water/levels/levels3.png`} alt="Sea Level Very High" className="sea-level-img" />;
  }
}

function ImpactInfo({ value }) {
  // Each tick = 10 cm (≈ 4 in) of global sea‑level rise.
  const cm  = value * 10;
  const inc = (cm / 2.54).toFixed(0);

  const gtIce = value * 36000;                    // cumulative melt, gigatonnes
  const greenlandPct = ((gtIce / 2600000) * 100).toFixed(1); // Greenland Ice Sheet ≈ 2 600 000 Gt

  let text;

  if (value === 0) {
    text = "No additional sea‑level rise.";
  } else if (value === 1) {
    text = `≈ ${cm} cm / ${inc} in higher: <strong className="impact-highlight">❗️ nuisance flooding&nbsp;(a.k.a. high‑tide flooding—streets & basements inundated during the year’s highest “king tides”)</strong> at coastal hot‑spots becomes common. (Total ice melted so far: ${gtIce.toLocaleString()} Gt ≈ ${greenlandPct}% of Greenland’s ice mass)`;
  } else if (value <= 3) {
    text = `≈ ${cm} cm / ${inc} in higher: <strong className="impact-highlight">❗️❗️ low‑lying farmland and salt‑marshes start to drown</strong>; coastal defences need upgrades. (Total ice melted so far: ${gtIce.toLocaleString()} Gt ≈ ${greenlandPct}% of Greenland’s ice mass)`;
  } else if (value <= 6) {
    text = `≈ ${cm} cm / ${inc} in higher: <strong className="impact-highlight">❗️❗️❗️ tens of millions worldwide face yearly flood risk</strong>; some island nations consider relocating. (Total ice melted so far: ${gtIce.toLocaleString()} Gt ≈ ${greenlandPct}% of Greenland’s ice mass)`;
  } else if (value <= 8) {
    text = `≈ ${cm} cm / ${inc} in higher: <strong className="impact-highlight">❗️❗️❗️❗️ big coastal cities spend <u>hundreds of billions</u> on sea‑walls or managed retreat</strong>. (Total ice melted so far: ${gtIce.toLocaleString()} Gt ≈ ${greenlandPct}% of Greenland’s ice mass)`;
  } else {
    text = `≈ ${cm} cm / ${inc} in higher (~1 m / 3 ft): <strong className="❗️❗️❗️❗️ impact-highlight">❗️❗️❗️❗️❗️ large coastal ecosystems lost; adaptation costs soar above <u>$100 B per year</u></strong>. (Total ice melted so far: ${gtIce.toLocaleString()} Gt ≈ ${greenlandPct}% of Greenland’s ice mass)`;
  }

  return (
    <div className="impact-card">
      {/* headline metric */}
      <p className="impact-headline">
        {cm}&nbsp;cm&nbsp;/&nbsp;{inc}&nbsp;in
        <span className="headline-note"> SEA-LEVEL RISE</span>
      </p>
  
      {/* descriptive impacts */}
      <p className="impact-body" dangerouslySetInnerHTML={{ __html: text }}></p>
  
      {/* footnote / ice-mass context */}
      <p className="impact-footnote">
        🧊 Ice melted so far: {gtIce.toLocaleString()} Gt &nbsp;|&nbsp; ≈ {greenlandPct}% of Greenland’s ice sheet
      </p>
    </div>
  );
}

function IceSheets() {
  const [meltedSheets, setMeltedSheets] = useState(0);

  const cmRise   = meltedSheets * 10;               // global‑mean sea‑level change
  const inchRise = (cmRise / 2.54).toFixed(1);      // convert to inches (~4 in per tick)

  return (
    <div>
      <TopBar hex1="#4ebeee" hex2="#140b8d" />
      <div className="ice-sheet-page">
        <BackButton pageType="water" />
        <h1 className="page-title">What happens if you melt the Greenland ice sheet?</h1>

        {/* Ice Sheet and Sea Level Visualization */}
        <div className="visualization-container">
          {/* Ice Sheet Melting Section */}
          <div className="ice-sheet-section">
            <img
              src={`/visuals/water/sheets/sheet${meltedSheets}.png`}
              alt={`Ice Sheet ${meltedSheets}`}
              className="ice-sheet-img"
            />
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={meltedSheets}
                onChange={(e) => setMeltedSheets(parseInt(e.target.value))}
                className="slider"
              />
              <br />
              <span className="slider-label">
                Sea‑level rise: {cmRise}&nbsp;cm&nbsp;(~{inchRise}&nbsp;in) | Ice melted: {(meltedSheets * 36000).toLocaleString()} Gt
              </span>
            </div>
          </div>

          {/* Sea Level Change Section */}
          <div className="sea-level-section">
            <SeaLvlImage value={meltedSheets} />
            <p className="sea-level-label">Current Sea Level</p>
          </div>
        </div>

        {/* Impact Information */}
        <ImpactInfo value={meltedSheets} />
      </div>
      <Footer />
    </div>
  );
}

export default IceSheets;