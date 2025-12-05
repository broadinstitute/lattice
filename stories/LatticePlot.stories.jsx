import React from "react";
import { LatticePlot } from "../src/components/LatticePlot";
import { PlotType } from "../src/utils/constants";

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

export default {
  title: "Lattice/LatticePlot (React)",
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
  render: (args) => <LatticePlot {...args} />,
  args: {
    data: scatterData,
    type: PlotType.SCATTERPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Scatterplot via LatticePlot",
      axis: {
        x: { title: "X Value" },
        y: { title: "Y Value" },
      },
    },
    style: { border: "1px solid #eee" },
  },
};

/**
 * Donut plot using the LatticePlot React component
 */
export const DonutPlot = {
  render: (args) => <LatticePlot {...args} />,
  args: {
    data: donutData,
    type: PlotType.DONUT,
    config: {
      width: 300,
      height: 300,
      title: "Donut via LatticePlot",
      showLabels: true,
      innerRadiusRatio: 0.6,
      categoryAccessor: (d) => d.category,
      valueAccessor: (d) => d.value,
    },
    style: { border: "1px solid #eee" },
  },
};

/**
 * Column plot using the LatticePlot React component
 */
export const ColumnPlot = {
  render: (args) => <LatticePlot {...args} />,
  args: {
    data: [
      { x: "A", y: 10 },
      { x: "B", y: 25 },
      { x: "C", y: 15 },
      { x: "D", y: 30 },
    ],
    type: PlotType.COLUMNPLOT,
    config: {
      width: 400,
      height: 300,
      title: "Column Plot via LatticePlot",
      axis: {
        x: { title: "Category" },
        y: { title: "Value" },
      },
    },
    style: { border: "1px solid #eee" },
  },
};
