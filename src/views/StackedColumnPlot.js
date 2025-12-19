import * as plotUtils from "../utils/plot-utils";
import * as d3 from "d3";

export function render(svg, data, scale) {
  const transitionDuration = 1000;

  const seriesGroups = svg
    .selectAll(".ljs--stacked-series")
    .data(data)
    .join(
      (enter) => enter.append("g").attr("class", "ljs--stacked-series"),
      (update) => update.attr("class", "ljs--stacked-series"),
      (exit) => exit.remove()
    );

  const rects = seriesGroups
    .selectAll(".ljs--stacked-series-rect")
    .data((d) => d)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "ljs--stacked-series-rect")
          .attr("x", (d) => scale.x(d.data.x))
          .attr("y", (d) => scale.y(d[1]))
          .attr("height", (d) => scale.y(d[0]) - scale.y(d[1]))
          .attr("width", scale.x.bandwidth())
          .attr("fill", (d) => d.color),

      (update) =>
        update
          .transition()
          .duration(transitionDuration)
          .attr("x", (d) => scale.x(d.data.x))
          .attr("y", (d) => scale.y(d[1]))
          .attr("height", (d) => scale.y(d[0]) - scale.y(d[1]))
          .attr("width", scale.x.bandwidth())
          .attr("fill", (d) => colorMap[d.series]),

      (exit) =>
        exit
          .transition()
          .duration(transitionDuration)
          .attr("opacity", 0)
          .remove()
    );

  return rects;
}
