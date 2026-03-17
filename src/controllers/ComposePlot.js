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
  DEFAULT_PADDING,
  validateLayerCompatibility,
} from "../utils/constants";
import Tooltip from "../views/Tooltip";
import { Point2D } from "../models/Point2D";
import { Axis } from "../views/Axis";

/**
 * ComposePlot renders multiple plot types (layers) on shared axes.
 *
 * Each layer specifies its own `type` and `data`. Shared configuration
 * (dimensions, padding, axis titles, animate) is provided at the top level.
 *
 * Layers must resolve to the same x/y scale types.
 *
 * new ComposePlot([
 *   { type: PlotType.COLUMNPLOT, data: columnData },
 *   { type: PlotType.LINEPLOT,   data: lineData, color: "#fa5252" }
 * ], "root-div", { width: 400, height: 300 });
 */
export class ComposePlot {
  /**
   * @param {Array<Object>} layers - each with { type, data, color?, series?, tooltip?, axis? }
   * @param {String} rootId - DOM element ID to render into
   * @param {Object} [config] - shared config (width, height, padding, axis, title, animate, orientation)
   */
  constructor(layers, rootId, config = {}) {
    if (!rootId) throw "rootId cannot be undefined.";
    if (!layers || !layers.length) throw "At least one layer is required.";

    // Validate layer compatibility — throws on mismatch
    const resolvedScales = validateLayerCompatibility(layers);

    this.rootId = rootId;
    this.parentId = config.parentId;
    this.hasRendered = false;

    // Shared dimensions & layout
    this.width = config.width ?? 300;
    this.height = config.height ?? 300;
    this.animate = config.animate ?? true;
    this.orientation = config.orientation ?? PlotOrientation.POSITIVE;
    this.title = config.title;
    this._references = config.references;

    this.padding = Object.assign(
      {
        top: DEFAULT_PADDING,
        left: DEFAULT_PADDING,
        bottom: DEFAULT_PADDING,
        right: DEFAULT_PADDING,
      },
      config.padding,
    );

    this.innerWidth = this.width - this.padding.left - this.padding.right;
    this.innerHeight = this.height - this.padding.top - this.padding.bottom;

    // Use the first layer's type for axis orientation defaults
    const primaryType = layers[0].type;

    // build shared axis config
    this.axisInternal = {};
    const userAxis = config.axis ?? {};

    ["x", "y"].forEach((which) => {
      const axisDefaults = {
        scaleType: resolvedScales[which],
        orientation: defaultAxisOrientation[primaryType][which][this.orientation],
        title: `${which} axis`,
      };
      const merged = Object.assign({}, axisDefaults, userAxis[which] ?? {});
      this.axisInternal[which] = new Axis(which, merged);
    });

    // Color axis (optional, from config)
    this.axisInternal.c = undefined;
    if (userAxis.c) {
      const cDefaults = defaultScales[primaryType];
      this.axisInternal.c = Object.assign({ scaleType: cDefaults.c }, userAxis.c);
    }

    // process each layer's data
    this._layers = layers.map((layer, index) => {
      const isStacked = stackedPlotTypes.includes(layer.type);
      const data = layer.data.map((d) => new Point2D(d.x, d.y, d.c, d.r, d.series));

      const result = {
        type: layer.type,
        data,
        color: layer.color,
        series: layer.series ?? [],
        index,
      };

      // per-layer tooltip
      const tooltipConfig = Object.assign(
        {
          enabled: true,
          id: `${rootId}-tooltip`,
          formatter: tooltipFormatters[layer.type],
        },
        layer.tooltip,
      );
      result.tooltip = tooltipConfig;

      // stacked data
      if (isStacked) {
        result.dataStack = plotUtils.createDataStack(data, layer.type, result.series);
      }

      return result;
    });

    // compute unified scales
    this.scale = this._setScales();
    this.tooltipObj = new Tooltip(`${rootId}-tooltip`);
  }

  /**
   * Computes unified x/y scales that span all layers' data.
   */
  _setScales() {
    const allData = this._layers.flatMap((l) => l.data);

    // validate data against resolved scale types
    const invalidData = allData.filter(
      (d) =>
        d.validateScaleType(this.axisInternal.x.scaleType, "x") ||
        d.validateScaleType(this.axisInternal.y.scaleType, "y"),
    );
    if (invalidData.length > 0) throw "Fatal Error: Not all data are valid for the resolved scale types";

    // Start with extent of all data
    let xDomain = d3.extent(allData, (d) => d.x);
    let xRange = [0, this.innerWidth];
    let yDomain = d3.extent(allData, (d) => d.y);
    let yRange = [this.innerHeight, 0];

    // Merge per-layer domain requirements
    const xScaleType = this.axisInternal.x.scaleType;
    const yScaleType = this.axisInternal.y.scaleType;

    // Categorical domains: union of all unique values
    if (xScaleType === ScaleType.CATEGORICAL) {
      const xValues = new Set();
      this._layers.forEach((l) => l.data.forEach((d) => xValues.add(d.x)));
      xDomain = Array.from(xValues);
    }
    if (yScaleType === ScaleType.CATEGORICAL) {
      const yValues = new Set();
      this._layers.forEach((l) => l.data.forEach((d) => yValues.add(d.y)));
      yDomain = Array.from(yValues);
      yRange = [0, this.innerHeight];
    }

    // For types that start y at 0 (column, bar, stacked), ensure 0 is included
    const hasColumnLike = this._layers.some((l) =>
      [
        PlotType.COLUMNPLOT,
        PlotType.STACKEDCOLUMN,
        PlotType.BARPLOT,
        PlotType.STACKEDBAR,
        PlotType.BARCODEPLOT,
      ].includes(l.type),
    );

    if (hasColumnLike && yScaleType === ScaleType.LINEAR && typeof yDomain[0] === "number") {
      yDomain = [0, d3.max(allData, (d) => d.y)];
    }

    // Expand y domain with stacked layers' max
    this._layers.forEach((l) => {
      if (l.dataStack && yScaleType === ScaleType.LINEAR) {
        const stackMax = d3.max(l.dataStack, (s) => d3.max(s, (d) => d[1]));
        yDomain[1] = Math.max(yDomain[1], stackMax);
      }
    });

    // Bar-specific: x starts at 0, orientation may flip
    if (hasColumnLike && xScaleType === ScaleType.LINEAR && typeof xDomain[0] === "number") {
      xDomain = [0, d3.max(allData, (d) => d.x)];
      // Expand with stacked bar max
      this._layers.forEach((l) => {
        if (l.dataStack && xScaleType === ScaleType.LINEAR) {
          const stackMax = d3.max(l.dataStack, (s) => d3.max(s, (d) => d[1]));
          xDomain[1] = Math.max(xDomain[1], stackMax);
        }
      });
      if (this.orientation === PlotOrientation.NEGATIVE) {
        xRange = [this.innerWidth, 0];
      }
    }

    // Barcode y domain override
    const hasBarcodeOnly = this._layers.every((l) => l.type === PlotType.BARCODEPLOT);
    if (hasBarcodeOnly) {
      yDomain = [0, 1];
    }

    return {
      x: this.axisInternal.x.createScale(xDomain, xRange),
      y: this.axisInternal.y.createScale(yDomain, yRange),
      r: plotUtils.createRadiusScale(allData),
      c: plotUtils.createColorScale(this.axisInternal.c),
    };
  }

  /**
   * Renders all layers on shared axes.
   * @param {Boolean} Rerender if true
   */
  render(reset = false) {
    if (reset && this.hasRendered) {
      d3.select(`#${this.parentId}-compose`).remove();
      this.hasRendered = false;
    }

    let g;
    if (this.hasRendered) {
      g = d3.select(`#${this.parentId}-compose`);
    } else {
      const result = plotUtils.setupPlotGroup({
        parentId: this.parentId,
        rootId: this.rootId,
        width: this.width,
        height: this.height,
        padding: this.padding,
        tag: "compose",
        title: this.title,
        innerWidth: this.innerWidth,
      });
      g = result.g;
      this.parentId = result.parentId;
    }

    this.axisInternal.x.render(g, this);
    this.axisInternal.y.render(g, this);

    // Render each layer in order
    this._layers.forEach((layer) => {
      const data = layer.dataStack ?? layer.data;

      // Build a proxy that mimics the Plot interface views may reference
      const plotProxy = {
        animate: this.animate,
        color: layer.color,
        innerWidth: this.innerWidth,
        innerHeight: this.innerHeight,
        padding: this.padding,
      };

      const dataDomElements = plotRenderFunction[layer.type](g, data, this.scale, this.orientation, plotProxy);

      // Attach per-layer tooltip
      if (layer.tooltip.enabled) {
        plotUtils.attachTooltip(dataDomElements, layer.tooltip.formatter, this.tooltipObj);
      }
    });

    this.hasRendered = true;

    // reference lines
    if (this._references) {
      plotUtils.renderReferences(g, this._references, this.scale, this.innerWidth, this.innerHeight);
    }
  }
}
