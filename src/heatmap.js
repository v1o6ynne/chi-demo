import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { heatmapStyles, createColorScale, styleTooltip } from './heatmapStyles';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const Heatmap = ({ data, width, height }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [order, setOrder] = useState("name");

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);

    const margin = heatmapStyles.margin;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Fix 2: Adjust color scale to ensure proper value mapping
    const colorScale = d3.scaleSequential(d3.interpolatePlasma)
      .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);

    // Extract unique image names and clusters
    const imageNames = Array.from(new Set(data.map(d => d.x))).sort();
    const clusters = Array.from(new Set(data.map(d => d.cluster))).sort();

    // Fix 1: Reduce padding in scaleBand to prevent gaps causing black artifacts
    const xScale = d3.scaleBand().range([0, innerWidth]).padding(0);
    const yScale = d3.scaleBand().range([0, innerHeight]).padding(0);

    // Precompute orders
    const nameOrder = imageNames;
    const groupOrder = clusters.flatMap(cluster =>
      imageNames.filter(image => data.find(d => d.x === image && d.cluster === cluster))
    );

    const orders = { name: nameOrder, group: groupOrder };

    // Update scales based on the current order
    const currentOrder = orders[order] || nameOrder;
    xScale.domain(currentOrder);
    yScale.domain(currentOrder);

    // Fix 3: Adjust SVG size to prevent clipping
    svg.attr("width", Math.max(width, 500))
       .attr("height", Math.max(height, 500));

    // Clear and redraw the SVG
    svg.selectAll("*").remove();
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create a tooltip element
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip");
    styleTooltip(tooltip);

    // Draw heatmap rectangles
    const rects = g.selectAll("rect")
      .data(data, d => `${d.x}-${d.y}`) // Key function for updates
      .join(
        enter =>
          enter
            .append("rect")
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y))
            .attr("width", Math.min(xScale.bandwidth(), yScale.bandwidth()))
            .attr("height", Math.min(xScale.bandwidth(), yScale.bandwidth()))
            .attr("fill", d => colorScale(d.value))
            .on("mouseover", (event, d) => {
              const imagePath1 = `/murty185_images/${d.x}`;
              const imagePath2 = `/murty185_images/${d.y}`;
              const cellColor = colorScale(d.value);
            
              let imageHtml = d.x === d.y 
                ? `<img src="${imagePath1}" alt="Thumbnail" style="width: 50px; height: 50px; margin-top: 5px;" onerror="this.style.display='none'">`
                : `<img src="${imagePath1}" alt="Thumbnail" style="width: 50px; height: 50px; margin-top: 5px;" onerror="this.style.display='none'">
                   <img src="${imagePath2}" alt="Thumbnail" style="width: 50px; height: 50px; margin-left: 5px;" onerror="this.style.display='none'">`;
            
              tooltip
                .html(
                  `<div>
                    <p><strong>x:</strong> ${d.x}</p>
                    <p><strong>y:</strong> ${d.y}</p>
                    <p><strong>euclidean distance:</strong> ${d.value.toFixed(4)}<span style="display: inline-block; width: 10px; height: 10px; background-color: ${cellColor}; border-radius: 50%; margin-left: 5px;"></span></p>
                    ${imageHtml}
                  </div>`
                )
                .style("display", "block");
            })
            .on("mousemove", event => {
              tooltip
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 40}px`);
            })
            .on("mouseout", () => {
              tooltip.style("display", "none");
            }),
        update =>
          update.call(update =>
            update
              .transition()
              .duration(750)
              .attr("x", d => xScale(d.x))
              .attr("y", d => yScale(d.y))
              .attr("fill", d => colorScale(d.value))
          ),
        exit => exit.remove()
      );

    // Add axes
    // const xAxis = g
    //   .append("g")
    //   .attr("transform", `translate(0, ${innerHeight})`)
    //   .call(d3.axisBottom(xScale));

    // xAxis.selectAll("text")
    //   .style("text-anchor", "end")
    //   .attr("dx", "-0.5em")
    //   .attr("dy", "0.15em")
    //   .attr("transform", "rotate(-90)");

    // const yAxis = g.append("g").call(d3.axisLeft(yScale));

    // Fix 4: Force re-render when toggling fullscreen to properly scale the heatmap
    if (isFullscreen) {
      setTimeout(() => {
        setOrder(prev => prev === "name" ? "group" : "name");
        setOrder(prev => prev === "group" ? "name" : "group");
      }, 100);
    }

    //xAxis.transition().duration(750).call(d3.axisBottom(xScale));
    //yAxis.transition().duration(750).call(d3.axisLeft(yScale));
  }, [data, width, height, order, isFullscreen]);

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

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width, height, backgroundColor: isFullscreen ? 'white' : 'transparent' }}
    >
      <div className="controls" style={{ position: 'absolute', top: 10, left: 10 }}>
        <label htmlFor="order">Order by: </label>
        <select id="order" value={order} onChange={handleOrderChange}>
          <option value="name">Name</option>
          <option value="group">Group</option>
        </select>
      </div>
      <div className="mode-bar" style={{ position: 'absolute', top: 5, right: 1 }}>
        <button onClick={toggleFullscreen} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
          {isFullscreen ? <FullscreenExitIcon sx={{ color: 'grey' }} /> : <FullscreenIcon sx={{ color: 'grey' }} />}
        </button>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Heatmap;
