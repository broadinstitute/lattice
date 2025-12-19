import { orientations } from "../utils/constants";

export function render(svg, data, scale, orientation) {
  const seriesGroups = svg
    .selectAll(".ljs--stacked-series")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "ljs--stacked-series");

  const x =
    orientation == orientations.POSITIVE
      ? (d) => scale.x(d[0])
      : (d) => scale.x(d[1]);
  const width =
    orientation == orientations.POSITIVE
      ? (d) =>
          !isNaN(d[0]) && !isNaN(d[1]) ? scale.x(d[1]) - scale.x(d[0]) : 0
      : (d) =>
          !isNaN(d[0]) && !isNaN(d[1]) ? scale.x(d[0]) - scale.x(d[1]) : 0;

  const rects = seriesGroups
    .selectAll(".ljs--stacked-series-rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("class", "ljs--stacked-series-rect")
    .attr("x", x)
    .attr("y", (d) => scale.y(d.data.y))
    .attr("width", width)
    .attr("height", scale.y.bandwidth())
    .attr("fill", (d) => d.color);

  return rects;
}
