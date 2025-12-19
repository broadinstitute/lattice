import * as plotUtils from "../utils/plot-utils";
import * as d3 from "d3";

function render(svg, data, scale) {
  const transitionDuration = 1000;

  const cells = svg
    .selectAll(".ljs--heatmap-cell")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "ljs--heatmap-cell")
          .attr("x", (d) => scale.x(d.x))
          .attr("y", (d) => scale.y(d.y))
          .attr("width", scale.x.bandwidth())
          .attr("height", scale.y.bandwidth())
          .attr("fill", (d) => scale.c(d.c)),

      (update) =>
        update
          .transition()
          .duration(transitionDuration)
          .attr("x", (d) => scale.x(d.x))
          .attr("y", (d) => scale.y(d.y))
          .attr("width", scale.x.bandwidth())
          .attr("height", scale.y.bandwidth())
          .attr("fill", (d) => scale.c(d.c)),

      (exit) =>
        exit
          .transition()
          .duration(transitionDuration)
          .attr("opacity", 0)
          .remove()
    );

  return cells;
}

export { render };
