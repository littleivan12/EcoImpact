import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

function App() {
  const [data, setData] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    // Fetch Data from FastAPI (Ensure FastAPI is running)
    fetch("http://127.0.0.1:8000/some-endpoint")
      .then(response => response.json())
      .then(data => {
        setData(data);
        drawChart(data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const drawChart = (data) => {
    if (!data || data.length === 0) return;

    const svg = d3.select(chartRef.current)
      .attr("width", 500)
      .attr("height", 300);

    svg.selectAll("*").remove(); // Clear previous chart

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name)) // Modify as per data format
      .range([0, 500])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]) // Modify as per data format
      .range([300, 0]);

    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.name))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => 300 - yScale(d.value))
      .attr("fill", "steelblue");
  };

  return (
    <div>
      <h1>FastAPI + React + D3.js</h1>
      <svg ref={chartRef}></svg>
    </div>
  );
}

export default App;
