import * as d3 from "d3";

/**
 * Draws a line plot
 */
function render(svg, data, scale) {
  const transitionDuration = 500;

  const lineStart = d3
    .line()
    .defined((d) => !isNaN(d.y))
    .x((d) => scale.x(d.x))
    .y((d) => scale.y(scale.y.domain()[0]));

  const line = d3
    .line()
    .defined((d) => !isNaN(d.y))
    .x((d) => scale.x(d.x))
    .y((d) => scale.y(d.y));

  svg
    .append("path")
    .datum(data)
    .attr("class", "ljs--lineplot-path")
    .attr("d", lineStart)
    .transition()
    .duration(transitionDuration)
    .attr("d", line);

  const rects = svg
    .selectAll(".ljs--lineplot-rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "ljs--lineplot-rect")
    .attr("x", (d) => scale.x(d.x))
    .attr("y", (d) => scale.y(d.y))
    .attr("width", 1)
    .attr("height", (d) => scale.y(scale.y.domain()[0]) - scale.y(d.y))
    .attr("fill", "none")
    .style("pointer-events", "all");

  return rects;
}

export { render };
