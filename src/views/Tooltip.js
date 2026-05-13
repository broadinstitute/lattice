import * as d3 from "d3";

export default class Tooltip {
  /**
   * Tooltip object constructor.
   * Creates a fresh tooltip <div> appended to document.body and caches the
   * d3 selection. Tooltips live at the document level (not inside the chart)
   * so they can use page coordinates and escape any parent overflow.
   *
   * Shadow-DOM-safe: the cached selection wraps the element we just created,
   * so we never need a document.querySelector("#id") lookup to find it later.
   *
   * @param {Boolean} verbose - for debugging; set to true for console logging
   * @param {Integer} offsetX - number of pixels to offset the tooltip from the mouse cursor horizontally
   * @param {Integer} offsetY - number of pixels to offset the tooltip from the mouse cursor vertically
   * @param {Integer} duration - amount of time (in milliseconds) when transitioning tooltip states
   */
  constructor(verbose = false, offsetX = 10, offsetY = 12, duration = 100) {
    this.verbose = verbose;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.duration = duration;

    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "ljs--tooltip");
  }

  /**
   * Calculates new positioning for the tooltip based off the last event (mouseover) that happened.
   * If the calculated tooltip height/width will go off the screen or overlaps with the cursor location, an adjustment occurs.
   */
  _move(event) {
    const EDGE_ADJUSTMENT = 10;
    const body = d3.select("body").node();
    const tooltip = this.tooltip.node();
    let x = event.pageX;
    let y = event.pageY;

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
      x <= event.pageX &&
      event.pageX <= x + tooltip.scrollWidth &&
      y <= event.pageY &&
      event.pageY <= y + tooltip.scrollHeight
    ) {
      x = event.pageX - tooltip.scrollWidth - EDGE_ADJUSTMENT;
    }

    this.tooltip.style("left", `${x}px`).style("top", `${y}px`);
  }

  show(info, event) {
    if (this.verbose) console.log(info);
    this.tooltip.html(info);
    this._move(event);
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
