/**
 * renders a bar plot
 * @param {D3} svg
 * @param {Entry[]} data
 * @param {Object} scale with three attributes: x, y
 */
function render(svg, data, scale) {
  const transitionDuration = 1000;

  const rects = svg
    .selectAll(".ljs--bar")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "ljs--bar")
          .attr("x", 0)
          .attr("y", (d) => scale.y(d.y))
          .attr("height", scale.y.bandwidth())
          .attr("fill", (d) => d.c)
          .call((enter) =>
            enter
              .transition()
              .duration(transitionDuration)
              .attr("width", (d) => scale.x(d.x))
              .attr("opacity", 1)
          ),

      (update) =>
        update
          .transition()
          .duration(transitionDuration)
          .attr("width", (d) => scale.x(d.x))
          .attr("y", (d) => scale.y(d.y))
          .attr("height", scale.y.bandwidth()),

      (exit) =>
        exit
          .transition()
          .duration(transitionDuration)
          .attr("opacity", 0)
          .remove()
    );
  return rects;
}

export { render };
