import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaCloud, FaWater, FaTree, FaMapMarkedAlt, FaSnowflake, FaRecycle, FaTrash } from "react-icons/fa";
import "./styles/App.css";
import MapPage from "./pages/air/MapPage.js";
import IceSheets from "./pages/water/IceSheets.js";
import StickAround from "./pages/ground/StickAround.js";
import CarbonComparison from "./pages/air/CarbonComparison.js";
import PlasticOcean from "./pages/water/PlasticOcean.js";
import FarmEmissions from "./pages/ground/FarmEmissions.js";
import Selectbox from "./components/Selectbox.js";
import TopBar from "./components/TopBar.js";
import Footer from "./components/Footer.js";


function Home() {
  return (
    <div>
      <TopBar hex1="#2bd634" hex2="#0b7e2c"/>
      <div className="card-container" >
        <Link
          to="/air"
          className="bg-yellow-200 flex-1 flex items-center justify-left text-4xl font-bold hover:bg-yellow-300 transition"
        >
          <Selectbox page="air" label="Air"/>
        </Link>
        <Link
          to="/water"
          className="width-200px bg-blue-500 flex-1 flex items-center justify-center text-4xl font-bold hover:bg-blue-600 transition text-white"
        >
          <Selectbox page="water" label="Water"/>
        </Link>
        <Link
          to="/ground"
          className="bg-green-400 flex-1 flex items-center justify-right text-4xl font-bold hover:bg-green-500 transition text-white"
        >
          <Selectbox page="ground" label="Ground"/>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

function Air() {
  return (
    <div>
      <TopBar hex1="#f6e36a" hex2="#97840c"/>
      <div className="page-container " /*air-bg*/>
        <div className="page-title">
          <h1>This is the state of our Air</h1>
        </div>
        <div className="card-container">
          {/* Carbon Comparison Card (Company V. You) Links to Carbon Comparison Page */}
          <Link to="/carbon-comparison" className="info-card clickable-card">
            <h2>Company V. You</h2>
            <div className="fight-box">FIGHT ⚡🔥</div>
            <p>⚡💨 Emissions vs. Your Actions 💨⚡</p>
          </Link>

          <Link to="/map" className="info-card clickable-card">
            <h3 className="card-title">Map the Emissions 🌎</h3>
            <FaMapMarkedAlt className="map-icon" />
            <p className="coming-soon">See the biggest CO2 contributors</p>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Water() {
  return (
    <div>
      <TopBar hex1="#4ebeee" hex2="#140b8d"/>
      <div className="page-container "/*water-bg-updated*/>
        <div className="page-title">
          <h1>Water</h1>
        </div>
        <div className="card-container">
          {/* Link "Ice? Sheet!" Card to Ice Sheets Page */}
          <Link to="/ice-sheets" className="info-card clickable-card">
            <h3 className="card-title">Ice? Sheet!</h3>
            <FaSnowflake className="map-icon" />
            <p className="page-description">
              Visualize the effect of ice sheets melting on sea levels.
            </p>
          </Link>

          <Link to="/plastic-ocean" className="info-card clickable-card">
            <h3 className="card-title">A Plastic Ocean</h3>
            <FaWater className="map-icon" />
            <p className="page-description">
              See how much of the ocean could become plastic.
            </p>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/*This is the ground page*/
function Ground() {
  return (
    <div>
      <TopBar hex1="#2bd634" hex2="#0b7e2c"/>
      <div className="page-container"/*ground-bg-updated*/>
        <div className="page-title">
          <h1>Ground</h1>
        </div>
        <div className="card-container">
          
          {/* Link "Stick Around?" Card to Stick Around Page */}
          <Link to="/stick-around" className="info-card clickable-card">
            <h3 className="card-title">Stick Around?</h3>
            <FaTrash className="map-icon" />
            <p className="page-description">
              Discover how long common items last before degrading back into the environment.
            </p>
          </Link>

          <Link to="/farm-emissions" className="info-card clickable-card">
            <h3 className="card-title">Farm Emissions Showdown</h3>
            <FaRecycle className="map-icon" />
            <p className="page-description">
              Learn about the impact of farming on the climate.
            </p>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    //<Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/air" element={<Air />} />
        <Route path="/water" element={<Water />} />
        <Route path="/ground" element={<Ground />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/ice-sheets" element={<IceSheets />} />
        <Route path="/stick-around" element={<StickAround />} />
        <Route path="/carbon-comparison" element={<CarbonComparison />} />
        <Route path="/plastic-ocean" element={<PlasticOcean />} />
        <Route path="/farm-emissions" element={<FarmEmissions />} />
      </Routes>
    //</Router>
  );
}

export default App;
