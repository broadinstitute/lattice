
import * as AreaPlot from "../views/AreaPlot";
import * as BarPlot from "../views/BarPlot";
import * as BarcodePlot from "../views/BarcodePlot";
import * as ColumnPlot from "../views/ColumnPlot";
import * as Heatmap from "../views/Heatmap";
import * as Lineplot from "../views/Lineplot";
import * as ScatterPlot from "../views/ScatterPlot";
import * as StackedBarPlot from "../views/StackedBarPlot";
import * as StackedColumnPlot from "../views/StackedColumnPlot";
export const LATTICE_DEFAULT_PADDING = 20;
export const PLOT_DEFAULT_PADDING = 50;

/**
 * @typedef {String} PlotType
 * @enum {PlotType}
 */
export const PlotType = Object.freeze({
    AREAPLOT: "areaplot",
    BARCODEPLOT: "barcodeplot",
    BARPLOT: "barplot",
    CATEGORICAL_HEATMAP: "categoricalheatmap",
    COLUMNPLOT: "columnplot",
    HEATMAP: "heatmap",
    LINEPLOT: "lineplot",
    SCATTERPLOT: "scatterplot",
    STACKEDBAR: "stackedbarplot",
    STACKEDCOLUMN: "stackedcolumnplot"
});
export const plotTypes = PlotType; // do not like the word plots
export const plots = PlotType;

/**
 * @typedef {String} PlotOrientation
 * @enum {Orientation}
 */
 export const PlotOrientation = {
    POSITIVE: 1,
    NEGATIVE: -1
};
export const orientations = PlotOrientation;

// plots requiring data to be stacked
export const stackedPlotTypes = [PlotType.STACKEDBAR, PlotType.STACKEDCOLUMN];

// plot render functions
export const plotRenderFunction = {
    [PlotType.AREAPLOT]: AreaPlot.render,
    [PlotType.BARCODEPLOT]: BarcodePlot.render,
    [PlotType.BARPLOT]: BarPlot.render,
    [PlotType.CATEGORICAL_HEATMAP]: Heatmap.render,
    [PlotType.COLUMNPLOT]: ColumnPlot.render,
    [PlotType.HEATMAP]: Heatmap.render,
    [PlotType.LINEPLOT]: Lineplot.render,
    [PlotType.SCATTERPLOT]: ScatterPlot.render,
    [PlotType.STACKEDBAR]: StackedBarPlot.render,
    [PlotType.STACKEDCOLUMN]: StackedColumnPlot.render
};

// valid scale type enums
export const scales = {
    CATEGORICAL: "categorical",
    LINEAR: "linear",
    ORDINAL: "ordinal",
    SEQUENTIAL: "sequential",
    SQRT: "sqrt",
    TEMPORAL: "temporal"
};

export const NUMERICAL_SCALES = [scales.LINEAR, scales.SEQUENTIAL, scales.SQRT, scales.TEMPORAL];

/**
 * @typedef {String} AxisType
 * @enum {AxisType}
 */
export const AxisType = {
    X: "x",
    Y: "y"
};
export const axisTypes = AxisType

export const sortDirections = {
    ASC: "asc",
    DESC: "desc"
};

// enum for default scales for each plot type
export const defaultScales = {
    [PlotType.AREAPLOT]: {
        x: scales.TEMPORAL, // why? it could be linear
        y: scales.LINEAR
    },
    [PlotType.BARPLOT]: {
        x: scales.LINEAR,
        y: scales.CATEGORICAL
    },
    [PlotType.BARCODEPLOT]: {
        x: scales.LINEAR,
        y: scales.LINEAR
    },
    [PlotType.CATEGORICAL_HEATMAP]: {
        x: scales.CATEGORICAL,
        y: scales.CATEGORICAL,
        c: scales.ORDINAL
    },
    [PlotType.COLUMNPLOT]: {
        x: scales.CATEGORICAL,
        y: scales.LINEAR
    },
    [PlotType.HEATMAP]: {
        x: scales.CATEGORICAL,
        y: scales.CATEGORICAL,
        c: scales.SEQUENTIAL
    },
    [PlotType.LINEPLOT]: {
        x: scales.TEMPORAL,
        y: scales.LINEAR
    },
    [PlotType.SCATTERPLOT]: {
        x: scales.LINEAR,
        y: scales.LINEAR
    },
    [PlotType.STACKEDBAR]: {
        x: scales.LINEAR,
        y: scales.CATEGORICAL
    },
    [PlotType.STACKEDCOLUMN]: {
        x: scales.CATEGORICAL,
        y: scales.LINEAR
    }
};



export const axisOrientations = {
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left"
};

export const defaultAxisOrientation = {
    [PlotType.AREAPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [PlotType.BARCODEPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [PlotType.BARPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [PlotType.CATEGORICAL_HEATMAP]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.TOP,
            [orientations.NEGATIVE]: axisOrientations.TOP
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [PlotType.COLUMNPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.TOP
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.LEFT
        }
    },
    [PlotType.HEATMAP]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.TOP,
            [orientations.NEGATIVE]: axisOrientations.TOP
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [PlotType.LINEPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [PlotType.SCATTERPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [PlotType.STACKEDBAR]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [PlotType.STACKEDCOLUMN]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.TOP
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.LEFT
        }
    }
};

const xTooltipFormatter = (d) => { return `${d.x}`; };
const xyTooltipFormatter = (d) => {
    return `x: ${d.x}<br/>
            y: ${d.y}`;
};
const xycTooltipFormatter = (d) => {
    return `x: ${d.x}<br/>
            y: ${d.y}<br/>
            c: ${d.c}`;
};
const xAsSeriesTooltipFormatter = (d) => {
    return `y: ${d.data.y}<br/>
            series: ${d.series}<br/>
            val: ${d.data[d.series]}`;
};
const yAsSeriesTooltipFormatter = (d) => {
    return `x: ${d.data.x}<br/>
            series: ${d.series}<br/>
            val: ${d.data[d.series]}`;
};
export const tooltipFormatters = {
    [PlotType.AREAPLOT]: xyTooltipFormatter,
    [PlotType.BARPLOT]: xyTooltipFormatter,
    [PlotType.BARCODEPLOT]: xTooltipFormatter,
    [PlotType.CATEGORICAL_HEATMAP]: xycTooltipFormatter,
    [PlotType.COLUMNPLOT]: xyTooltipFormatter,
    [PlotType.HEATMAP]: xycTooltipFormatter,
    [PlotType.LINEPLOT]: xyTooltipFormatter,
    [PlotType.SCATTERPLOT]: xyTooltipFormatter,
    [PlotType.STACKEDBAR]: xAsSeriesTooltipFormatter,
    [PlotType.STACKEDCOLUMN]: yAsSeriesTooltipFormatter
};
