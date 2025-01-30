import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { interpolateRdBu } from "d3-scale-chromatic";
import { barchartStyles, createXScale, createYScale, styleTooltip } from './barchartStyles';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const BarChart = ({ data, height }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update container width dynamically
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!data || data.length === 0 || containerWidth === 0) return;

    // Clear existing content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = barchartStyles.margin;
    const width = containerWidth; // Use dynamic container width
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = createXScale(data.map((d) => d.filename), innerWidth);

    const yMin = d3.min(data, (d) => d.mean);
    const yMax = d3.max(data, (d) => d.mean);
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

    const colorScale = d3.scaleSequential(interpolateRdBu)  // Or another scheme
    .domain([yMin, yMax]); // Maps values from min to max

    // Append group to SVG
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create a tooltip element
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip");
    styleTooltip(tooltip);

    // Draw bars
    g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.filename))
    .attr("y", (d) => (d.mean >= 0 ? yScale(d.mean) : yScale(0)))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => Math.abs(yScale(d.mean) - yScale(0)))
    .attr("fill", (d) => colorScale(d.mean))  // Dynamic color from D3 scale
    .on("mouseover", (event, d) => {
      d3.select(event.currentTarget).attr("fill", d3.color(colorScale(d.mean)).darker(0.5));

      const imagePath = `/murty185_images/${d.filename}`;

      tooltip
        .html(
          `<div>
            <p><strong>Filename:</strong> ${d.filename}</p>
            <p><strong>Mean:</strong> ${d.mean.toFixed(4)}</p>
            <p><strong>SEM:</strong> ${d.sem.toFixed(4)}</p>
            <img src="${imagePath}" alt="Thumbnail" 
            style="width: 80px; height: 80px; object-fit: cover; margin-bottom: 5px; border: 1px solid #ccc;">
          </div>`
        )
        .style("display", "block");
    })
    .on("mousemove", event => {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 40}px`);
    })
    .on("mouseout", (event, d) => {
      d3.select(event.currentTarget).attr("fill", colorScale(d.mean));
      tooltip.style("display", "none");
    });

    // Add axes
    // g.append("g")
    //   .attr("transform", `translate(0, ${innerHeight})`)
    //   .call(d3.axisBottom(xScale))
    //   .selectAll("text")
    //   .style("text-anchor", "end")
    //   .attr("dx", "-0.5em")
    //   .attr("dy", "0.15em")
    //   .attr("transform", "rotate(-90)")

    g.append("g").call(d3.axisLeft(yScale));
  }, [data, containerWidth, height]);

  // Fullscreen toggle function
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!isFullscreen) {
      container.requestFullscreen().then(() => {
        container.style.backgroundColor = 'white';
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        container.style.backgroundColor = 'transparent';
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'center',
        width: isFullscreen ? '100%' : 'auto', // Adjust to full width in fullscreen mode
        height,
        backgroundColor: isFullscreen ? 'white' : 'transparent',
      }}
    >
      <div className="mode-bar" style={{ position: 'absolute', top: 5, right: 1 }}>
        <button
          onClick={toggleFullscreen}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {isFullscreen ? <FullscreenExitIcon sx={{ color: 'grey' }} /> : <FullscreenIcon sx={{ color: 'grey' }} />}
        </button>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
