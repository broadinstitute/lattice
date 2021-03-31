"use strict";
import * as constants from "../utils/constants";

export default class XYEntry {
    /**
     * Represents one unit data point/entry in a Plot object
     * @param {Any} x 
     * @param {Any} y 
     * @param {Any} c - color
     * @param {Integer} r - radius; only used in scatterplot
     * @param {String} series - the group a data point belongs to
     */
    constructor(x, y, c=undefined, r=1, series) {
        this._validateInputs(x, y);
        this.x = x;
        this.y = y;
        this.c = c;
        this.r = r;
        this.series = series;
    }

    _validateInputs(x, y) {
        if (x === undefined) {
            console.error("data x value cannot be undefined");
            throw "data x value cannot be undefined";
        }

        if (y === undefined) {
            console.error("data y value cannot be undefined");
            throw "data y value cannot be undefined";
        }
    }

    /**
     * Check attribute value based on scale type
     * @param {String} scaleType enum volcabulary
     * @param {string} attr: which attribute, x or y
     */
    validateScaleType(scaleType, attr) {
        let scales = constants.scales;
        let invalid = false;
        switch(scaleType) {
        case scales.LINEAR:
        case scales.SQRT:
            invalid = isNaN(this[attr]);
            if (invalid) console.error(`non-numerial value found for ${scaleType} scale in ${attr} attribute: ${this[attr]}.`);
            break;
        case scales.TEMPORAL:
            invalid = Object.prototype.toString.call(this[attr]) != "[object Date]";
            if (invalid) console.error(`invalid date found for ${scaleType} scale in ${attr} attribute: ${this[attr]}.`);
            break;
        default:
        }
        return invalid;
    }
}

// TODO: not sure how to structure this...
// ToDo: move to a separate js file
export class HierarchyEntry {
    /**
     * Represents one unit data point/entry in a Plot
     * @param {Any} name 
     * @param {Any} value 
     * @param {Any} color - color
     * @param {Integer} label - radius; only used in scatterplot
     * @param {String} series - the group a data point belongs to
     */
    constructor(name, value, color=undefined, label=undefined, series) {
        this.name = name;
        this.value = value;
        this.color = color;
        this.label = label;
        this.series = series;
    }

    _validateInputs(x, y) {
        if (x === undefined) {
            console.error("data x value cannot be undefined");
            throw "data x value cannot be undefined";
        }

        if (y === undefined) {
            console.error("data y value cannot be undefined");
            throw "data y value cannot be undefined";
        }
    }
}