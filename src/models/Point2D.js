"use strict";
import * as constants from "../utils/constants";

/**
 * @description Point2D class is a data model that stores data and metadata of a 2D data point.
 */
export class Point2D {
    /**
     * Represents one unit data point/entry in a Plot object
     * @param {Any} x 
     * @param {Any} y 
     * @param {Any} c - color
     * @param {Integer} r - radius; only used in scatterplot
     * @param {String} series - the group this data point belongs to
     * @constructor
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
     * @public
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
