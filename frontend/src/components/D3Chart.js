import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3Chart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = [25, 40, 60, 80, 100];

    const width = 400;
    const height = 200;
    const barWidth = 40;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f4f4f4")
      .style("overflow", "visible");

    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d))
      .attr("fill", "teal");
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default D3Chart;
