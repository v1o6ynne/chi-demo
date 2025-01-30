import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";

const TestBackend = () => {
  const [chartData, setChartData] = useState([]); // Store processed D3 data
  const chartRef = useRef(null); // Reference to the SVG container

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/data")
      .then(response => {
        // Transform API data into an array of objects
        const formattedData = response.data.labels.map((label, i) => ({
          label,
          value: response.data.values[i],
        }));
        setChartData(formattedData);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (chartData.length === 0) return;

    // Set dimensions
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Select the SVG and clear previous renders
    d3.select(chartRef.current).selectAll("*").remove();

    // Create an SVG container
    const svg = d3.select(chartRef.current)
      .attr("width", width)
      .attr("height", height);

    // Define scales
    const x = d3.scaleBand()
      .domain(chartData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add bars
    svg.selectAll("rect")
      .data(chartData)
      .enter().append("rect")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.value))
      .attr("fill", "steelblue");

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

  }, [chartData]); // Run when chartData changes

  return (
    <div>
      <h2>Data Visualization (D3.js)</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default TestBackend;