import React from "react";
import { LatticePlot } from "../src/components/LatticePlot";
import * as d3 from "d3";
import { PlotOrientation, PlotType } from "../src/utils/constants";
import {
  areaDataTemporal,
  barData,
  barcodeData,
  columnData,
  donutData,
  heatmapData,
  lineDataTemporal,
  scatterData,
  scatterDataColored,
  stackedColumnData,
} from "./fixtures/plotData";

const Template = (args) => <LatticePlot {...args} />;
const defaultStyle = { border: "1px solid #eee" };

export default {
  title: "Lattice/LatticePlot",
  component: LatticePlot,
  argTypes: {
    type: {
      control: { type: "select" },
      options: Object.values(PlotType),
      description: "Plot type",
    },
    config: {
      description: "Plot configuration",
    },
  },
  parameters: {
    docs: {
      codePanel: true,
      source: { language: "javascript" },
    },
  },
};

/**
 * Basic scatterplot using the LatticePlot React component
 */
export const Scatterplot = {
  name: "Scatter/Basic",
  render: Template,
  args: {
    data: scatterData,
    type: PlotType.SCATTERPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Scatterplot",
      axis: {
        x: { title: "X Value" },
        y: { title: "Y Value" },
      },
    },
    style: defaultStyle,
  },
};

export const AreaPlot = {
  name: "Area/Temporal X",
  render: Template,
  args: {
    data: areaDataTemporal,
    type: PlotType.AREAPLOT,
    config: {
      width: 500,
      height: 300,
      title: "Area Plot (Temporal X)",
      axis: {
        x: { title: "Date" },
        y: { title: "Value" },
      },
    },
    style: defaultStyle,
  },
};

export const BarPlot = {
  name: "Bar/Basic",
  render: Template,
  args: {
    data: barData,
    type: PlotType.BARPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Bar Plot",
      showLabels: true,
      axis: {
        x: { title: "Value" },
        y: { title: "Fruit" },
      },
    },
    style: defaultStyle,
  },
};

export const BarPlotFullWidth = {
  name: "Bar/Full Width (Auto)",
  render: (args) => (
    <div style={{ width: "100%", border: "1px solid #eee" }}>
      <LatticePlot {...args} />
    </div>
  ),
  args: {
    data: barData,
    type: PlotType.BARPLOT,
    config: {
      height: 300,
      title: "Bar Plot (Full Width)",
      axis: {
        x: { title: "Value" },
        y: { title: "Fruit" },
      },
    },
  },
};

export const BarPlotNegative = {
  name: "Bar/Negative Orientation",
  render: Template,
  args: {
    data: barData,
    type: PlotType.BARPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Bar Plot (Negative Orientation)",
      orientation: PlotOrientation.NEGATIVE,
      showLabels: true,
      axis: {
        x: { title: "Value" },
        y: { title: "Fruit" },
      },
    },
    style: defaultStyle,
  },
};

export const BarcodePlot = {
  name: "Barcode/Basic",
  render: Template,
  args: {
    data: barcodeData,
    type: PlotType.BARCODEPLOT,
    config: {
      width: 500,
      height: 140,
      title: "Barcode Plot",
      axis: {
        x: { title: "Position" },
        y: { display: false },
      },
    },
    style: defaultStyle,
  },
};

export const ScatterplotColored = {
  name: "Scatter/Color + Radius",
  render: Template,
  args: {
    data: scatterDataColored,
    type: PlotType.SCATTERPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Scatterplot (Color + Radius)",
      axis: {
        x: { title: "X Value" },
        y: { title: "Y Value" },
      },
    },
    style: defaultStyle,
  },
};

export const ScatterplotTooltipDisabled = {
  name: "Scatter/Tooltip Disabled",
  render: Template,
  args: {
    data: scatterDataColored,
    type: PlotType.SCATTERPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Scatterplot (Tooltip Disabled)",
      tooltip: { enabled: false },
      axis: {
        x: { title: "X Value" },
        y: { title: "Y Value" },
      },
    },
    style: defaultStyle,
  },
};

/**
 * Donut plot using the LatticePlot React component
 */
export const DonutPlot = {
  name: "Donut/Basic",
  render: Template,
  args: {
    data: donutData,
    type: PlotType.DONUT,
    config: {
      width: 300,
      height: 300,
      title: "Donut",
      showLabels: true,
      innerRadiusRatio: 0.6,
      categoryAccessor: (d) => d.category,
      valueAccessor: (d) => d.value,
    },
    style: defaultStyle,
  },
};

/**
 * Column plot using the LatticePlot React component
 */
export const ColumnPlot = {
  name: "Column/Basic",
  render: Template,
  args: {
    data: columnData,
    type: PlotType.COLUMNPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Column Plot",
      axis: {
        x: { title: "Category" },
        y: { title: "Value" },
      },
    },
    style: defaultStyle,
  },
};

export const ColumnPlotRotatedXTicks = {
  name: "Column/Rotated X Labels",
  render: Template,
  args: {
    data: [
      { x: "Category A", y: 10, c: "#4c6ef5" },
      { x: "Category B", y: 25, c: "#15aabf" },
      { x: "Category C", y: 15, c: "#12b886" },
      { x: "Category D", y: 30, c: "#fab005" },
    ],
    type: PlotType.COLUMNPLOT,
    config: {
      width: 500,
      height: 300,
      title: "Column Plot (Rotated X Labels)",
      axis: {
        x: { title: "Category", textAngle: -45, textAnchor: "end" },
        y: { title: "Value" },
      },
    },
    style: defaultStyle,
  },
};

export const LinePlotTemporalX = {
  name: "Line/Temporal X",
  render: Template,
  args: {
    data: lineDataTemporal,
    type: PlotType.LINEPLOT,
    config: {
      width: 500,
      height: 300,
      title: "Line Plot (Temporal X)",
      axis: {
        x: { title: "Date" },
        y: { title: "Value" },
      },
    },
    style: defaultStyle,
  },
};

export const StackedColumnPlot = {
  name: "Stacked/Column",
  render: Template,
  args: {
    data: stackedColumnData,
    type: PlotType.STACKEDCOLUMN,
    config: {
      width: 500,
      height: 320,
      title: "Stacked Column Plot",
      axis: {
        x: { title: "Category" },
        y: { title: "Total" },
      },
      series: [
        { name: "Alpha", color: "#4c6ef5" },
        { name: "Beta", color: "#15aabf" },
        { name: "Gamma", color: "#fab005" },
      ],
    },
    style: defaultStyle,
  },
};

export const StackedBarPlotNegativeOrientation = {
  name: "Stacked/Bar (Negative)",
  render: Template,
  args: {
    data: stackedColumnData.map((d) => ({ x: d.y, y: d.x, series: d.series })),
    type: PlotType.STACKEDBAR,
    config: {
      width: 520,
      height: 320,
      title: "Stacked Bar Plot (Negative Orientation)",
      orientation: PlotOrientation.NEGATIVE,
      axis: {
        x: { title: "Total" },
        y: { title: "Category" },
      },
      series: [
        { name: "Alpha", color: "#4c6ef5" },
        { name: "Beta", color: "#15aabf" },
        { name: "Gamma", color: "#fab005" },
      ],
    },
    style: defaultStyle,
  },
};

export const Heatmap = {
  name: "Heatmap/Sequential",
  render: Template,
  args: {
    data: heatmapData,
    type: PlotType.HEATMAP,
    config: {
      width: 450,
      height: 300,
      title: "Heatmap (Sequential Color Scale)",
      axis: {
        x: { title: "Column" },
        y: { title: "Row" },
        c: { domain: [0, 1], interpolator: d3.interpolateViridis },
      },
    },
    style: defaultStyle,
  },
};
