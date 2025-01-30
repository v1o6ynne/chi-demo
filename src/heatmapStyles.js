import * as d3 from 'd3';

export const heatmapStyles = {
  margin: { top: 20, right: 20, bottom: 100, left: 150 },
  colorScheme: d3.interpolateBlues, // Change to your preferred D3 color scheme
  strokeColor: "#fff",
  strokeWidth: 1,
};

export const createColorScale = (maxValue) => 
  d3.scaleSequential(heatmapStyles.colorScheme).domain([0, maxValue]);

export const styleTooltip = (tooltip) => {
    tooltip
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.2)")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("display", "none")
      .style("z-index", "1000") // High z-index to hover over all components
      .style("pointer-events", "none") // Prevent tooltip from blocking mouse events
  };
