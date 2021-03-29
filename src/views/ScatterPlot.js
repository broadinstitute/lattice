/**
 * renders a scatterplot
 * @param {D3 selection} svg 
 * @param {Entry[]} data 
 * @param {Object} scale with three attributes: x, y, r
 */
export function render(svg, data, scale) {
    // add exit, enter, update
    const circles = svg.selectAll(".ljs--scatter-dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "ljs--scatter-dot")
        .attr("cx", (d) => scale.x(d.x))
        .attr("cy", (d) => scale.y(d.y))
        .attr("r", (d) => scale.r(d.r))
        .attr("fill", (d) => d.c);
    return circles;
}

