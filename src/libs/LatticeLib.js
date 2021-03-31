
import { plots } from "../utils/constants";
import { Plot } from "../controllers/Plot";
import { Lattice } from "../controllers/Lattice";
import * as d3 from "d3";

export const utils = {
    json: d3.json,
    nest: d3.nest
};

/**
 * rendering a simple plot 
 * @param {Array[Objects]} data - array of data points to use for charting.
 *                              attributes include:
 *                                  - {Any} x - datapoint x-value
 *                                  - {Any} y - datapoint y-value
 *                                  - {String} c - color string
 *                                  - {Number} r - datapoint radius -- only used in scatterplot
 *                                  - {String} series - series the datapoint belongs to
 * @param {String} type: plot type: controlled volcabulary
 * @param {String} id: root DOM ID
 * @param {Object} config: customized config, optional
 */
export function plot(data, type, id, config){
    let myPlot = new Plot(data, type, id, config);
    myPlot.render();
    return myPlot;
}

/**
 * renter a lattice of plots
 * @param {Object[]} plots: a list of grid objects, each grid has attributes: row, column, data, type
 * @param {String} id: root DOM ID 
 * @param {Object} config
 */
export function lattice(plots, id, config={}){
    const lattice = new Lattice(plots, id, config);
    lattice.render();
    return lattice;
}

/**
 * showing all available plot types in the Lattice library
 */
export function showAvailablePlotTypes(){
    return plots;
}

export function getPlotOptions(plot=undefined){
    if (plot===undefined) plot = new Plot([], "scatterplot", "foo");
    const replace = (k, v)=> v === undefined ? null : v;
    return JSON.stringify(plot.getCustomizable(), replace, 2);
}

export function getLatticeOptions(){
    let lattice = new Lattice([],"foo", "foo");
    const replace = (k, v)=> v === undefined ? null : v;
    return JSON.stringify(lattice.getCustomizable(), replace, 2);
}

export default class LatticeLib{}
