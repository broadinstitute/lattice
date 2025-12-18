import React from "react";
import { LatticePlot } from "../src/components/LatticePlot";
import * as d3 from "d3";
import { PlotOrientation, PlotType, ScaleType } from "../src/utils/constants";

const Template = (args) => <LatticePlot {...args} />;
const defaultStyle = { border: "1px solid #eee" };

const scatterData = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 3 },
  { x: 4, y: 7 },
  { x: 5, y: 5 },
];

const donutData = [
  { category: "Group A", value: 30 },
  { category: "Group B", value: 20 },
  { category: "Group C", value: 15 },
  { category: "Group D", value: 35 },
];

const scatterDataColored = [
  { x: 1, y: 2, c: "#4c6ef5", r: 2 },
  { x: 2, y: 4, c: "#15aabf", r: 4 },
  { x: 3, y: 3, c: "#12b886", r: 3 },
  { x: 4, y: 7, c: "#fab005", r: 5 },
  { x: 5, y: 5, c: "#fa5252", r: 4 },
];

const lineDataTemporal = [
  { x: new Date(2024, 0, 1), y: 10 },
  { x: new Date(2024, 1, 1), y: 15 },
  { x: new Date(2024, 2, 1), y: 12 },
  { x: new Date(2024, 3, 1), y: 20 },
  { x: new Date(2024, 4, 1), y: 18 },
];

const areaDataTemporal = [
  { x: new Date(2024, 0, 1), y: 4 },
  { x: new Date(2024, 1, 1), y: 9 },
  { x: new Date(2024, 2, 1), y: 6 },
  { x: new Date(2024, 3, 1), y: 14 },
  { x: new Date(2024, 4, 1), y: 11 },
  { x: new Date(2024, 5, 1), y: 16 },
];

const barcodeData = [
  { x: 1, y: 0 },
  { x: 1.6, y: 0 },
  { x: 2.1, y: 0 },
  { x: 2.9, y: 0 },
  { x: 3.2, y: 0 },
  { x: 3.8, y: 0 },
  { x: 4.4, y: 0 },
  { x: 5.1, y: 0 },
  { x: 5.7, y: 0 },
];

const stackedColumnData = [
  { x: "A", y: 10, series: "Alpha" },
  { x: "A", y: 6, series: "Beta" },
  { x: "A", y: 4, series: "Gamma" },
  { x: "B", y: 12, series: "Alpha" },
  { x: "B", y: 5, series: "Beta" },
  { x: "B", y: 8, series: "Gamma" },
  { x: "C", y: 7, series: "Alpha" },
  { x: "C", y: 9, series: "Beta" },
  { x: "C", y: 3, series: "Gamma" },
  { x: "D", y: 11, series: "Alpha" },
  { x: "D", y: 4, series: "Beta" },
  { x: "D", y: 6, series: "Gamma" },
];

const heatmapData = [
  { x: "A", y: "Row 1", c: 0.1 },
  { x: "B", y: "Row 1", c: 0.4 },
  { x: "C", y: "Row 1", c: 0.9 },
  { x: "A", y: "Row 2", c: 0.7 },
  { x: "B", y: "Row 2", c: 0.2 },
  { x: "C", y: "Row 2", c: 0.5 },
  { x: "A", y: "Row 3", c: 0.3 },
  { x: "B", y: "Row 3", c: 0.8 },
  { x: "C", y: "Row 3", c: 0.6 },
];

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

export const BarcodePlot = {
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
  render: Template,
  args: {
    data: [
      { x: "A", y: 10, c: "#4c6ef5" },
      { x: "B", y: 25, c: "#15aabf" },
      { x: "C", y: 15, c: "#12b886" },
      { x: "D", y: 30, c: "#fab005" },
    ],
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

export const InlineSparkline = {
  render: () => {
    const data = Array.from({ length: 24 }, (_, i) => ({
      x: i,
      y: 10 + Math.sin(i / 3) * 2 + (i % 5) * 0.15,
    }));

    return (
      <div style={{ fontSize: 14, lineHeight: "20px", padding: 16 }}>
        CPU usage{" "}
        <LatticePlot
          data={data}
          type={PlotType.LINEPLOT}
          config={{
            width: 120,
            height: 24,
            padding: { top: 2, right: 2, bottom: 2, left: 2 },
            tooltip: { enabled: false },
            axis: {
              x: {
                scaleType: ScaleType.LINEAR,
                hideAxis: true,
                hideTicks: true,
                hideLabels: true,
                hideTitle: true,
              },
              y: {
                hideAxis: true,
                hideTicks: true,
                hideLabels: true,
                hideTitle: true,
              },
            },
          }}
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            margin: "0 6px",
          }}
        />
        last 24h
      </div>
    );
  },
};

export const StackedColumnPlot = {
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
