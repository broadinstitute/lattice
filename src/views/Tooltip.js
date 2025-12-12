import * as d3 from "d3";

export default class Tooltip {
  /**
   * Tooltip object constructor.
   * This tooltip will hold a reference to an HTML element that will serve as the tooltip.
   * @param {String} id - id for the tooltip;
   * @param {Boolean} verbose - for debugging; set to true for console logging
   * @param {Integer} offsetX - number of pixels to offset the tooltip from the mouse cursor horizontally
   * @param {Integer} offsetY - number of pixels to offset the tooltip from the mouse cursor vertically
   * @param {Integer} duration - amount of time (in milliseconds) when transitioning tooltip states
   * @param {d3 Selection} tooltip - Selection containing the tooltip HTML element
   */
  constructor(id, verbose = false, offsetX = 10, offsetY = 12, duration = 100) {
    this.id = id;
    this.verbose = verbose;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.duration = duration;
    this.tooltip = undefined;

    this._createTooltip();
  }

  /**
   * Creates a tooltip HTML div element if needed, and stores the selection in the object's tooltip attribute
   */
  _createTooltip() {
    if (d3.select(`#${this.id}`).empty()) {
      this.tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "ljs--tooltip")
        .attr("id", this.id);
    } else {
      this.tooltip = d3.select(`#${this.id}`);
    }
  }

  /**
   * Calculates new positioning for the tooltip based off the last event (mouseover) that happened.
   * If the calculated tooltip height/width will go off the screen or overlaps with the cursor location, an adjustment occurs.
   */
  _move() {
    const EDGE_ADJUSTMENT = 10;
    const body = d3.select("body").node();
    const tooltip = this.tooltip.node();
    let x = d3.event.pageX;
    let y = d3.event.pageY;

    if (this.verbose) {
      console.log(x);
      console.log(y);
    }

    x = x + this.offsetX < 0 ? EDGE_ADJUSTMENT : x + this.offsetX; // left edge of screen check
    y = y + this.offsetY < 0 ? EDGE_ADJUSTMENT : y + this.offsetY; // top edge check

    // right edge check
    if (x + tooltip.scrollWidth > body.scrollWidth) {
      const xEdgeAdjustment =
        x + tooltip.scrollWidth + EDGE_ADJUSTMENT - body.scrollWidth;
      x -= xEdgeAdjustment;
    }

    // bottom edge check
    if (y + tooltip.scrollHeight > body.scrollHeight) {
      const yEdgeAdjustment =
        y + tooltip.scrollHeight + EDGE_ADJUSTMENT - body.scrollHeight;
      y -= yEdgeAdjustment;
    }

    // mouse event + tooltip display collision check
    if (
      x <= d3.event.pageX &&
      d3.event.pageX <= x + tooltip.scrollWidth &&
      y <= d3.event.pageY &&
      d3.event.pageY <= y + tooltip.scrollHeight
    ) {
      x = d3.event.pageX - tooltip.scrollWidth - EDGE_ADJUSTMENT;
    }

    this.tooltip.style("left", `${x}px`).style("top", `${y}px`);
  }

  show(info) {
    if (this.verbose) console.log(info);
    this.tooltip.html(info);
    this._move();
    this.tooltip
      .style("display", "inline")
      .transition()
      .duration(this.duration)
      .style("opacity", 1.0);
  }

  hide() {
    this.tooltip.transition().duration(this.duration).style("opacity", 0.0);
    this.tooltip.html("");
  }
}
