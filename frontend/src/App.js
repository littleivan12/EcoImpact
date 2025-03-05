import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaCloud, FaWater, FaTree, FaMapMarkedAlt, FaSnowflake, FaRecycle, FaTrash } from "react-icons/fa";
import "./App.css";
import Selectbox from "./components/Selectbox.js";


function Home() {
  return (
    <div className="h-screen flex">
      <Link
        to="/air"
        className="bg-yellow-200 flex-1 flex items-center justify-center text-4xl font-bold hover:bg-yellow-300 transition"
      >
        <Selectbox page="Air"/>
        Air
      </Link>
      <Link
        to="/water"
        className="bg-blue-500 flex-1 flex items-center justify-center text-4xl font-bold hover:bg-blue-600 transition text-white"
      >
        <Selectbox page="Water"/>
        Water
      </Link>
      <Link
        to="/ground"
        className="bg-green-400 flex-1 flex items-center justify-center text-4xl font-bold hover:bg-green-500 transition text-white"
      >
        <Selectbox page="Ground"/>
        Ground
      </Link>
    </div>
  );
}

function Air() {
  return (
    <div className="page-container air-bg">
      <h1 className="page-title">This is the state of our Air</h1>
      <div className="card-container">
        <div className="info-card clickable-card">
          <h2>Company V. You</h2>
          <div className="fight-box">FIGHT ⚡🔥</div>
          <p>⚡💨 Emissions vs. Your Actions 💨⚡</p>
        </div>
        <div className="info-card clickable-card">
          <h3 className="card-title">Map the Emissions 🌎</h3>
          <FaMapMarkedAlt className="map-icon" />
          <p className="coming-soon">(Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}

function Water() {
  return (
    <div className="page-container water-bg-updated">
      <h1 className="page-title">Water</h1>
      <div className="card-container">
        <div className="info-card clickable-card">
          <h3 className="card-title">Ice? Sheet!</h3>
          <FaSnowflake className="map-icon" />
          <p className="page-description">
            Visualize the effect of ice sheets melting on sea levels. Interactive animations coming soon.
          </p>
          <p className="coming-soon">(Coming Soon)</p>
        </div>
        <div className="info-card clickable-card">
          <h3 className="card-title">Water Pollution Insights</h3>
          <FaWater className="map-icon" />
          <p className="page-description">
            Explore ocean contamination rates, ecosystem impacts, and clean water access data.
          </p>
          <p className="coming-soon">(Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}

/*This is the ground page*/
function Ground() {
  return (
    <div className="page-container ground-bg-updated">
      <h1 className="page-title">Ground</h1>
      <div className="card-container">
        <div className="info-card clickable-card">
          <h3 className="card-title">Stick Around?</h3>
          <FaTrash className="map-icon" />
          <p className="page-description">
            Discover how long common items last before degrading back into the environment.
          </p>
          <p className="coming-soon">(Coming Soon)</p>
        </div>
        <div className="info-card clickable-card">
          <h3 className="card-title">Soil Health & Degradation</h3>
          <FaRecycle className="map-icon" />
          <p className="page-description">
            Learn about the impact of land-use changes and deforestation on soil health.
          </p>
          <p className="coming-soon">(Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/air" element={<Air />} />
        <Route path="/water" element={<Water />} />
        <Route path="/ground" element={<Ground />} />
      </Routes>
    </Router>
  );
}

export default App;
