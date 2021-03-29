
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

// plot type enums
export const plots = {
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
};
export const plotTypes = plots; // do not like the word plots

// plots requiring data to be stacked
export const stackedPlotTypes = [plots.STACKEDBAR, plots.STACKEDCOLUMN];

// plot render functions
export const plotRenderFunction = {
    [plots.AREAPLOT]: AreaPlot.render,
    [plots.BARCODEPLOT]: BarcodePlot.render,
    [plots.BARPLOT]: BarPlot.render,
    [plots.CATEGORICAL_HEATMAP]: Heatmap.render,
    [plots.COLUMNPLOT]: ColumnPlot.render,
    [plots.HEATMAP]: Heatmap.render,
    [plots.LINEPLOT]: Lineplot.render,
    [plots.SCATTERPLOT]: ScatterPlot.render,
    [plots.STACKEDBAR]: StackedBarPlot.render,
    [plots.STACKEDCOLUMN]: StackedColumnPlot.render
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

export const axisTypes = {
    X: "x",
    Y: "y"
};

export const sortDirections = {
    ASC: "asc",
    DESC: "desc"
};

// enum for default scales for each plot type
export const defaultScales = {
    [plots.AREAPLOT]: {
        x: scales.TEMPORAL, // why? it could be linear
        y: scales.LINEAR
    },
    [plots.BARPLOT]: {
        x: scales.LINEAR,
        y: scales.CATEGORICAL
    },
    [plots.BARCODEPLOT]: {
        x: scales.LINEAR,
        y: scales.LINEAR
    },
    [plots.CATEGORICAL_HEATMAP]: {
        x: scales.CATEGORICAL,
        y: scales.CATEGORICAL,
        c: scales.ORDINAL
    },
    [plots.COLUMNPLOT]: {
        x: scales.CATEGORICAL,
        y: scales.LINEAR
    },
    [plots.HEATMAP]: {
        x: scales.CATEGORICAL,
        y: scales.CATEGORICAL,
        c: scales.SEQUENTIAL
    },
    [plots.LINEPLOT]: {
        x: scales.TEMPORAL,
        y: scales.LINEAR
    },
    [plots.SCATTERPLOT]: {
        x: scales.LINEAR,
        y: scales.LINEAR
    },
    [plots.STACKEDBAR]: {
        x: scales.LINEAR,
        y: scales.CATEGORICAL
    },
    [plots.STACKEDCOLUMN]: {
        x: scales.CATEGORICAL,
        y: scales.LINEAR
    }
};

// plot orientation enums
export const orientations = {
    POSITIVE: 1,
    NEGATIVE: -1
};

export const axisOrientations = {
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left"
};

export const defaultAxisOrientation = {
    [plots.AREAPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [plots.BARCODEPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [plots.BARPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [plots.CATEGORICAL_HEATMAP]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.TOP,
            [orientations.NEGATIVE]: axisOrientations.TOP
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [plots.COLUMNPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.TOP
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.LEFT
        }
    },
    [plots.HEATMAP]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.TOP,
            [orientations.NEGATIVE]: axisOrientations.TOP
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [plots.LINEPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [plots.SCATTERPLOT]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [plots.STACKEDBAR]: {
        x: {
            [orientations.POSITIVE]: axisOrientations.BOTTOM,
            [orientations.NEGATIVE]: axisOrientations.BOTTOM
        },
        y: {
            [orientations.POSITIVE]: axisOrientations.LEFT,
            [orientations.NEGATIVE]: axisOrientations.RIGHT
        }
    },
    [plots.STACKEDCOLUMN]: {
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
    [plots.AREAPLOT]: xyTooltipFormatter,
    [plots.BARPLOT]: xyTooltipFormatter,
    [plots.BARCODEPLOT]: xTooltipFormatter,
    [plots.CATEGORICAL_HEATMAP]: xycTooltipFormatter,
    [plots.COLUMNPLOT]: xyTooltipFormatter,
    [plots.HEATMAP]: xycTooltipFormatter,
    [plots.LINEPLOT]: xyTooltipFormatter,
    [plots.SCATTERPLOT]: xyTooltipFormatter,
    [plots.STACKEDBAR]: xAsSeriesTooltipFormatter,
    [plots.STACKEDCOLUMN]: yAsSeriesTooltipFormatter
};
