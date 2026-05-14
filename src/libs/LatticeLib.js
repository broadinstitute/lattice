import { PlotType } from "../utils/constants";
import { Plot } from "../controllers/Plot";
import { ComposePlot } from "../controllers/ComposePlot";
import { Lattice } from "../controllers/Lattice";
import * as d3 from "d3";

export const utils = {
  json: d3.json,
};

/**
 * @module LatticeLib
 * */

// Resolve a public-API root argument (id string or HTMLElement) to the
// HTMLElement that the shadow-DOM-safe constructors expect.
function resolveRoot(idOrEl) {
  if (idOrEl instanceof HTMLElement) return idOrEl;
  if (typeof idOrEl === "string") {
    const el = document.getElementById(idOrEl);
    if (!el) {
      console.error(`Element with id "${idOrEl}" not found`);
      throw `Element with id "${idOrEl}" not found`;
    }
    return el;
  }
  throw `Invalid root: expected an element id string or HTMLElement`;
}

/**
 * renders a simple plot
 * @param {Point2D[]|Object[]} data array of data points (e.g. Point2D) to use for charting.
 * @param {PlotType} type plot type, myst be a known value from PlotType
 * @param {String|HTMLElement} id root DOM element ID, or the element itself
 * @param {PlotKernel|Object} [config] plot config with any attribute from PlotKernel
 * @public
 */
export function plot(data, type, id, config = {}) {
  let myPlot = new Plot(data, type, resolveRoot(id), config);
  myPlot.render();
  return myPlot;
}

/**
 * Renders a composite plot with multiple layers on shared axes.
 * Layers must have compatible scale types.
 * @param {Array<{type: PlotType, data: Object[], color?: string, series?: Object[], tooltip?: Object, axis?: Object}>} layers
 * @param {String|HTMLElement} id root DOM element ID, or the element itself
 * @param {Object} [config] shared config (width, height, padding, axis, title, animate)
 * @returns {ComposePlot}
 * @public
 */
export function compose(layers, id, config = {}) {
  const plot = new ComposePlot(layers, resolveRoot(id), config);
  plot.render();
  return plot;
}

/**
 * renters a lattice of plots
 * @param {PlotInLattice[]|Object[]} plots a list of plot objects with required attributes in PlotInLattice
 * @param {String|HTMLElement} id root DOM element ID, or the element itself
 * @param {LatticeKernel|Object} [config] a config object with any attribute from LatticeKernel
 * @public
 */
export function lattice(plots, id, config = {}, padding = {}) {
  const lattice = new Lattice(plots, resolveRoot(id), config, padding);
  lattice.render();
  return lattice;
}

/**
 * showing all available plot types in the Lattice library
 */
export function showAvailablePlotTypes() {
  return PlotType;
}

export function getPlotOptions(plot = undefined) {
  if (plot === undefined) plot = new Plot([], "scatterplot", "foo");
  const replace = (k, v) => (v === undefined ? null : v);
  return JSON.stringify(plot.getCustomizable(), replace, 2);
}

export function getLatticeOptions(lattice = undefined) {
  if (lattice === undefined) lattice = new Lattice([], "foo", "foo");
  const replace = (k, v) => (v === undefined ? null : v);
  return JSON.stringify(lattice.getCustomizable(), replace, 2);
}

export { LatticePlot } from "../components/LatticePlot";
export { LatticeGrid } from "../components/LatticeGrid";

export { Plot, ComposePlot, Lattice };

export default class LatticeLib {}
