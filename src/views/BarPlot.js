import * as d3 from "d3";
import { orientations } from "../utils/constants";

/**
 * renders a bar plot
 * @param {D3} svg
 * @param {Entry[]} data
 * @param {Object} scale with three attributes: x, y
 * @param {String} orientation plot orientation (positive or negative)
 * @param {Object} config optional configuration object
 * @param {Boolean} config.showLabels whether to display value labels
 * @param {Function} config.valueFormatter function to format label values (default: d3.format(".1f"))
 */
function render(svg, data, scale, orientation, config = {}) {
  const transitionDuration = 1000;

  const rects = svg
    .selectAll(".ljs--bar")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "ljs--bar")
          .attr("x", orientation == orientations.POSITIVE ? 0 : scale.x(0))
          .attr("y", (d) => scale.y(d.y))
          .attr("height", scale.y.bandwidth())
          .attr("fill", (d) => d.c)
          .call((enter) =>
            enter
              .transition()
              .duration(transitionDuration)
              .attr(
                "x",
                orientation == orientations.POSITIVE ? 0 : (d) => scale.x(d.x),
              )
              .attr("width", (d) =>
                orientation == orientations.POSITIVE
                  ? scale.x(d.x)
                  : scale.x(0) - scale.x(d.x),
              )
              .attr("opacity", 1),
          ),

      (update) =>
        update
          .transition()
          .duration(transitionDuration)
          .attr(
            "x",
            orientation == orientations.POSITIVE ? 0 : (d) => scale.x(d.x),
          )
          .attr("width", (d) =>
            orientation == orientations.POSITIVE
              ? scale.x(d.x)
              : scale.x(0) - scale.x(d.x),
          )
          .attr("y", (d) => scale.y(d.y))
          .attr("height", scale.y.bandwidth()),

      (exit) =>
        exit
          .transition()
          .duration(transitionDuration)
          .attr("opacity", 0)
          .remove(),
    );

  // Optional value labels
  const showLabels = config?.showLabels || config?._userInput?.showLabels;
  const valueFormatter =
    config?.valueFormatter || config?._userInput?.valueFormatter;

  if (showLabels) {
    const formatValue = valueFormatter || d3.format(".1f");
    const labelPadding = 4;

    svg
      .selectAll(".ljs--bar-label")
      .data(data)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("class", "ljs--bar-label")
            .attr("x", (d) =>
              orientation == orientations.POSITIVE
                ? scale.x(d.x) + labelPadding
                : scale.x(d.x) - labelPadding,
            )
            .attr("y", (d) => scale.y(d.y) + scale.y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr(
              "text-anchor",
              orientation == orientations.POSITIVE ? "start" : "end",
            )
            .attr("opacity", 0)
            .text((d) => formatValue(d.x))
            .call((enter) =>
              enter
                .transition()
                .delay(transitionDuration)
                .duration(300)
                .attr("opacity", 1),
            ),

        (update) =>
          update
            .transition()
            .duration(transitionDuration)
            .attr("x", (d) =>
              orientation == orientations.POSITIVE
                ? scale.x(d.x) + labelPadding
                : scale.x(d.x) - labelPadding,
            )
            .attr("y", (d) => scale.y(d.y) + scale.y.bandwidth() / 2)
            .text((d) => formatValue(d.x)),

        (exit) => exit.transition().duration(300).attr("opacity", 0).remove(),
      );
  }

  return rects;
}

export { render };
