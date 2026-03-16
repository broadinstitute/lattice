import * as plotUtils from "../utils/plot-utils";
import * as d3 from "d3";

/**
 * Generates an angular wedge-shaped petal path.
 * The petal radiates from the center as a wedge, so its pixel width
 * scales naturally with distance — no overlap near the center.
 * @param {number} position - The radial distance (length) of the petal
 * @param {number} halfAngle - Half the angular span of the petal (radians)
 * @returns {string} SVG path string
 */
function petalPath(position, halfAngle) {
  // Outer edge points at ±halfAngle from the petal axis (+y)
  const outerX = position * Math.sin(halfAngle);
  const outerY = position * Math.cos(halfAngle);

  // Arc radius sized to the angular width for a smooth curved cap
  const arcRadius = position;

  return `
    M ${outerX},${outerY}
    L 0,0
    L ${-outerX},${outerY}
    A ${arcRadius},${arcRadius} 0 0,0 ${outerX},${outerY}
  `;
}

/**
 * Draws a petal plot - a radial chart where each petal radiates from the center.
 * Based on the legacy metmap petal plot style.
 *
 * @param {Object} config - plot configuration object
 * Expected fields:
 *   - data: array of data points
 *   - rootId: DOM element id to render into (if no parentId)
 *   - parentId: parent SVG group id (for embedding in Lattice)
 *   - width: total width of the SVG
 *   - height: total height of the SVG
 *   - padding: { top, right, bottom, left }
 *   - valueAccessor (optional): function(d) -> main value for petal position (e.g., mean)
 *   - widthAccessor (optional): function(d) -> petal width value (e.g., penetrance 0-1)
 *   - colorAccessor (optional): function(d) -> color string
 *   - labelAccessor (optional): function(d) -> label string
 *   - valueDomain (optional): [min, max] domain for value scale (default: auto from data)
 *   - gridlineValues (optional): array of values to show gridlines at (e.g., [-2, 0, 2])
 *   - showGridlineLabels (optional): boolean to show labels on gridlines
 *   - title (optional): chart title
 */
function render(config) {
  const plotIdentifier = "petalplot";

  let svg;
  if (config.parentId) {
    svg = plotUtils.createGroup(
      config.parentId,
      config.padding,
      plotIdentifier,
    );
  } else {
    const svgId = plotUtils.createSvg(
      config.rootId,
      config.width,
      config.height,
    );
    svg = d3.select(`#${svgId}`);
  }

  // Inner drawing area dimensions
  const innerWidth =
    config.innerWidth ??
    config.width - (config.padding.left + config.padding.right);
  const innerHeight =
    config.innerHeight ??
    config.height - (config.padding.top + config.padding.bottom);

  const radius = Math.min(innerWidth, innerHeight) / 2;

  // Calculate center position
  const centerX = config.padding.left + innerWidth / 2;
  const centerY = config.padding.top + innerHeight / 2;

  // Create centered group for the plot
  const g = svg
    .append("g")
    .attr("class", "ljs--petalplot-root")
    .attr("transform", `translate(${centerX},${centerY})`);

  // Data and accessors
  const data = config.data || [];
  const valueAccessor =
    config.valueAccessor || ((d) => d.value ?? d.length ?? 0);
  const widthAccessor = config.widthAccessor || ((d) => d.width ?? 0.5);
  const colorAccessor = config.colorAccessor || ((d) => d.color);
  const labelAccessor = config.labelAccessor || ((d) => d.label ?? "");

  // Value scale (maps data values to pixel radius)
  const valueDomain = config.valueDomain || d3.extent(data, valueAccessor);
  const showLabels = config.showLabels ?? true;
  const radiusMargin = config.radiusMargin ?? (showLabels ? 20 : 2);
  const valueScale = d3
    .scaleLinear()
    .domain(valueDomain)
    .range([0, radius - radiusMargin]);

  // Calculate angles for each petal
  const numPetals = data.length;
  const startAngle = 90; // Default: first petal at top
  const angleStep = 360 / numPetals;
  const angularSlice = (2 * Math.PI) / numPetals;

  // Width scale: maps width values (0-1) to half-angle in radians.
  // width=1 fills 70% of the angular slot; width=0 is a thin sliver.
  const maxHalfAngle = config.maxHalfAngle ?? angularSlice * 0.35;
  const minHalfAngle = config.minHalfAngle ?? angularSlice * 0.025;
  const widthScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([minHalfAngle, maxHalfAngle]);

  // Draw circular gridlines
  const gridlineValues =
    config.gridlineValues ?? d3.ticks(valueDomain[0], valueDomain[1], 3);
  const showGridlineLabels = config.showGridlineLabels ?? true;

  const gridGroups = g
    .selectAll(".ljs--petalplot-gridline-group")
    .data(gridlineValues)
    .enter()
    .append("g")
    .attr("class", "ljs--petalplot-gridline-group");

  gridGroups
    .append("circle")
    .attr("class", "ljs--petalplot-gridline")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => valueScale(d))
    .style("fill", "none")
    .style("stroke", "#D6D6D6")
    .style("stroke-width", 0.5);

  // Gridline labels
  if (showGridlineLabels) {
    const labelAngle = 180; // Default to south
    gridGroups
      .append("text")
      .attr("class", "ljs--petalplot-gridline-label")
      .attr(
        "transform",
        (d) =>
          `rotate(${labelAngle}) translate(0, ${-valueScale(d) - 5}) rotate(${-labelAngle})`,
      )
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d);
  }

  // Create petal groups
  const petals = g
    .selectAll(".ljs--petalplot-petal-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "ljs--petalplot-petal-group")
    .attr("transform", (d, i) => {
      const angle = startAngle + i * angleStep;
      return `rotate(${angle + 90})`; // +90 because petal extends along +y
    });

  // Draw petals
  const fillOpacity = config.fillOpacity ?? 0.5;
  petals
    .append("path")
    .attr("class", "ljs--petalplot-petal")
    .attr("d", (d) => {
      const position = valueScale(valueAccessor(d));
      const halfAngle = widthScale(widthAccessor(d));
      return petalPath(position, halfAngle);
    })
    .attr("fill", (d) => colorAccessor(d))
    .attr("fill-opacity", fillOpacity)
    .attr("stroke", (d) => colorAccessor(d))
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 1);

  // Axis labels at outer edge
  if (showLabels) {
    // Position labels at the maximum value radius plus offset
    const maxValueRadius = valueScale(valueDomain[1]);
    const labelOffset = config.labelOffset ?? 15;
    const labelRadius = maxValueRadius + labelOffset;

    g.selectAll(".ljs--petalplot-axis-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "ljs--petalplot-axis-label")
      .attr("x", (d, i) => {
        // Match the petal rotation angle
        // Petal rotates by (startAngle + i * angleStep + 90) degrees
        const rotationDeg = startAngle + i * angleStep + 90;
        const rotationRad = (rotationDeg * Math.PI) / 180;
        // In SVG, after rotate(R), +y direction points at (sin(R), cos(R))
        return labelRadius * Math.sin(rotationRad);
      })
      .attr("y", (d, i) => {
        const rotationDeg = startAngle + i * angleStep + 90;
        const rotationRad = (rotationDeg * Math.PI) / 180;
        return labelRadius * Math.cos(rotationRad);
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => labelAccessor(d));
  }

  // Optional title
  if (config.title) {
    svg
      .append("text")
      .attr("class", "ljs--petalplot-title")
      .attr("x", centerX)
      .attr("y", config.padding.top / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(config.title);
  }

  return {
    svg,
    petals,
    scales: {
      value: valueScale,
      width: widthScale,
    },
  };
}

export { render, petalPath };
