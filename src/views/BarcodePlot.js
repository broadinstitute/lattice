/**
 * renders a bar plot
 * @param {D3 selection} svg 
 * @param {Entry[]} data 
 * @param {Object} scale with three attributes: x, y
 */
function render(svg, data, scale) {
  
    // add exit, enter, update
    const lines = svg.selectAll(".ljs--barcode-line")
        .data(data)
        .enter()
        .append("line")
        .attr("class", "ljs--barcode-line")
        .attr("x1", (d) => scale.x(d.x))
        .attr("x2", (d) => scale.x(d.x))
        .attr("y1", scale.y(scale.y.domain()[1]))
        .attr("y2", scale.y(scale.y.domain()[0]));
    return lines;
}

export {
    render
};
