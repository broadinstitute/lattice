import * as d3 from "d3";
import * as plotUtils from "../utils/plot-utils";
import {PlotType, PlotOrientation, tooltipFormatters, defaultScales, defaultAxisOrientation, ScaleType, plotRenderFunction} from "../utils/constants"; // Note: constants are too generic, let's review what's in the script and organize the code better
import Tooltip  from "../views/Tooltip";
import {Point2D}  from "../models/Point2D";
import {Axis}  from "../views/Axis";

const stackedPlotTypes = [PlotType.STACKEDBAR, PlotType.STACKEDCOLUMN];
const PLOT_DEFAULT_PADDING = 50; // don't find where this is used

class PlotKernel {
    /**
     * @constructor
     * @property {String} parentId parent SVG ID
     * @property {Number} width 
     * @property {Number} height
     * @property {PlotOrientation} orientation 
     * @property {String} title plot title
     * @property {PlotPadding} padding plot padding object
     * @property {PlotAxis} axis axis object
     * @property {PlotTooltip} tooltip plot tooltip object
     * @property {String[]} series not sure what this does
     */
    constructor(){
        // initiate default values for the following properties 
        this.parentId = undefined;
        
        this.width = 300;
        this.height = 300;

        this.orientation = PlotOrientation.POSITIVE;
        this.title = undefined;

        /** @typedef PlotPadding */
        let PlotPadding = {top: PLOT_DEFAULT_PADDING, left: PLOT_DEFAULT_PADDING, bottom: PLOT_DEFAULT_PADDING, right: PLOT_DEFAULT_PADDING};
        this.padding = PlotPadding;

        /** @typedef PlotAxis */
        let PlotAxis = {
            x: {
                title: "x axis", 
                orientation: "bottom", // top, bottom, left, right
            },
            y: {
                title: "y axis", 
                orientation: "left", // top, bottom, left, right
            },
            c: {
                scaleType: undefined, // enum: ordinal, sequential. todo: add divergent
                domain: ["TODO: how to best customize the color scale"], // values to be mapped to a color; can be an array of [min, max] if using sequential scale; all values should be listed for ordinal scale
                range: ["TBA"], // colors to map the domain to; required for (and only used by) ordinal scale type
                interpolator: undefined // required for (and only used by) sequential scale type
            }
        };
        this.axis = PlotAxis;
        
        /** @typedef PlotTooltip */
        let PlotTooltip = {
            enabled: true, 
            id: undefined,
            formatter:undefined // formatter - Function that takes a single argument (single datum for a particular plot) to generate HTML for tooltip
        };
        this.tooltip = PlotTooltip;
        
        this.series = [];
    }
}
/**
 * @description Plot class for creating a generic 2D plot object
 * @augments PlotKernel
 */
export class Plot extends PlotKernel {
    /**
     * Constructor for Plot
     * @param {Point2D[]|Distribution[]|Object[]} data array of appropriate data objects (e.g. Point2D, Distribution) to use for charting
     * @param {PlotType} type the plot type; should be one from enum PlotType
     * @param {String} rootId div that the SVG should be created in
     * @param {PlotKernel|Object} [userInput] custom config (i.e. any attribute in PlotKernel)
    * @constructor
    */
    constructor(data, type, rootId, userInput={}) {
        super();
        this.customizableProp = Object.keys(this);

        this._validateInputs(data, type, rootId);
        this._userInput = userInput;

        /** @property {Point2D[]} data */
        this.data = data.map(d => {
            return new Point2D(d.x, d.y, d.c, d.r, d.series); 
        });

        /** @property {PlotType} type */
        this.type = type;
        this.rootId = rootId; // question: why do we allow users to provide rootId and parentId?
        this.hasRendered = false; 
        this.axisInternal = {}; // do we still need this?
        this._changeSettings(userInput);
        
        // additional computed properties
        this.innerWidth = this.width - this.padding.left - this.padding.right;
        this.innerHeight = this.height - this.padding.top - this.padding.bottom;
        this.tooltipObj = new Tooltip(this.tooltip.id); // get rid of this extra attribute

        if (stackedPlotTypes.includes(this.type)) {
            this.dataStack = this.createDataStack();
        }
        this.scale = this.setScales();
    }

    /**
     * @description reports what properties of the Plot object are customizable
     * @public
     */
    getCustomizable(){
        let config = {};
        this.customizableProp.forEach((prop)=>{
            if ("axis"==prop) {
                config.axis = {};
                Object.keys(this.axis).forEach((d)=>{
                    if (d=='x'||d=='y'){
                        config.axis[d] = this.axisInternal[d].getCustomizable();
                    } else {
                        config.axis[d] = this.axis[d];
                    }
                })
            }
            else {config[prop] = this[prop];}
        });
        return config;
    }

    /**
     * @description changes plot settings based on user input and plot type
     * @param {Object} userInput: available input options are defined in plotConfig.js
     * @private
     */
    _changeSettings(userInput){
        let plot = this;
  
        // go through each customizable property
        plot.customizableProp.forEach((prop)=>{            
            switch(prop){// updating config values based on user input
            case "padding":
                // if (userInput.padding!==undefined) update(prop);
                if (userInput.padding!==undefined) plot.padding = Object.assign({}, plot.padding, userInput.padding); // merge with userInput.padding

                break;
            case "tooltip":
                // set tooltip config based on plot properties
                plot.tooltip.formatter = tooltipFormatters[plot.type];
                plot.tooltip.id = `${plot.rootId}-tooltip`;
                // update based on user input
                if (userInput.tooltip!==undefined) plot.tooltip = Object.assign({}, plot.tooltip, userInput.tooltip);
                break;
            case "axis":
                Object.keys(plot.axis).forEach((which)=>{
                    let axis = plot.axis[which];
                    if (["x", "y"].includes(which)){
                        // set scale type and axis orientation based on plot type and axis
                        
                        axis.scaleType = defaultScales[plot.type][which];
                        
                        axis.orientation = defaultAxisOrientation[plot.type][which][plot.orientation];

                        // update axis settings based on user input
                        if (userInput.axis!==undefined && userInput.axis[which] !== undefined) {
                            axis = Object.assign({}, axis, userInput.axis[which]);
                        }
                
                        // then finally creates an Axis object and assign it to plot.axisInternal[which] 
                        plot.axisInternal[which] = new Axis(which, axis);
                    } else if (which == "c") {
                        axis.scaleType = defaultScales[this.type].c;
                        if (userInput.axis!==undefined && userInput.axis.c !== undefined) {
                            axis = Object.assign({}, axis, userInput.axis.c);
                            plot.axisInternal[which] = axis;
                        }
                    }                  
                });
                break;
            default:
                // simple update when the value of a plot property is a simple scalar
                if (userInput[prop]!==undefined) plot[prop] = userInput[prop];
            }
        });   
    }

    /**
     * @description Transforms user input data into data stacks for plot types that require it.
     * Also takes series color information (by name) and stores it with the data.
     * Transformed data is stored in a separate class variable, "dataStack".
     * @private
     */
    createDataStack() {
        /**
         * Checks that all series assigned to individual data entries is defined in the user provided "series" list.
         * @param {Set} dataSeriesSet - a set of all unique series found within the data
         * @param {Array} inputSeriesKey - list of series' names (from user input)
         */
        const validateSeries = (dataSeriesSet, inputSeriesKey) => {
            const seriesCheck = Array.from(dataSeriesSet).filter(d => !inputSeriesKey.includes(d));
            if (seriesCheck.length) {
                throw `Unknown series found in data: ${seriesCheck.join(", ")}`;
            }
        };

        // error checking
        if (!this.series.length) {
            throw "'series' attribute was not provided; cannot create series data stacks";
        }
        const stackAttr = this.type == PlotType.STACKEDBAR ? "y" : "x";
        const valAttr = this.type == PlotType.STACKEDBAR ? "x" : "y";
        const seriesInData = new Set(); // for error checking purposes

        // grouping data on dimension we're creating stacks for
        const nestedData = d3.nest()
            .key(d => d[stackAttr])
            .entries(this.data);

        // creating single object for each stack we want to create
        // attributes in each obj: y, every series that exists for that stack
        const stackedData = nestedData.map(d => {
            const entry = { [stackAttr]: d.key };
            d.values.forEach(d => {
                seriesInData.add(d.series);
                entry[d.series] = d[valAttr];
            });
            return entry;
        });
        const stackKeys = this.series.map(d => d.name);
        validateSeries(seriesInData, stackKeys);
        const seriesColorMap = {};
        this.series.forEach(s => seriesColorMap[s.name] = s.color);

        const stackFn = d3.stack().keys(stackKeys);
        // creates a 2D array; each array corresponds to one series
        // element in the inner array corresponds to the part of the stack for a particular series and its value
        const dataStack = stackFn(stackedData).map(d => {
            d.forEach(v => {
                v.series = d.key;
                v.color = seriesColorMap[v.series];
            });
            return d;
        });
        return dataStack;
    }

    /**
     * @description sets plot scales
     * @returns {Object} a scale object with attributes: x, y, r, c
     * @private 
     */
    setScales() {
        // first, validate data based on x and y scale types
        let invalidData = this.data.filter((d)=>{
            return d.validateScaleType(this.axisInternal.x.scaleType, "x") || 
            d.validateScaleType(this.axisInternal.y.scaleType, "y");
        });
        if (invalidData.length > 0) throw "Fatal Error: Not all data are valid"; // todo: is this what we want the program to behave?

        // initiate values to xDomain, xRange, yDomain, and yRange
        const setDomain = (data, attr)=>{
            let domain = d3.extent(data.map((d)=>d[attr]));
            return domain;
        };
        let xDomain = setDomain(this.data, "x");
        let xRange = [0, this.innerWidth];
        let yDomain = setDomain(this.data, "y");
        let yRange = [this.innerHeight, 0];
        
        // adjust domain or range based on plot type and scale type
        const type = PlotType;
        switch(this.type) {
        case type.AREAPLOT:
        case type.LINEPLOT:
        case type.SCATTERPLOT:
            // no further changes needed
            break;
        case type.BARCODEPLOT:
            yDomain = [0, 1];
            break;
        case type.BARPLOT:
            yDomain = this.data.map(d => d.y);
            yRange = [0, this.innerHeight];
            break;
        case type.CATEGORICAL_HEATMAP:
        case type.HEATMAP:
            xDomain = this.data.map(d => d.x);
            yDomain = this.data.map(d => d.y);
            yRange = [0, this.innerHeight];
            break;
        case type.COLUMNPLOT:
            xDomain = this.data.map(d => d.x);
            break;
        case type.STACKEDBAR: 
            xDomain = [0, d3.max(this.dataStack, d=>d3.max(d, d => d[1]))];
            xRange = this.orientation == PlotOrientation.POSITIVE ? xRange : [this.innerWidth, 0];
            yDomain = this.data.map(d => d.y);
            yRange = [0, this.innerHeight];
            break;
        case type.STACKEDCOLUMN:
            xDomain = this.data.map(d => d.x);
            yDomain = [0, d3.max(this.dataStack, d=>d3.max(d, d => d[1]))];
            break;
        default:
            console.error("unknown plot type");
        }
        const createRadiusScale = ()=>{
            return d3.scaleSqrt().domain(d3.extent(this.data.map(d => d.r))).range([1, 3]); // todo: how to handle these axes better?
        };
        const createColorScale = ()=>{
            if (this.axisInternal.c.scaleType == ScaleType.ORDINAL) {
                let s = d3.scaleOrdinal();
                s.unknown(undefined);
                return s.domain(this.axisInternal.c.domain).range(this.axisInternal.c.range);
            }
            else if (this.axisInternal.c.scaleType == ScaleType.SEQUENTIAL) {
                let s = d3.scaleSequential(this.axisInternal.c.interpolator);
                return s.domain(this.axisInternal.c.domain);
            }
        };
        return {
            x: this.axisInternal.x.createScale(xDomain, xRange),
            y: this.axisInternal.y.createScale(yDomain, yRange),
            r: createRadiusScale(),
            c: this.axisInternal.c===undefined?undefined:createColorScale()
        };
    }

    /**
     * @description rendering function
     * @param {Boolean} reset - flag specifying whether or not to destroy the plot
     * @public
     */
    render(reset=false) {
        if (reset && this.hasRendered) {
            d3.select(`#${this.parentId}-${this.type}`).remove();
            this.hasRendered = false;
        }

        let g;
        if (this.hasRendered) {
            g = d3.select(`#${this.parentId}-${this.type}`);
        } else {
            if (this.parentId === undefined) {
                this.parentId = plotUtils.createSvg(this.rootId, this.width, this.height);
            }
            g = plotUtils.createGroup(this.parentId, this.padding, this.type);
            if (this.title!==undefined) g.append("text").html(this.title).attr("x", this.innerWidth/2).attr("y", -this.padding.top/3).attr("text-anchor", "middle");
        } 
        this.axisInternal.x.render(g, this);
        this.axisInternal.y.render(g, this);
        // TODO: stacked charts are passing something different for "data" than other plot types. is this an issue?
        // Note: perhaps we should have subclass of Plot?
        const data = stackedPlotTypes.includes(this.type) ? this.dataStack : this.data;
        // TODO: update all plots to accept "orientation" parameter
        let dataDomElements = plotRenderFunction[this.type](g, data, this.scale, this.orientation);
        this.hasRendered = true;
    
        // setting the tooltip
        if (dataDomElements !== undefined && this.tooltip.enabled) {
            dataDomElements.on("mouseover", (d, i, nodes) => {
                const el = d3.select(nodes[i]);
                el.classed("ljs--mouseover", true);
                this.tooltipObj.show(this.tooltip.formatter(d));
            });
            
            dataDomElements.on("mouseout", (d, i, nodes) => {
                const el = d3.select(nodes[i]);
                el.classed("ljs--mouseover", false);
                this.tooltipObj.hide();
            });
        }
    }

    /**
     * @description checks that required inputs are provided. Throws an error if that isn't the case.
     * @private
     */
    _validateInputs(data, type, rootId) {
        if (data === undefined) {
            console.error("No data provided.");
            throw "No data provided.";
        }

        if (type === undefined) {
            console.error("Plot type required.");
            throw "Plot type required.";
        }
        if (!Object.values(PlotType).includes(type)) {
            console.error(`Unrecognized plot type ${type}`);
            throw `Unrecognized plot type ${type}`;
        }

        if (rootId === undefined) {
            console.error("rootId cannot be undefined.");
            throw "rootId cannot be undefined.";
        }
    }

    /**
     * @description prints out more information about the Plot object for debugging purposes
     * @public
     */
    verbose(){
        // debugging purposes
        console.log(this);
        console.log(this.padding);
        console.log(this.axisInternal.x.title);
    }

    /**
     * Public function for sorting an axis ascending or descending manner.
     * @param {String} axis - axis to sort on; should be one of the enums listed in axisTypes var.
     * @param {String} sortDir - sort direction; shoudl be one of the enums listed in the sortDirections var.
     */
    // sortAxis(axis, sortDir) {
    //     this.config.sortAxis(axis, sortDir);
    //     this.render();
    // }

    /**
     * Provides users a way of updating an axis.
     * @param {String} axis - specifies the axis to update; should be one of the enums listed in the axisTypes var.
     * @param {Array} order - used for categorical scales; specifies the new domain
     * @param {Number} min - used for numerical scales; specifies a new min
     * @param {Number} max - used for numerical scales; specifies a new max
     */
    // updateAxis(axis, { order=undefined, min=undefined, max=undefined } = {}) {
    //     this.config.updateAxis(axis, {order: order, min: min, max: max});
    //     this.render();
    // }

    /**
     * Provides users a way of adding/removing data
     * @param {Array} data - array of data points to use for charting. Should contain all data user wants to display
     * @param {Boolean} reset - specifies whether or not to destroy the plot and recreate it, or to update the current plot
     */
    // updateData(data, reset=false) {
    //     this.config.updateData(data);
    //     this.render(reset);
    // }

}
