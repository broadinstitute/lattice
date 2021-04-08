"use strict";
// import * as constants from "../utils/constants";

/**
 * @description Distribution class is a data model that stores data and metadata of a distribution
 */
export class Distribution {
    /**
     * @constructor
     * @param {String} x - text label of the distribution
     * @param {Number[]} y - a list of numerical values
     * @param {String} [c] - color in rgb or hexadecimal code
     * @param {String} [series] - the group this distribution belongs to
     */
    constructor(x, y, color="#6bafa9", series="default") {
        this.x = this._validateInput(label);
        this.y = this._validateInput(data);
        this.c = c;
        this.series = series;
    }

    /**
     * Validates a required input param
     * @param {Any} d
     * @private
     */
    _validateInput(d) {
        if (d === undefined) {
            let message = "this param must be provided"
            console.error(message);
            throw message;
        }
        return d;
    }
}

