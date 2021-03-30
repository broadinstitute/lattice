import "../css/LinePlot.css"
import * as plotUtils from "../utils/plot-utils";
import * as d3 from "d3";

/**
 * Draws a line plot
 * @param {Object} config - plot configuration object. See Config.js for more information
 */
function render(config) {
    const plotIdentifier = "lineplot";
    let svg, xAxis, yAxis, xLabel, yLabel;
    if (config.parentId) {
        svg = plotUtils.createGroup(config, plotIdentifier);
    } else {
        svg = plotUtils.createSvg(config, plotIdentifier);
    }

    const lineStart = d3.line()
        .defined(d => !isNaN(d.y))
        .x(d => config.xScale(d.x))
        .y(d => config.yScale(config.yScale.domain()[0]));

    const line = d3.line()
        .defined(d => !isNaN(d.y))
        .x(d => config.xScale(d.x))
        .y(d => config.yScale(d.y));

    // add exit, enter, update
    const data = svg.append("path")
        .datum(config.data)
        .attr("class", "ljs--lineplot-path")
        .attr("d", lineStart)
        .transition().duration(500)
        .attr("d", line);


    // for interactivity purposes
    const lines = svg.selectAll(".ljs--lineplot-rect")
        .data(config.data)
        .enter()
        .append("rect")
        .attr("class", "ljs--lineplot-rect")
        .attr("x", (d) => config.xScale(d.x))
        .attr("y", (d) => config.yScale(d.y))
        .attr("width", 1)
        .attr("height", (d) => config.yScale(config.yScale.domain()[0]) - config.yScale(d.y))
        .attr("fill", "none")
        .style("pointer-events", "all");

    config.xAxis.render(svg, config);
    config.yAxis.render(svg, config);
    const plotLabel = config.title ? svg.append("text").attr("class", "lineplot-title").html(config.title).attr("x", config.innerWidth/2).attr("y", -config.padding.top/3).attr("text-anchor", "middle") : undefined;

    return lines;
}

export {
    render
};
