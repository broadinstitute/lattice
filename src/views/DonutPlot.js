import * as plotUtils from "../utils/plot-utils";
import * as d3 from "d3";

/**
 * Draws a donut plot
 * @param {Object} config - plot configuration object. See Config.js for more information
 * Expected fields:
 *   - data: array of rows
 *   - categoryAccessor (optional): function(d) -> category string
 *   - valueAccessor (optional): function(d) -> numeric value
 *   - innerRadiusRatio (optional): 0–1, default 0.6
 *   - showLabels (optional): boolean
 *   - colorScale (optional): d3 scale; defaults to ordinal
 *   - title (optional): string
 */
function render(config) {
  const plotIdentifier = "donutplot";

  let svg;
  if (config.parentId) {
    svg = plotUtils.createGroup(
      config.parentId,
      config.padding,
      plotIdentifier
    );
  } else {
    const svgId = plotUtils.createSvg(
      config.rootId,
      config.width,
      config.height
    );
    svg = d3.select(`#${svgId}`);
  }

  // Inner drawing area (Lattice already computes these for other plots)
  const innerWidth =
    config.innerWidth ??
    config.width - (config.padding.left + config.padding.right);
  const innerHeight =
    config.innerHeight ??
    config.height - (config.padding.top + config.padding.bottom);

  const radius = Math.min(innerWidth, innerHeight) / 2;
  const innerRadiusRatio = config.innerRadiusRatio ?? 0.6;
  const innerRadius = radius * innerRadiusRatio;

  const centerX = config.padding.left + innerWidth / 2;
  const centerY = config.padding.top + innerHeight / 2;

  const g = svg
    .append("g")
    .attr("class", "ljs--donutplot-root")
    .attr("transform", `translate(${centerX},${centerY})`);

  const categoryAccessor = config.categoryAccessor || ((d) => d.category);
  const valueAccessor = config.valueAccessor || ((d) => d.value);
  const data = config.data || [];

  // Categories + colors
  const categories = Array.from(new Set(data.map(categoryAccessor)));
  const colorScale =
    config.colorScale || d3.scaleOrdinal(categories, d3.schemeTableau10);

  // Pie + arcs
  const pie = d3
    .pie()
    .sort(null)
    .value((d) => +valueAccessor(d));

  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .padAngle(config.padAngle ?? 0.01)
    .cornerRadius(config.cornerRadius ?? 2);

  const arcsData = pie(data);

  // Visible slices
  const slices = g
    .selectAll(".ljs--donutplot-slice")
    .data(arcsData)
    .enter()
    .append("path")
    .attr("class", "ljs--donutplot-slice")
    .attr("d", arc)
    .attr("fill", (d) => colorScale(categoryAccessor(d.data)));

  // Optional labels
  if (config.showLabels) {
    const labelArc = d3
      .arc()
      .innerRadius((innerRadius + radius) / 2)
      .outerRadius((innerRadius + radius) / 2);

    const formatValue = config.valueFormatter || d3.format(".1f");

    g.selectAll(".ljs--donutplot-label")
      .data(arcsData)
      .enter()
      .append("text")
      .attr("class", "ljs--donutplot-label")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text((d) => {
        const cat = categoryAccessor(d.data);
        const val = valueAccessor(d.data);
        return `${cat} (${formatValue(val)})`;
      });
  }

  // Optional title (mirrors lineplot pattern)
  if (config.title) {
    svg
      .append("text")
      .attr("class", "donutplot-title")
      .attr("x", config.innerWidth / 2)
      .attr("y", -config.padding.top / 3)
      .attr("text-anchor", "middle")
      .text(config.title);
  }

  // Hit targets for interactivity (similar role as ljs--lineplot-rect)
  const hitArcs = g
    .selectAll(".ljs--donutplot-hit")
    .data(arcsData)
    .enter()
    .append("path")
    .attr("class", "ljs--donutplot-hit")
    .attr("d", arc)
    .attr("fill", "none")
    .style("pointer-events", "all");

  // Callers can attach mouse/touch events to hitArcs
  return hitArcs;
}

export { render };
