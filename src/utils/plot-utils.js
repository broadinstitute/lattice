import * as d3 from "d3";
import { NUMERICAL_SCALES, PlotType, ScaleType } from "./constants";

/**
 * Creates an SVG element in the given rootId and returns it.
 * @param {*} rootId
 * @param {*} width
 * @param {*} height
 */
export function createSvg(rootId, width, height) {
  const root = d3.select(`#${rootId}`);

  if (root.empty()) {
    console.error(`Element with id ${rootId} not found`);
    throw `Element with id ${rootId} not found`;
  }
  // create svg
  const svgId = `${rootId}-svg`;
  root.append("svg").attr("id", svgId).attr("width", width).attr("height", height);
  return svgId;
}

/**
 * Creates a group in the given rootId and returns it.
 * @param {String} parentId
 * @param {Object} padding
 * @param {String} tag  - id to be appended to end of the group name in the form of config.rootId-id
 */
export function createGroup(parentId, padding, tag) {
  if (parentId === undefined) {
    console.error("parentId not provided for creating new group for plot");
    throw "parentId not provided for creating new group for plot";
  }

  const parent = d3.select(`#${parentId}`);
  if (parent.empty()) {
    console.error(`Element with id ${parentId} not found`);
    throw `Element with id ${parentId} not found`;
  }
  const g = parent
    .append("g")
    .attr("id", `${parentId}-${tag}`)
    .attr("transform", `translate(${padding.left}, ${padding.top})`);
  return g;
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
 * @param {Object} opts
 * @param {string} opts.parentId - existing SVG ID (if already created)
 * @param {string} opts.rootId - DOM container ID
 * @param {number} opts.width - SVG width
 * @param {number} opts.height - SVG height
 * @param {Object} opts.padding - { top, left, right, bottom }
 * @param {string} opts.tag - group ID suffix
 * @param {string} [opts.title] - optional title text
 * @param {number} opts.innerWidth - plot inner width
 * @returns {{ g: d3.Selection, parentId: string }} the group and resolved parentId
 */
export function setupPlotGroup({ parentId, rootId, width, height, padding, tag, title, innerWidth }) {
  if (parentId === undefined) {
    parentId = createSvg(rootId, width, height);
  }
  const g = createGroup(parentId, padding, tag);
  if (title !== undefined) {
    g.append("text")
      .html(title)
      .attr("x", innerWidth / 2)
      .attr("y", -padding.top / 3)
      .attr("text-anchor", "middle");
  }
  return { g, parentId };
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
