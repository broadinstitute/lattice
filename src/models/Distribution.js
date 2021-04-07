"use strict";
// import * as constants from "../utils/constants";

/**
 * @description Distribution class is a data model that stores data and metadata of a distribution
 */
export class Distribution {
    /**
     * @constructor
     * @param {String} label - lable of the distribution
     * @param {Number[]} data - a list of numerical values
     * @param {String} [c] - color in rgb or hexadecimal code
     * @param {String} [series] - the group a data point belongs to
     * @property {String} [foo] - testing jsdoc
     */
    constructor(label, data, color="#6bafa9", series="default") {
        this.label = this._validateInput(label);
        this.data = this._validateInput(data);
        this.color = color;
        this.series = series;
        this.foo = "foo";
    }

    /**
     * Validates a required input param
     * @param {Any} label 
     * @private
     */
    _validateInput(x) {
        if (x === undefined) {
            let message = "this param must be provided"
            console.error(message);
            throw message;
        }
        return x;
    }
}

