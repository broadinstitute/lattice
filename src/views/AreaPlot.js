import * as d3 from "d3";

/**
 * Draws an area plot
 * Things to note:
 * - Order of data input for this plot type matters, since it affects the area calculation.
 *   Data should be sorted along whatever axis is important
 * - SVG rects are drawn and transparent on top of the area curve for interactivity purposes
 * @param {Object} config - plot configuration object. See Config.js for more information
 */
function render(svg, data, scale) {
    const areaStart = d3.area()
        .curve(d3.curveLinear)
        .defined(d => !isNaN(d.y))
        .x(d => scale.x(d.x))
        .y1(d => scale.y(scale.y.domain()[0]))
        .y0(scale.y(scale.y.domain()[0]));

    const area = d3.area()
        .curve(d3.curveLinear)
        .defined(d => !isNaN(d.y))
        .x(d => scale.x(d.x))
        .y1(d => scale.y(d.y))
        .y0(scale.y(scale.y.domain()[0]));

    // add exit, enter, update
    const dataLine = svg.append("path")
        .datum(data)
        .attr("class", "ljs--areaplot-path")
        .attr("d", areaStart)
        .transition().duration(500)
        .attr("d", area);

    // for interactivity purposes
    const lines = svg.selectAll(".ljs--areaplot-rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", ".ljs--areaplot-rect")
        .attr("x", (d) => scale.x(d.x))
        .attr("y", (d) => scale.y(d.y))
        .attr("width", 1)
        .attr("height", (d) => scale.y(scale.y.domain()[0]) - scale.y(d.y))
        .attr("fill", "none")
        .style("pointer-events", "all");

    // TODO: areakit creates a path for the actual plot, and lines for interactivity purposes.
    // is it important to return both?
    // TODO: is there a better way to specify color for area plot?
    return lines;
}

export {
    render
};
