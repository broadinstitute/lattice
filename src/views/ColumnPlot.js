/**
 * renders a column plot
 * @param {D3} svg
 * @param {Entry[]} data
 * @param {Object} scale with three attributes: x, y
 */
export function render(svg, data, scale) {
  const rects = svg
    .selectAll(".ljs--column")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "ljs--column")
    .attr("x", (d) => scale.x(d.x))
    .attr("y", (d) => scale.y(d.y))
    .attr("width", scale.x.bandwidth())
    .attr("height", (d) => scale.y(scale.y.domain()[0]) - scale.y(d.y))
    .attr("fill", (d) => d.c);

  return rects;
}
