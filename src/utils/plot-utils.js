import * as d3 from "d3";
import { NUMERICAL_SCALES, PlotType, ScaleType } from "./constants";

/**
 * Creates an SVG element inside the given root element and returns its d3 selection.
 *
 * Takes an HTMLElement (not an id string) so that mounting works inside shadow
 * roots (e.g. marimo anywidget hosts), where `document.querySelector("#id")`
 * cannot reach elements that live in a shadow DOM.
 *
 * @param {HTMLElement} rootEl - the container element to append the <svg> to
 * @param {Number} width
 * @param {Number} height
 * @returns {d3.Selection} selection wrapping the newly created <svg>
 */
export function createSvg(rootEl, width, height) {
  if (!rootEl) {
    console.error("rootEl not provided for creating new SVG");
    throw "rootEl not provided for creating new SVG";
  }
  // shadow-DOM-safe: select via element ref, not a document-scoped ID lookup
  const root = d3.select(rootEl);
  return root.append("svg").attr("width", width).attr("height", height);
}

/**
 * Creates a group inside the given parent selection and returns its d3 selection.
 *
 * @param {d3.Selection} parentSel - d3 selection of the parent svg/g element
 * @param {Object} padding - { top, left, right, bottom }
 * @param {String} tag - class/id suffix for debugging visibility (selection is
 *   the source of truth — sub-selection uses chaining, not document lookups)
 * @returns {d3.Selection} selection wrapping the newly created <g>
 */
export function createGroup(parentSel, padding, tag) {
  if (!parentSel || parentSel.empty()) {
    console.error("parentSel not provided for creating new group for plot");
    throw "parentSel not provided for creating new group for plot";
  }
  return parentSel
    .append("g")
    .attr("class", `ljs--${tag}`)
    .attr("transform", `translate(${padding.left}, ${padding.top})`);
}

export function isNumericalScale(type) {
  return NUMERICAL_SCALES.indexOf(type) != -1;
}

/**
 * Transforms data into d3 stacks for stacked plot types.
 * @param {Point2D[]} data - array of Point2D-like objects
 * @param {PlotType} type - the stacked plot type
 * @param {Array<{name: string, color: string}>} series - series definitions
 * @returns {Array} d3 stack output with series/color annotations
 */
export function createDataStack(data, type, series) {
  if (!series.length) {
    throw "'series' attribute was not provided; cannot create series data stacks";
  }
  const stackAttr = type === PlotType.STACKEDBAR ? "y" : "x";
  const valAttr = type === PlotType.STACKEDBAR ? "x" : "y";
  const seriesInData = new Set();

  const nestedData = Array.from(
    d3.group(data, (d) => d[stackAttr]),
    ([key, values]) => ({ key, values }),
  );

  const stackedData = nestedData.map((d) => {
    const entry = { [stackAttr]: d.key };
    d.values.forEach((d) => {
      seriesInData.add(d.series);
      entry[d.series] = d[valAttr];
    });
    return entry;
  });

  const stackKeys = series.map((d) => d.name);
  const invalidSeries = Array.from(seriesInData).filter((d) => !stackKeys.includes(d));
  if (invalidSeries.length) {
    throw `Unknown series found in data: ${invalidSeries.join(", ")}`;
  }

  const seriesColorMap = {};
  series.forEach((s) => (seriesColorMap[s.name] = s.color));

  return d3
    .stack()
    .keys(stackKeys)(stackedData)
    .map((d) => {
      d.forEach((v) => {
        v.series = d.key;
        v.color = seriesColorMap[v.series];
      });
      return d;
    });
}

/**
 * Creates a d3 sqrt scale for mapping radius values.
 * @param {Object[]} data - array of data objects with an `r` property
 * @returns {d3.ScalePower} radius scale
 */
export function createRadiusScale(data) {
  const radii = data.map((d) => d.r).filter((r) => r != null);
  if (radii.length === 0) {
    return d3.scaleSqrt().domain([0, 1]).range([1, 3]);
  }
  return d3.scaleSqrt().domain(d3.extent(radii)).range([1, 3]);
}

/**
 * Creates a d3 color scale (ordinal or sequential) from axis config.
 * @param {Object} axisC - the color axis config with scaleType, domain, range, interpolator
 * @returns {d3.Scale|undefined} color scale, or undefined if config is missing
 */
export function createColorScale(axisC) {
  if (!axisC || !axisC.scaleType) return undefined;
  if (axisC.scaleType === ScaleType.ORDINAL) {
    const s = d3.scaleOrdinal();
    s.unknown(undefined);
    return s.domain(axisC.domain).range(axisC.range);
  } else if (axisC.scaleType === ScaleType.SEQUENTIAL) {
    return d3.scaleSequential(axisC.interpolator).domain(axisC.domain);
  }
}

/**
 * Attaches mouseover/mouseout tooltip behavior to data DOM elements.
 * @param {d3.Selection} elements - d3 selection of rendered data elements
 * @param {Function} formatter - function that takes a datum and returns tooltip HTML
 * @param {Tooltip} tooltipObj - Tooltip instance for show/hide
 */
export function attachTooltip(elements, formatter, tooltipObj) {
  if (!elements) return;
  elements.on("mouseover", (event, d) => {
    d3.select(event.currentTarget).classed("ljs--mouseover", true);
    tooltipObj.show(formatter(d), event);
  });
  elements.on("mouseout", (event) => {
    d3.select(event.currentTarget).classed("ljs--mouseover", false);
    tooltipObj.hide();
  });
}

/**
 * Creates or selects the SVG + inner group for a plot, including optional title.
 *
 * Caller must pass either `parentSel` (an existing <svg> selection to draw into)
 * or `rootEl` (a DOM container where a new <svg> should be created).
 *
 * @param {Object} opts
 * @param {d3.Selection} [opts.parentSel] - existing SVG selection (if already created)
 * @param {HTMLElement} [opts.rootEl] - DOM container element
 * @param {number} opts.width - SVG width
 * @param {number} opts.height - SVG height
 * @param {Object} opts.padding - { top, left, right, bottom }
 * @param {string} opts.tag - group class suffix
 * @param {string} [opts.title] - optional title text
 * @param {number} opts.innerWidth - plot inner width
 * @returns {{ g: d3.Selection, parentSel: d3.Selection }} the group and resolved parent svg selection
 */
export function setupPlotGroup({ parentSel, rootEl, width, height, padding, tag, title, innerWidth }) {
  if (parentSel === undefined) {
    parentSel = createSvg(rootEl, width, height);
  }
  const g = createGroup(parentSel, padding, tag);
  if (title !== undefined) {
    g.append("text")
      .html(title)
      .attr("x", innerWidth / 2)
      .attr("y", -padding.top / 3)
      .attr("text-anchor", "middle");
  }
  return { g, parentSel };
}

/**
 * Renders reference lines (vertical, horizontal, or arbitrary two-point lines)
 * on a plot group. These are decorative annotations that don't affect the data domain.
 *
 * Supported reference types:
 * - { axis: "x", value } — vertical line spanning the y range
 * - { axis: "y", value } — horizontal line spanning the x range
 * - { points: [{x, y}, {x, y}] } — arbitrary line between two coordinates
 *
 * Each reference can also have: label, stroke, dasharray, opacity.
 *
 * @param {d3.Selection} g - the plot group to append lines to
 * @param {Array<Object>} references - array of reference definitions
 * @param {Object} scale - { x, y } d3 scales
 * @param {number} innerWidth - plot inner width
 * @param {number} innerHeight - plot inner height
 */
export function renderReferences(g, references, scale, innerWidth, innerHeight) {
  if (!references || !references.length) return;

  const refGroup = g.append("g").attr("class", "ljs--references");

  references.forEach((ref, i) => {
    const stroke = ref.stroke ?? "#999";
    const dasharray = ref.dasharray ?? "none";
    const opacity = ref.opacity ?? 1;

    let line;

    if (ref.axis === "x" && ref.value !== undefined) {
      // vertical line
      const x = scale.x(ref.value);
      line = refGroup
        .append("line")
        .attr("class", "ljs--reference-line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", innerHeight);
    } else if (ref.axis === "y" && ref.value !== undefined) {
      // horizontal line
      const y = scale.y(ref.value);
      line = refGroup
        .append("line")
        .attr("class", "ljs--reference-line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", y)
        .attr("y2", y);
    } else if (ref.points && ref.points.length === 2) {
      // line between two points
      line = refGroup
        .append("line")
        .attr("class", "ljs--reference-line")
        .attr("x1", scale.x(ref.points[0].x))
        .attr("y1", scale.y(ref.points[0].y))
        .attr("x2", scale.x(ref.points[1].x))
        .attr("y2", scale.y(ref.points[1].y));
    }

    if (line) {
      line.attr("stroke", stroke).attr("stroke-dasharray", dasharray).attr("opacity", opacity);
    }

    if (ref.label) {
      let labelX, labelY, anchor;
      if (ref.axis === "x") {
        labelX = scale.x(ref.value) + 4;
        labelY = 12;
        anchor = "start";
      } else if (ref.axis === "y") {
        labelX = innerWidth - 4;
        labelY = scale.y(ref.value) - 4;
        anchor = "end";
      } else if (ref.points) {
        // Label near the midpoint
        labelX = (scale.x(ref.points[0].x) + scale.x(ref.points[1].x)) / 2 + 4;
        labelY = (scale.y(ref.points[0].y) + scale.y(ref.points[1].y)) / 2 - 4;
        anchor = "start";
      }
      if (labelX !== undefined) {
        refGroup
          .append("text")
          .attr("class", "ljs--reference-label")
          .attr("x", labelX)
          .attr("y", labelY)
          .attr("text-anchor", anchor)
          .attr("fill", stroke)
          .text(ref.label);
      }
    }
  });
}
