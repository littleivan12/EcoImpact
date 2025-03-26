import React, { useEffect, useState } from "react";
import * as topojson from "topojson-client";
import * as d3 from "d3";

const AirDataMap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [co2History, setCo2History] = useState([]);
  const [totalEmissions, setTotalEmissions] = useState(0); // Store total emissions

  const renderGraph = (data) => {
  const svg = d3.select("#graph").html("").append("svg")
    .attr("width", 500)
    .attr("height", 300);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([50, 450])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total)])
    .range([250, 50]);

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.total))
    .attr("width", xScale.bandwidth())
    .attr("height", d => 250 - yScale(d.total))
    .attr("fill", "steelblue");
};


  useEffect(() => {
    console.time("dataFetch");

    fetch("http://127.0.0.1:8000/air_super/")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        console.timeEnd("dataFetch");

        // Compute total CO₂ emissions for the last 5 years
        const currentYear = new Date().getFullYear();
        const lastFiveYears = data.filter(d => d.year >= currentYear - 5);

        const totalEmissionsSum = lastFiveYears.reduce((sum, entry) => sum + (entry.total || 0), 0);
        
        setTotalEmissions(totalEmissionsSum);
        setCo2History(lastFiveYears);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.timeEnd("dataFetch");
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
  
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((world) => {
        const width = 1000;
        const height = 600;
  
        const projection = d3.geoNaturalEarth1()
          .scale(250)
          .translate([width / 2, height / 2]);
  
        const pathGenerator = d3.geoPath().projection(projection);
  
        d3.select("#map").selectAll("*").remove();
  
        const svg = d3.select("#map")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("background-color", "#87CEEB");
  
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
  
        const colorScale = d3.scaleSequential(d3.interpolateYlGn)
          .domain([0, d3.max(data, d => d.total || 1)]);
  
        svg.append("g")
          .selectAll("path")
          .data(topojson.feature(world, world.objects.countries).features)
          .enter()
          .append("path")
          .attr("d", pathGenerator)
          .attr("fill", d => {
            const countryCode = String(d.id).padStart(3, "0");
            const countryData = countryDataMap[countryCode];
            return countryData ? colorScale(countryData.total) : "#d4aa00";
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
            setSelectedCountry(countryData || { country: "Unknown", total: 0 });
            
            if (countryData) {
              fetch(`http://127.0.0.1:8000/air_super/past_five_years/${countryCode}`)
                .then((response) => response.json())
                .then((history) => {
                  const lastFiveYears = history.filter(d => d.year >= new Date().getFullYear() - 5);
                  setCo2History(lastFiveYears);
                  renderGraph(lastFiveYears);
                });
            }
          });
      })
      .catch(error => console.error("Error loading world map:", error));
  }, [data]);

  return (
    <div>
      <h1>CO₂ Emissions Map</h1>
      <div id="map"></div>

      {loading && <p>Loading data...</p>}

      {selectedCountry && (
        <div className="info-box">
          <h2>{selectedCountry.country}</h2>
          <p>Total Emissions: {selectedCountry.total} million metric tons</p>
          <p>Coal: {selectedCountry.coal}</p>
          <p>Oil: {selectedCountry.oil}</p>
          <p>Gas: {selectedCountry.gas}</p>
          <p>Cement: {selectedCountry.cement}</p>
          <p>Flaring: {selectedCountry.flaring}</p>
          <p>Per Capita: {selectedCountry.per_capita}</p>
        </div>
      )}

      <div id="graph"></div>

      <div className="summary-box">
        <h2>Total CO₂ Emissions (Last 5 Years)</h2>
        <p>{totalEmissions.toLocaleString()} million metric tons</p>
      </div>
    </div>
  );
};

export default AirDataMap;
