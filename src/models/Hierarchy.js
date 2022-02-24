// ToDo: move to a separate js file
// This class is still a WIP
/**
 * @description Hierarchy class is a data model. This is still a WIP.
 */
export class Hierarchy {
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