import { PlotType } from "../utils/constants";
import { Plot } from "../controllers/Plot";
import { Lattice } from "../controllers/Lattice";
import * as d3 from "d3";

export const utils = {
  json: d3.json,
};

/**
 * @module LatticeLib
 * */

/**
 * renders a simple plot
 * @param {Point2D[]|Object[]} data array of data points (e.g. Point2D) to use for charting.
 * @param {PlotType} type plot type, myst be a known value from PlotType
 * @param {String} id root DOM (e.g a div) ID for the plot
 * @param {PlotKernel|Object} [config] plot config with any attribute from PlotKernel
 * @public
 */
export function plot(data, type, id, config = {}) {
  let myPlot = new Plot(data, type, id, config);
  myPlot.render();
  return myPlot;
}

/**
 * renters a lattice of plots
 * @param {PlotInLattice[]|Object[]} plots a list of plot objects with required attributes in PlotInLattice
 * @param {String} id root DOM ID
 * @param {LatticeKernel|Object} [config] a config object with any attribute from LatticeKernel
 * @public
 */
export function lattice(plots, id, config = {}, padding = {}) {
  const lattice = new Lattice(plots, id, config, padding);
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

export { Plot, Lattice };

export default class LatticeLib {}
