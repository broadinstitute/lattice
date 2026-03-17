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
  petalData,
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

export const ScatterplotCustomTooltip = {
  name: "Scatter/Custom Tooltip",
  render: Template,
  args: {
    data: scatterDataColored,
    type: PlotType.SCATTERPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Scatterplot (Custom Tooltip)",
      tooltip: {
        formatter: (d) =>
          `<div style="font-family: Arial, sans-serif; padding: 8px; background-color: rgba(255, 255, 255, 0.9); border: 1px solid #ccc; border-radius: 4px;">
            <div style="font-weight: bold; color: ${d.c};">Details</div>
            <div>X: <strong>${d.x}</strong></div>
            <div>Y: <strong>${d.y}</strong></div>
            <div>Color: <span style="background: ${d.c}; padding: 2px 8px; border-radius: 3px;">${d.c}</span></div>
           </div>`,
      },
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
 * Petal plot - a radial, flower-like chart where each petal radiates from the center
 */
export const PetalPlot = {
  name: "Petal/Basic",
  render: Template,
  args: {
    data: petalData,
    type: PlotType.PETALPLOT,
    config: {
      width: 300,
      height: 300,
      title: "Petal Plot",
      valueDomain: [-4, 4],
      gridlineValues: [-2, 0, 2],
      valueAccessor: (d) => d.value,
      widthAccessor: (d) => d.width,
      labelAccessor: (d) => d.label,
      colorAccessor: (d) => d.color,
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

export const CompositeColumnLine = {
  name: "Composite/Column + Line",
  render: Template,
  args: {
    layers: [
      { type: PlotType.COLUMNPLOT, data: columnData },
      {
        type: PlotType.LINEPLOT,
        data: columnData,
        color: "#fa5252",
        // change to categorical x-axis for line layer to match column layer
        axis: { x: { scaleType: "categorical" } },
      },
    ],
    config: {
      width: 450,
      height: 300,
      title: "Column + Line Overlay",
      animate: false,
      axis: {
        x: { title: "Category" },
        y: { title: "Value" },
      },
    },
    style: defaultStyle,
  },
};

export const CompositeAreaLine = {
  name: "Composite/Area + Line",
  render: Template,
  args: {
    layers: [
      { type: PlotType.AREAPLOT, data: areaDataTemporal },
      { type: PlotType.LINEPLOT, data: lineDataTemporal, color: "#fa5252" },
    ],
    config: {
      width: 450,
      height: 300,
      title: "Area + Line (Temporal)",
      axis: {
        x: { title: "Date" },
        y: { title: "Value" },
      },
    },
    style: defaultStyle,
  },
};

export const CompositeScatterLine = {
  name: "Composite/Scatter + Line",
  render: Template,
  args: {
    layers: [
      { type: PlotType.SCATTERPLOT, data: scatterData },
      { type: PlotType.LINEPLOT, data: scatterData, color: "#15aabf", axis: { x: { scaleType: "linear" } } },
    ],
    config: {
      width: 450,
      height: 300,
      title: "Scatter + Trend Line",
      animate: false,
      axis: {
        x: { title: "X" },
        y: { title: "Y" },
      },
    },
    style: defaultStyle,
  },
};

export const ScatterWithReferenceLines = {
  name: "References/Scatter + Quartile Lines + Diagonal",
  render: Template,
  args: {
    data: scatterData,
    type: PlotType.SCATTERPLOT,
    config: {
      width: 450,
      height: 300,
      title: "Scatter with Reference Lines",
      animate: false,
      axis: {
        x: { title: "X" },
        y: { title: "Y" },
      },
      references: [
        { axis: "x", value: 2, label: "Q1", stroke: "#999", dasharray: "4 2" },
        { axis: "x", value: 3, label: "Median", stroke: "#333" },
        { axis: "x", value: 4, label: "Q3", stroke: "#999", dasharray: "4 2" },
        { axis: "y", value: 4, label: "Mean Y", stroke: "#e67700", dasharray: "6 3" },
        {
          points: [
            { x: 2, y: 2 },
            { x: 5, y: 5 },
          ],
          label: "x = y",
          stroke: "#aaa",
          dasharray: "6 3",
        },
      ],
    },
    style: defaultStyle,
  },
};

export const ColumnWithHorizontalReference = {
  name: "References/Column + Horizontal Target Line",
  render: Template,
  args: {
    data: columnData,
    type: PlotType.COLUMNPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Column Plot with Target",
      axis: {
        x: { title: "Category" },
        y: { title: "Value" },
      },
      references: [{ axis: "y", value: 20, label: "Target", stroke: "#e03131", dasharray: "8 4" }],
    },
    style: defaultStyle,
  },
};
