import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as topojson from "topojson-client";
import * as d3 from "d3";
import "../../styles/MapPage.css"; // Assuming we are adding custom styles
import _ from 'lodash';
import BackButton from "../../components/BackButton.js";
import TopBar from "../../components/TopBar.js";
import Footer from "../../components/Footer.js";
import AirEffects from "../../components/AirEffects.js";
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background-color", "rgba(0,0,0,0.7)")
  .style("color", "#fff")
  .style("padding", "6px 10px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none")
  .style("opacity", 0);


const drawLegend = () => {
  const colorScale = d3.scaleThreshold()
    .domain([100, 500, 1000, 5000, 10000])
    .range(["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]);

  const legendContainer = d3.select("#legend");
  legendContainer.selectAll("*").remove(); // Clear old legend

  const width = 10;
  const height = 50;

  const svg = legendContainer.append("svg")
    .attr("width", width)
    .attr("height", height);

  const defs = svg.append("defs");

  const linearGradient = defs.append("linearGradient")
    .attr("id", "legend-gradient");

  const legendDomain = colorScale.domain();
  const legendRange = colorScale.range();

  linearGradient.selectAll("stop")
    .data(legendDomain.map((d, i) => ({
      offset: `${(i / (legendDomain.length - 1)) * 100}%`,
      color: legendRange[i]
    })))
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  svg.append("rect")
    .attr("x", 5)
    .attr("y", 10)
    .attr("width", 250)
    .attr("height", 10)
    .style("fill", "url(#legend-gradient)")
    .style("stroke", "#000")
    .style("stroke-width", 0.3);

  const legendScale = d3.scaleLinear()
    .domain([legendDomain[0], legendDomain[legendDomain.length - 1]])
    .range([5, 255]);

  const legendAxis = d3.axisBottom(legendScale)
    .tickValues(legendDomain)
    .tickFormat(d3.format(".0f"));

  svg.append("g")
    .attr("transform", "translate(0, 22)")
    .call(legendAxis);

  svg.append("text")
    .attr("x", 5)
    .attr("y", 40)
    .style("font-size", "12px")
    .text("Total CO₂ Emissions (in MMT)");
};

// After map drawing logic
drawLegend();





function EffectNames({ value, thresholds }) {
  /* Modify threshold values for words here */
  const [effectWords, setEffectWords] = useState([]);

  useEffect(() => {
    let newWords = [];

    if (value > thresholds[0]) newWords.push("Heavy Haze");
    if (value > thresholds[1]) newWords.push("Acid Rain");
    if (value > thresholds[2]) newWords.push("Plant Death");
    if (value > thresholds[3]) newWords.push("Animal Death");

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

const AirDataMap = () => {
  /* Change Environment Impact thresholds here */
  const limitArr = [15000, 30000, 45000, 50000];

  // State Management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [co2History, setCo2History] = useState([]);
  const [totalEmissions, setTotalEmissions] = useState(37123.850352);
  const [viewMode, setViewMode] = useState("country"); // "map" or "country"
  const [removedCountries, setRemovedCountries] = useState(new Set());

  const svgRef = useRef(null);
  const countryDataMapRef = useRef({});
  const colorScaleRef = useRef();

  const GLOBAL_CO2_TOTAL = 37123.850352; // Fixed world total CO₂ emissions

  // Line Graph for Country Data Rendering Function
  function renderGraph(data) {
    const width = 300, height = 300, margin = { top: 20, right: 20, bottom: 50, left: 60 };
  
    const svg = d3.select("#co2-graph")
      .attr("width", width)
      .attr("height", height);
  
    svg.selectAll("*").remove(); // Clear previous content
  
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.Year))
      .range([margin.left, width - margin.right]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total)])
      .range([height - margin.bottom, margin.top]);
  
      const yearExtent = d3.extent(data, d => d.Year);
const startYear = Math.ceil(yearExtent[0] / 30) * 30;
const endYear = yearExtent[1];
const tickYears = d3.range(startYear, endYear + 1, 30);

const xAxis = d3.axisBottom(xScale)
  .tickValues(tickYears)
  .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);
  
    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);
  
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
  
    // Axis Labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Year");
  
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Total CO₂ Emissions");
  
    // Line rendering
    const line = d3.line()
      .x(d => xScale(d.Year))
      .y(d => yScale(d.total))
      .curve(d3.curveMonotoneX);
  
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }
  

  useEffect(() => {
    console.time("dataFetch");

    fetch("http://127.0.0.1:8000/air_super/")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        console.timeEnd("dataFetch");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.timeEnd("dataFetch");
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const drawMap = () => {
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then((world) => {
          const mapContainer = document.getElementById("map");
          const width = mapContainer.clientWidth || window.innerWidth;
          const height = mapContainer.clientHeight || window.innerHeight;

          const projection = d3.geoNaturalEarth1()
            .scale(200)
            .translate([width / 2, height / 2]);

          const pathGenerator = d3.geoPath().projection(projection);

          d3.select("#map").selectAll("*").remove();

          const svg = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "#87CEEB");
          svgRef.current = svg;

          const graticule = d3.geoGraticule();
          svg.append("path")
            .datum(graticule())
            .attr("d", pathGenerator)
            .attr("fill", "none")
            .attr("stroke", "#ffffff")
            .attr("stroke-opacity", 0.2);

          const countryDataMap = data.reduce((acc, country) => {
            const formattedCode = String(country.number_code).padStart(3, "0");
            acc[formattedCode] = country;
            return acc;
          }, {});

          const colorScale = d3.scaleThreshold()
            .domain([100, 500, 1000, 5000, 10000])
            .range(["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]);


          // === 🗺️ Map countries ===
          const getCountryFill = (countryCode) => {
            const countryData = countryDataMap[countryCode];
            if (removedCountries.has(countryCode)) return "#ccc";
            return countryData ? colorScale(countryData.total) : "";
          };

          const countries = svg.append("g")
            .selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append("path")
            .attr("d", pathGenerator)
            .attr("fill", d => {
              const countryCode = String(d.id).padStart(3, "0");
              return getCountryFill(countryCode);
            })
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .on("mouseover", function (event, d) {
              const countryCode = String(d.id).padStart(3, "0");
              const countryData = countryDataMap[countryCode];
              const countryName = countryData?.country || "Unknown";

              d3.select(this)
                .transition()
                .duration(1000)
                .attr("stroke-width", 1.5);
              // Cancel any previous fade-out transition immediately
              tooltip.interrupt();
              tooltip
                .style("opacity", 1)
                .html(`<div style="white-space: normal;"><strong>${countryName}</strong></div>`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);

            })
            .on("mousemove", function (event) {
              tooltip
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(500)
                .attr("stroke-width", 0.5);

              tooltip
                .transition()
                .duration(200)
                .style("opacity", 0);
            })
            .on("click", (event, d) => {
              const countryCode = String(d.id).padStart(3, "0");
              const countryData = countryDataMap[countryCode];

              if (viewMode === "country") {
                setSelectedCountry(countryData || { country: "Unknown", total: 0 });

                if (countryData) {
                  fetch(`http://127.0.0.1:8000/air_super/${countryCode}/past_five_years`)
                    .then((response) => response.json())
                    .then((history) => {
                      const lastFiveYears = history.map((d) => ({
                        Year: d.Year || d.year,
                        total: d.total,
                      }));
                      setCo2History(lastFiveYears);
                      renderGraph(lastFiveYears);
                    });
                }

                d3.selectAll("path").attr("stroke-width", 0.5);
                d3.select(event.currentTarget)
                  .transition()
                  .duration(300)
                  .attr("stroke-width", 2);

                return;
              }

              
              if (removedCountries.has(countryCode)) {
                removedCountries.delete(countryCode);
                updateEmissionsOnSelection(countryData?.total || 0, totalEmissions);
                setSelectedCountry(null);
              } else {
                setSelectedCountry(countryData || { country: "Unknown", total: 0 });
                updateEmissionsOnDeselect(countryData?.total || 0, totalEmissions);
                setRemovedCountries((prev) => new Set(prev).add(countryCode));
              }

              d3.select(event.currentTarget)
                .transition()
                .duration(300)
                .attr("fill", getCountryFill(countryCode));

              if (countryData) {
                fetch(`http://127.0.0.1:8000/air_super/${countryCode}/past_five_years`)
                  .then((response) => response.json())
                  .then((history) => {
                    const lastFiveYears = history.map((d) => ({
                      Year: d.year,
                      total: d.total,
                    }));
                    setCo2History(lastFiveYears);
                    renderGraph(lastFiveYears);
                  });
              }

            });
        })


        .catch(error => console.error("Error loading world map:", error));

    };

    drawMap();
    drawLegend();


    const debounceDrawMap = _.debounce(drawMap, 200);
    window.addEventListener("resize", debounceDrawMap);

    return () => {
      window.removeEventListener("resize", debounceDrawMap);
    };
  }, [data, removedCountries]);

  // Toggle between map and country view
  const handleViewToggle = () => {
    setViewMode(viewMode === "map" ? "country" : "map");
  };

  const resetMap = () => {
    setRemovedCountries(new Set()); // Reset the removed countries state

    const countryDataMap = data.reduce((acc, country) => {
      const formattedCode = String(country.number_code).padStart(3, "0");
      acc[formattedCode] = country;
      return acc;
    }, {});

    const colorScale = d3.scaleThreshold()
      .domain([100, 500, 1000, 5000, 10000])
      .range(["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]);

    const getCountryFill = (countryCode) => {
      if (removedCountries.has(countryCode)) return "#ccc";
      const countryData = countryDataMap[countryCode];
      return countryData ? colorScale(countryData.total) : "#87CEEB";
      // or a default
    };

    svgRef.current.selectAll("path")
      .transition(300)
      .duration(0)
      .attr("fill", d => {
        const code = String(d.id).padStart(3, "0");
        return getCountryFill(code);
      });

    setTotalEmissions(GLOBAL_CO2_TOTAL);
  };

  const renderProgressBar = () => {
    // Calculate the percentage of emissions based on the current total emissions
    const percentage = Math.max(((totalEmissions / GLOBAL_CO2_TOTAL) * 100), 0).toFixed(2);

    const width = 300;
    const height = 30;  // Adjust height for visibility

    const svg = d3.select("#progress-bar")
      .attr("width", width)
      .attr("height", height);

    // Clear previous content
    svg.selectAll("*").remove();

    // Add background for the progress bar
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#e0e0e0"); // Light gray background

    // Render the progress bar (foreground)
    svg.append("rect")
      .attr("width", (percentage / 100) * width)
      .attr("height", height)
      .attr("fill", "#FF5722")  // Bold color for the progress
      .attr("stroke", "#000")   // Black border for visibility
      .attr("stroke-width", 2); // Border width

    // Add text in the middle of the bar
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-weight", "bold")  // Make text bold for better visibility
      .text(`${percentage}%`);

    return (
      <div className="progress-container">
        <p><strong>Initial Global CO₂ Emissions:</strong> {GLOBAL_CO2_TOTAL.toLocaleString()} million metric tons</p>
        <p><strong>Current CO₂ Emissions:</strong> {totalEmissions.toLocaleString()} million metric tons</p>
        <svg id="progress-bar"></svg>
      </div>
    );
  };

  const updateEmissionsOnDeselect = (countryEmissions) => {
    setTotalEmissions((prevTotal) => {
      console.log("Previous total emissions:", prevTotal);
      console.log("Subtracting country emissions:", countryEmissions);
      return Math.max(prevTotal - countryEmissions, 0); // Ensure it doesn't go negative
    });
  };

  const updateEmissionsOnSelection = (countryEmissions) => {
    setTotalEmissions((prevTotal) => {
      console.log("Previous total emissions:", prevTotal);
      console.log("Adding country emissions:", countryEmissions);
      return prevTotal + countryEmissions;
    });
  };

  // HTML PORTION 
  return (
    <div className="page-layout">
      {/* Header */}
      <TopBar hex1="#f6e36a" hex2="#97840c" />

      {/* Main Content Area */}
      <div className="main-content">
        <BackButton pageType="air" />


        <div className="main-layout">
          {/* Map Section */}
          {/* Map Section */}
<div className="map-section">
  <div id="map" className="map-container">
    <div id="legend" className="legend"></div>
  </div>
</div>


          {/* Sidebar Section */}
          <div className="sidebar">
            {selectedCountry && viewMode === "country" && (
              <div className="info-box2">
                {/* <button className="close-btn" onClick={() => setSelectedCountry(null)}>✖</button> */}
                <h2>{selectedCountry.country}</h2>
                <p><strong>Total Emissions:</strong> {selectedCountry.total} million metric tons</p>
                <p><strong>Coal:</strong> {selectedCountry.coal}</p>
                <p><strong>Oil:</strong> {selectedCountry.oil}</p>
                <p><strong>Gas:</strong> {selectedCountry.gas}</p>
                <p><strong>Cement:</strong> {selectedCountry.cement}</p>
                <p><strong>Flaring:</strong> {selectedCountry.flaring}</p>
                <p><strong>Per Capita:</strong> {selectedCountry.per_capita}</p>
                <h2>Total CO₂ Emissions History</h2>
                <svg id="co2-graph"></svg>
              </div>
            )}


            {selectedCountry && viewMode === "map" && (
              <div className="info-box1">
                <h2>{selectedCountry.country}</h2>
                {renderProgressBar()}
              </div>
            )}

            <button onClick={handleViewToggle} className="map-buttons">
              {viewMode === "map" ? "Country Data" : "Toggle Map"}
            </button>

            <button onClick={resetMap} className="map-buttons">
              RESET MAP
            </button>

            <div className="effects-container">
              <h2 className="title">Long-Term Effects</h2>
              <div className="effects">
                <AirEffects value={totalEmissions} set={limitArr} />
              </div>
              <EffectNames value={totalEmissions} thresholds={limitArr} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );

};

export default AirDataMap;
