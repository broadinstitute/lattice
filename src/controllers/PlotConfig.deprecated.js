import * as d3 from "d3";
import { axisTypes, defaultAxisOrientation, defaultScales, NUMERICAL_SCALES, orientations, PLOT_DEFAULT_PADDING, plots, scales, sortDirections, tooltipFormatters } from "../utils/constants";
import { createScale } from "../utils/plot-utils";
import { XYEntry, HierarchyEntry } from "../models/Entry";
import Axis from "../models/Axis";
import { createPlotConfig } from "../configs/plotConfig";

export class PlotConfig {
    /**
     * Constructor for PlotConfig
     * @param {Object[]} data - array of data objects to render
     * @param {String} type - specifies the plot type; should be one of the enums listed in the plots var.
     * @param {String} rootId - div that the SVG should be created in
     * @param {Object} input - config inputs
    */
    constructor(data, type, rootId, input) {
       

        // these attributes will be populated in a private function if needed by plot type
    
        // this.dataSeriesStack = undefined;
        // this._createSeriesStacks();
        // this._createPlotScales();
    }

    // _createSeriesStacks() {
    //     switch (this.type) {
    //     case plots.STACKEDBAR: {
    //         if (!this.series.length) {
    //             console.error("'series' attribute was not provided; cannot create series data stacks");
    //             throw "'series' attribute was not provided; cannot create series data stacks";
    //         }
    //         const seriesInData = new Set();
    //         // grouping data by y-value
    //         const nestedData = d3.nest()
    //             .key(d => d.y)
    //             .entries(this.data);
    //         // creating single object for each stack we want to create
    //         // attributes in each obj: y, every series that exists for that stack
    //         const stackedData = nestedData.map(d => {
    //             const entry = { y: d.key };
    //             d.values.forEach(d => {
    //                 seriesInData.add(d.series);
    //                 entry[d.series] = d.x;
    //             });
    //             return entry;
    //         });
    //         const stackKeys = this.series.map(d => d.name);
    //         const stackFn = d3.stack()
    //             .keys(stackKeys);
    //         this._validateSeries(seriesInData, stackKeys);
    //         // creates a 2D array; each array corresponds to one series
    //         // element in the inner array corresponds to the part of the stack for a particular series and y value
    //         this.dataSeriesStack = stackFn(stackedData).map(d => (d.forEach(v => v.series = d.key), d));
    //         break;
    //     }
    //     case plots.STACKEDCOLUMN: {
    //         if (!this.series.length) {
    //             console.error("'series' attribute was not provided; cannot create series data stacks");
    //             throw "'series' attribute was not provided; cannot create series data stacks";
    //         }
    //         const seriesInData = new Set(); // for error checking
    //         const nestedData = d3.nest()
    //             .key(d => d.x)
    //             .entries(this.data);
    //         const stackedData = nestedData.map(d => {
    //             const entry = { x: d.key };
    //             d.values.forEach(d => {
    //                 seriesInData.add(d.series);
    //                 entry[d.series] = d.y;
    //             });
    //             return entry;
    //         });
    //         const stackKeys = this.series.map(d => d.name);
    //         const stackFn = d3.stack()
    //             .keys(stackKeys);
    //         this._validateSeries(seriesInData, stackKeys);
    //         this.dataSeriesStack = stackFn(stackedData).map(d => (d.forEach(v => v.series = d.key), d));
    //         break;
    //     }
    //     default:
    //         return;
    //     }
    // }

    /**
     * PRIVATE FUNCTION
     Modifies the PlotConfig object to create scales required for each plot type
    */
    _createPlotScales() {
        this._validateScaleData(this.xAxis.scaleType, "x");
        this._validateScaleData(this.yAxis.scaleType, "y");
        const xMin = this.xAxis.min === undefined ? d3.min(this.data.map(d => d.x)) : this.xAxis.min;
        const xMax = this.xAxis.max === undefined ? d3.max(this.data.map(d => d.x)) : this.xAxis.max;
        const xDomain = [xMin, xMax];
        const yMin = this.yAxis.min === undefined ? d3.min(this.data.map(d => d.y)) : this.yAxis.min;
        const yMax = this.yAxis.max === undefined ? d3.max(this.data.map(d => d.y)) : this.yAxis.max;
        const yDomain = [yMin, yMax];

        switch(this.type) {
        case plots.BARCODEPLOT:
            this.xScale = createScale(this.xAxis.scaleType, xDomain, [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, [0, 1], [0, this.innerHeight], {padding: this.yAxis.padding});
            break;
        case plots.AREAPLOT:
            this.xScale = createScale(this.xAxis.scaleType, xDomain, [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, yDomain, [this.innerHeight, 0], {padding: this.yAxis.padding});
            break;
        case plots.BARPLOT:
            this.xScale = createScale(this.xAxis.scaleType, xDomain, [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, this.data.map(d => d.y), [0, this.innerHeight], {padding: this.yAxis.padding});
            break;
        case plots.CATEGORICAL_HEATMAP:
            this.xScale = createScale(this.xAxis.scaleType, this.data.map(d => d.x), [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, this.data.map(d => d.y), [0, this.innerHeight], {padding: this.yAxis.padding});
            this.cScale = createScale(this.cAxis.scaleType, this.cAxis.domain, this.cAxis.range);
            break;
        case plots.COLUMNPLOT:
            this.xScale = createScale(this.xAxis.scaleType, this.data.map(d => d.x), [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, yDomain, [this.innerHeight, 0], {padding: this.yAxis.padding});
            break;
        case plots.HEATMAP:
            this.xScale = createScale(this.xAxis.scaleType, this.data.map(d => d.x), [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, this.data.map(d => d.y), [0, this.innerHeight], {padding: this.yAxis.padding});
            this.cScale = createScale(this.cAxis.scaleType, this.cAxis.domain, this.cAxis.range, {interpolator: this.cAxis.interpolator});
            break;
        case plots.LINEPLOT:
            this.xScale = createScale(this.xAxis.scaleType, xDomain, [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, yDomain, [this.innerHeight, 0], {padding: this.yAxis.padding});
            break;
        case plots.SCATTERPLOT:
            this.xScale = createScale(this.xAxis.scaleType, xDomain, [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, yDomain, [this.innerHeight, 0], {padding: this.yAxis.padding});
            this.rScale = createScale("sqrt", d3.extent(this.data.map(d => d.r)), [1, 3]);
            break;
        case plots.STACKEDBAR: {
            const range = this.orientation.POSITIVE ? [0, this.innerWidth] : [this.innerWidth, 0];
            this.xScale = createScale(this.xAxis.scaleType, [0, d3.max(this.dataSeriesStack, d=>d3.max(d, d => d[1]))], range, {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, this.data.map(d => d.y), [0, this.innerHeight], {padding: this.yAxis.padding});
            break;
        }
        case plots.STACKEDCOLUMN:
            this.xScale = createScale(this.xAxis.scaleType, this.data.map(d => d.x), [0, this.innerWidth], {padding: this.xAxis.padding});
            this.yScale = createScale(this.yAxis.scaleType, [0, d3.max(this.dataSeriesStack, d=>d3.max(d, d => d[1]))], [this.innerHeight, 0], {padding: this.yAxis.padding});
            break;
        default:
            console.error("unknown plot type");
        }
    }

    /**
     * Checks that required inputs are provided. Throws an error if that isn't the case.
     * @param {Array} inputData 
     * @param {String} inputType 
     * @param {String} inputRootId 
     */
    _validateInputs(inputData, inputType, inputRootId) {
        if (inputData === undefined) {
            console.error("No data provided.");
            throw "No data provided.";
        }

        if (inputType === undefined) {
            console.error("Plot type required.");
            throw "Plot type required.";
        }

        if (inputRootId === undefined) {
            console.error("rootId cannot be undefined.");
            throw "rootId cannot be undefined.";
        }

        if (!Object.values(plots).includes(inputType)) {
            console.error(`Unrecognized plot type ${inputType}`);
            throw `Unrecognized plot type ${inputType}`;
        }
    }

    /**
     * Checks that all series assigned to individual data entries is defined in the user provided "series" list.
     * @param {Set} dataSeriesSet - a set of all unique series found within the data
     * @param {Array} inputSeriesKey - list of series' names (from the PlotConfig.series object)
     */
    _validateSeries(dataSeriesSet, inputSeriesKey) {
        const seriesCheck = Array.from(dataSeriesSet).filter(d => !inputSeriesKey.includes(d));
        if (seriesCheck.length) {
            console.error(`Unknown series found in data: ${seriesCheck.join(", ")}`);
            throw `Unknown series found in data: ${seriesCheck.join(", ")}`;
        }
    }

    /**
     * Checks that the data found in an attribute works for a particular scale type
     * @param {String} type - scale type; should be a value of the scales enum
     * @param {String} attr - attribute to check in PlotConfig.data e.g. x, y
     */
    _validateScaleData(type, attr) {
        let filter;
        switch(type) {
        case scales.LINEAR:
        case scales.SQRT:
            filter = this.data.filter(d => typeof(d[attr]) != "number");
            if (filter.length) {
                console.error(`non-numerial value found for ${scales.LINEAR} scale in ${attr} attribute`);
                throw `non-numerial value found for ${scales.LINEAR} scale in in ${attr} attribute`;
            }
            break;
        case scales.TEMPORAL:
            filter = this.data.filter(d => Object.prototype.toString.call(d[attr]) != "[object Date]");
            if (filter.length) {
                console.error(`invalid date found for ${scales.TEMPORAL} scale in ${attr} attribute`);
                throw `invalid date found for ${scales.TEMPORAL} scale in in ${attr} attribute`;
            }
            break;
        default:
        }
    }

    _getScaleType(axis) {
        if (axis == axisTypes.X) return this.xAxis.scaleType;
        else if (axis == axisTypes.Y) return this.yAxis.scaleType;
    }

    _getAxisScale(axis) {
        if (axis == axisTypes.X) return this.xScale;
        else if (axis == axisTypes.Y) return this.yScale;
    }

    sortAxis(axis, sortDir) {
        const validateAxis = () => {
            if (!Object.values(axisTypes).includes(axis)) {
                throw `Invalid axis ${axis} specified for sorting. Valid options: ${Object.values(axisTypes).join(", ")}`;
            }
        };
        const validateSortDir = () => {
            if (!Object.values(sortDirections).includes(sortDir)) {
                throw `Invalid ${sortDir} provided for sorting. Valid options: ${Object.values(sortDirections).join(", ")}`;
            }
        };

        validateAxis();
        validateSortDir();

        const axisScaleType = this._getScaleType(axis);
        const axisScale = this._getAxisScale(axis);
        const axisUpdateConfig = { order: undefined, min: undefined, max: undefined };
        const domain = axisScale.domain();
        domain.sort((a, b) => {
            if (sortDir == sortDirections.ASC) {
                if (a < b) return -1;
                else if (a == b) return 0;
                else return 1;
            }
            if (sortDir == sortDirections.DESC) {
                if (b < a) return -1;
                else if (a == b) return 0;
                else return 1;
            }
        });
        if (NUMERICAL_SCALES.includes(axisScaleType)) {
            axisUpdateConfig.min = domain[0];
            axisUpdateConfig.max = domain[1];
        } else {
            axisUpdateConfig.order = domain;
        }
        this.updateAxis(axis, axisUpdateConfig);
    }

    /**
     * Provides users a way of updating an axis.
     * @param {String} axis - specifies the axis to update; should be one of the enums listed in the axisTypes var.
     * @param {Array} order - used for categorical scales; specifies the new domain
     * @param {Number} min - used for numerical scales; specifies a new min
     * @param {Number} max - used for numerical scales; specifies a new max
     */
    updateAxis(axis, { order=undefined, min=undefined, max=undefined } = {}) {
        let validateAxisUpdate = () => {
            if (!Object.values(axisTypes).includes(axis)) throw `Invalid axis type ${axis}. Cannot be updated.`;
            if (order === undefined && min === undefined && max === undefined) throw "No updates were provided";
            if (order && min && max) throw "Use `order` attribute OR `min` and `max` to set the new axis domain";
    
            const axisScaleType = axis == axisTypes.X ? this.xAxis.scaleType : this.yAxis.scaleType;
            if (NUMERICAL_SCALES.includes(axisScaleType) && min === undefined && max === undefined) throw "Numerical scales should be updated using 'min' and 'max' attributes";
            if (!NUMERICAL_SCALES.includes(axisScaleType) && order === undefined) throw "Use 'order' attribute to update data order";
        };

        let getNewDomain = () => {
            const axisScaleType = this._getScaleType(axis);
            if (!NUMERICAL_SCALES.includes(axisScaleType)) {
                return order;
            } else {
                const currDomain = axisScale.domain();
                const newDomain = [min || currDomain[0], max || currDomain[1]];
                return newDomain;
            }
        };

        validateAxisUpdate(axis, order, min, max);

        const axisScale = this._getAxisScale(axis);
        const newDomain = getNewDomain();
        axisScale.domain(newDomain);
    }

    /**
     * Provides users a way of adding/removing data. Is called by the Plot controller.
     * @param {Array} data - array of data points to use for charting. Should contain all data user wants to display
     */
    updateData(data) {
        this.data = data.map(d => {
            return new XYEntry(d.x, d.y, d.c, d.r, d.series); 
        });
        this._createSeriesStacks();
        this._createPlotScales();
    }
}
