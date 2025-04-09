import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as topojson from "topojson-client";
import * as d3 from "d3";
import "../../styles/MapPage.css"; // Assuming we are adding custom styles
import _ from 'lodash';
const AirDataMap = () => {
  // State Management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [co2History, setCo2History] = useState([]);
  const [totalEmissions, setTotalEmissions] = useState(37123.850352);
  const [viewMode, setViewMode] = useState("map"); // "map" or "country"
  const [removedCountries, setRemovedCountries] = useState(new Set());
  
  const svgRef = useRef(null);
  const countryDataMapRef = useRef({});
  const colorScaleRef = useRef();

  const GLOBAL_CO2_TOTAL = 37123.850352; // Fixed world total CO₂ emissions

  // Line Graph for Country Data Rendering Function
  function renderGraph(data) {
    const width = 500, height = 300, margin = { top: 30, right: 30, bottom: 30, left: 50 };


    const svg = d3.select("#co2-graph")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)])
        .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.selectAll("*").remove(); // Clear previous content

    // Append x-axis and y-axis to the graph
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

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
            .scale(300)
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
  
          // Fill color function
          const getCountryFill = (countryCode) => {
           // Ensure it's padded
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
            .on("mouseover", function () {
              d3.select(this).transition().duration(200).attr("stroke-width", 1.5);
            })
            .on("mouseout", function () {
              d3.select(this).transition().duration(200).attr("stroke-width", 0.5);
            })
            .on("click", (event, d) => {
              const countryCode = String(d.id).padStart(3, "0");
              const countryData = countryDataMap[countryCode];
            
              if (viewMode === "country") {
                // ✅ Just show data, do NOT modify map interaction
                setSelectedCountry(countryData || { country: "Unknown", total: 0 });
            
                if (countryData) {
                  fetch(`http://127.0.0.1:8000/air_super/${countryCode}/past_five_years`)
                    .then((response) => response.json())
                    .then((history) => {
                      const lastFiveYears = history.map((d) => ({
                        Year: d.Year,
                        total: d.total,
                      }));
                      setCo2History(lastFiveYears);
                      renderGraph(lastFiveYears);
                    });
                }
            
                // Optional: add a visual indication
                d3.selectAll("path").attr("stroke-width", 0.5); // reset highlight
                d3.select(event.currentTarget)
                  .transition()
                  .duration(300)
                  .attr("stroke-width", 2);
            
                return; // exit early!
              }
            
              // 🔁 Map interaction mode
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
                      Year: d.Year,
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
    return countryData ? colorScale(countryData.total) : "#d4aa00"; // or a default
  };

  svgRef.current.selectAll("path")
    .transition()
    .duration(300)
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
    <div className="container">
      <h1 className="title">CO₂ Emissions Map</h1>

      <button onClick={handleViewToggle}>
        {viewMode === "map" ? "Country Data" : "Toggle Map"}
      </button>

      <button onClick={resetMap}>
        RESET MAP
      </button>

      {/*  View */}
<div id="map" className={viewMode === "map" ? "map-container" : "map-container" }></div>
{/* Country View */}
{selectedCountry && viewMode === "country" && (
  <div className="info-box">
  <button className="close-btn" onClick={() => setSelectedCountry(null)}>✖</button>
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
        <div className="info-box2">
          <h2>{selectedCountry.country}</h2>
          {/* Emissions Bar in Country View */}
          {viewMode === "map" && renderProgressBar()}
        </div>
      )}
    </div>
  );
};

export default AirDataMap;
