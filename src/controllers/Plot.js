import * as d3 from "d3";
import * as plotUtils from "../utils/plot-utils";
import {
  PlotType,
  PlotOrientation,
  tooltipFormatters,
  defaultScales,
  defaultAxisOrientation,
  ScaleType,
  plotRenderFunction,
  stackedPlotTypes,
  axislessPlotTypes,
  DEFAULT_PADDING,
} from "../utils/constants";
import Tooltip from "../views/Tooltip";
import { Point2D } from "../models/Point2D";
import { Axis } from "../views/Axis";

class PlotKernel {
  /**
   * @constructor
   * @property {String} parentId parent SVG ID
   * @property {Number} width
   * @property {Number} height
   * @property {Boolean} animate enable/disable transitions/animations
   * @property {PlotOrientation} orientation
   * @property {String} title plot title
   * @property {PlotPadding} padding plot padding object
   * @property {PlotAxis} axis axis object
   * @property {PlotTooltip} tooltip plot tooltip object
   * @property {String[]} series not sure what this does
   */
  constructor() {
    // initiate default values for the following properties
    this.parentId = undefined;

    this.width = 300;
    this.height = 300;

    this.animate = true;
    this.color = undefined;

    this.orientation = PlotOrientation.POSITIVE;
    this.title = undefined;

    /** @typedef PlotPadding */
    let PlotPadding = {
      top: DEFAULT_PADDING,
      left: DEFAULT_PADDING,
      bottom: DEFAULT_PADDING,
      right: DEFAULT_PADDING,
    };
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
        interpolator: undefined, // required for (and only used by) sequential scale type
      },
    };
    this.axis = PlotAxis;

    /** @typedef PlotTooltip */
    let PlotTooltip = {
      enabled: true,
      id: undefined,
      formatter: undefined, // formatter - Function that takes a single argument (single datum for a particular plot) to generate HTML for tooltip
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
  constructor(data, type, rootId, userInput = {}) {
    super();
    this.customizableProp = Object.keys(this);

    this._validateInputs(data, type, rootId);
    this._userInput = userInput;

    /** @property {PlotType} type */
    this.type = type;
    this.rootId = rootId; // question: why do we allow users to provide rootId and parentId?
    this.hasRendered = false;
    this.axisInternal = {}; // do we still need this?

    // Axisless plots (e.g. donut) keep raw data and skip axis/scale setup
    if (axislessPlotTypes.includes(this.type)) {
      this.data = data;
      this._changeSettings(userInput);
      this.innerWidth = this.width - this.padding.left - this.padding.right;
      this.innerHeight = this.height - this.padding.top - this.padding.bottom;
      return;
    }

    /** @property {Point2D[]} data */
    this.data = data.map((d) => {
      return new Point2D(d.x, d.y, d.c, d.r, d.series);
    });

    this._changeSettings(userInput);

    // additional computed properties
    this.innerWidth = this.width - this.padding.left - this.padding.right;
    this.innerHeight = this.height - this.padding.top - this.padding.bottom;
    this.tooltipObj = new Tooltip(this.tooltip.id); // get rid of this extra attribute

    if (stackedPlotTypes.includes(this.type)) {
      this.dataStack = plotUtils.createDataStack(this.data, this.type, this.series);
    }
    this.scale = this.setScales();
  }

  /**
   * @description reports what properties of the Plot object are customizable
   * @public
   */
  getCustomizable() {
    let config = {};
    this.customizableProp.forEach((prop) => {
      if ("axis" == prop) {
        config.axis = {};
        Object.keys(this.axis).forEach((d) => {
          if (d == "x" || d == "y") {
            config.axis[d] = this.axisInternal[d].getCustomizable();
          } else {
            config.axis[d] = this.axis[d];
          }
        });
      } else {
        config[prop] = this[prop];
      }
    });
    return config;
  }

  /**
   * @description changes plot settings based on user input and plot type
   * @param {Object} userInput: available input options are defined in plotConfig.js
   * @private
   */
  _changeSettings(userInput) {
    let plot = this;

    // go through each customizable property
    plot.customizableProp.forEach((prop) => {
      switch (
        prop // updating config values based on user input
      ) {
        case "padding":
          // if (userInput.padding!==undefined) update(prop);
          if (userInput.padding !== undefined) plot.padding = Object.assign({}, plot.padding, userInput.padding); // merge with userInput.padding

          break;
        case "tooltip":
          // set tooltip config based on plot properties
          plot.tooltip.formatter = tooltipFormatters[plot.type];
          plot.tooltip.id = `${plot.rootId}-tooltip`;
          // update based on user input
          if (userInput.tooltip !== undefined) plot.tooltip = Object.assign({}, plot.tooltip, userInput.tooltip);
          break;
        case "axis":
          // Skip axis setup for axisless plots (e.g. donut)
          if (axislessPlotTypes.includes(plot.type)) {
            break;
          }
          Object.keys(plot.axis).forEach((which) => {
            let axis = plot.axis[which];
            if (["x", "y"].includes(which)) {
              // set scale type and axis orientation based on plot type and axis

              axis.scaleType = defaultScales[plot.type][which];

              axis.orientation = defaultAxisOrientation[plot.type][which][plot.orientation];

              // update axis settings based on user input
              if (userInput.axis !== undefined && userInput.axis[which] !== undefined) {
                axis = Object.assign({}, axis, userInput.axis[which]);
              }

              // then finally creates an Axis object and assign it to plot.axisInternal[which]
              plot.axisInternal[which] = new Axis(which, axis);
            } else if (which == "c") {
              axis.scaleType = defaultScales[this.type].c;
              if (userInput.axis !== undefined && userInput.axis.c !== undefined) {
                axis = Object.assign({}, axis, userInput.axis.c);
                plot.axisInternal[which] = axis;
              }
            }
          });
          break;
        default:
          // simple update when the value of a plot property is a simple scalar
          if (userInput[prop] !== undefined) plot[prop] = userInput[prop];
      }
    });
  }

  /**
   * @description sets plot scales
   * @returns {Object} a scale object with attributes: x, y, r, c
   * @private
   */
  setScales() {
    // first, validate data based on x and y scale types
    let invalidData = this.data.filter((d) => {
      return (
        d.validateScaleType(this.axisInternal.x.scaleType, "x") ||
        d.validateScaleType(this.axisInternal.y.scaleType, "y")
      );
    });
    if (invalidData.length > 0) throw "Fatal Error: Not all data are valid"; // todo: is this what we want the program to behave?

    // initiate values to xDomain, xRange, yDomain, and yRange
    const setDomain = (data, attr) => {
      let domain = d3.extent(data.map((d) => d[attr]));
      return domain;
    };
    let xDomain = setDomain(this.data, "x");
    let xRange = [0, this.innerWidth];
    let yDomain = setDomain(this.data, "y");
    let yRange = [this.innerHeight, 0];

    // adjust domain or range based on plot type and scale type
    const type = PlotType;
    switch (this.type) {
      case type.AREAPLOT:
      case type.LINEPLOT:
      case type.SCATTERPLOT:
        // no further changes needed
        break;
      case type.BARCODEPLOT:
        yDomain = [0, 1];
        break;
      case type.BARPLOT:
        xDomain = [0, d3.max(this.data, (d) => d.x)];
        xRange = this.orientation == PlotOrientation.POSITIVE ? xRange : [this.innerWidth, 0];
        yDomain = this.data.map((d) => d.y);
        yRange = [0, this.innerHeight];
        break;
      case type.CATEGORICAL_HEATMAP:
      case type.HEATMAP:
        xDomain = this.data.map((d) => d.x);
        yDomain = this.data.map((d) => d.y);
        yRange = [0, this.innerHeight];
        break;
      case type.COLUMNPLOT:
        xDomain = this.data.map((d) => d.x);
        break;
      case type.STACKEDBAR:
        xDomain = [0, d3.max(this.dataStack, (d) => d3.max(d, (d) => d[1]))];
        xRange = this.orientation == PlotOrientation.POSITIVE ? xRange : [this.innerWidth, 0];
        yDomain = this.data.map((d) => d.y);
        yRange = [0, this.innerHeight];
        break;
      case type.STACKEDCOLUMN:
        xDomain = this.data.map((d) => d.x);
        yDomain = [0, d3.max(this.dataStack, (d) => d3.max(d, (d) => d[1]))];
        break;
      default:
        console.error("unknown plot type");
    }
    return {
      x: this.axisInternal.x.createScale(xDomain, xRange),
      y: this.axisInternal.y.createScale(yDomain, yRange),
      r: plotUtils.createRadiusScale(this.data),
      c: plotUtils.createColorScale(this.axisInternal.c),
    };
  }

  /**
   * @description rendering function
   * @param {Boolean} reset - flag specifying whether or not to destroy the plot
   * @public
   */
  render(reset = false) {
    if (reset && this.hasRendered) {
      d3.select(`#${this.parentId}-${this.type}`).remove();
      this.hasRendered = false;
    }

    // Axisless plots (e.g. donut) use their own render function with a config object
    if (axislessPlotTypes.includes(this.type)) {
      const config = {
        rootId: this.rootId,
        parentId: this.parentId,
        width: this.width,
        height: this.height,
        innerWidth: this.innerWidth,
        innerHeight: this.innerHeight,
        padding: this.padding,
        title: this.title,
        data: this.data,
        ...this._userInput,
      };
      let dataDomElements = plotRenderFunction[this.type](config);
      this.hasRendered = true;
      return;
    }

    let g;
    if (this.hasRendered) {
      g = d3.select(`#${this.parentId}-${this.type}`);
    } else {
      const result = plotUtils.setupPlotGroup({
        parentId: this.parentId,
        rootId: this.rootId,
        width: this.width,
        height: this.height,
        padding: this.padding,
        tag: this.type,
        title: this.title,
        innerWidth: this.innerWidth,
      });
      g = result.g;
      this.parentId = result.parentId;
    }
    this.axisInternal.x.render(g, this);
    this.axisInternal.y.render(g, this);
    // TODO: stacked charts are passing something different for "data" than other plot types. is this an issue?
    // Note: perhaps we should have subclass of Plot?
    const data = stackedPlotTypes.includes(this.type) ? this.dataStack : this.data;
    // TODO: update all plots to accept "orientation" parameter
    let dataDomElements = plotRenderFunction[this.type](g, data, this.scale, this.orientation, this);
    this.hasRendered = true;

    // setting the tooltip
    if (this.tooltip.enabled) {
      plotUtils.attachTooltip(dataDomElements, this.tooltip.formatter, this.tooltipObj);
    }

    // reference lines
    if (this._userInput.references) {
      plotUtils.renderReferences(g, this._userInput.references, this.scale, this.innerWidth, this.innerHeight);
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
  verbose() {
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
