import React from "react";
import { LatticeGrid } from "../src/components/LatticeGrid";
import { PlotType } from "../src/utils/constants";

const Template = (args) => <LatticeGrid {...args} />;
const defaultStyle = { border: "1px solid #eee" };

const scatterData = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 3 },
  { x: 4, y: 7 },
  { x: 5, y: 5 },
];

const lineDataTemporal = [
  { x: new Date(2024, 0, 1), y: 10 },
  { x: new Date(2024, 1, 1), y: 15 },
  { x: new Date(2024, 2, 1), y: 12 },
  { x: new Date(2024, 3, 1), y: 20 },
  { x: new Date(2024, 4, 1), y: 18 },
];

const columnData = [
  { x: "A", y: 10, c: "#4c6ef5" },
  { x: "B", y: 25, c: "#15aabf" },
  { x: "C", y: 15, c: "#12b886" },
  { x: "D", y: 30, c: "#fab005" },
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

export default {
  title: "Lattice/LatticeGrid",
  component: LatticeGrid,
  argTypes: {
    plots: {
      description: "Array of plot configurations (row/column/data/type/config)",
    },
    config: {
      description: "Lattice configuration",
    },
  },
  parameters: {
    docs: {
      codePanel: true,
      source: { language: "javascript" },
    },
  },
};

export const TwoByTwo = {
  render: Template,
  args: {
    plots: [
      {
        row: 0,
        column: 0,
        data: scatterData,
        type: PlotType.SCATTERPLOT,
        config: {
          title: "Scatter",
          axis: { x: { title: "X" }, y: { title: "Y" } },
        },
      },
      {
        row: 0,
        column: 1,
        data: lineDataTemporal,
        type: PlotType.LINEPLOT,
        config: {
          title: "Line (Temporal X)",
          axis: { x: { title: "Date" }, y: { title: "Value" } },
        },
      },
      {
        row: 1,
        column: 0,
        data: columnData,
        type: PlotType.COLUMNPLOT,
        config: {
          title: "Column",
          axis: { x: { title: "Category" }, y: { title: "Value" } },
        },
      },
      {
        row: 1,
        column: 1,
        data: barcodeData,
        type: PlotType.BARCODEPLOT,
        config: {
          title: "Barcode",
          axis: { x: { title: "Position" }, y: { display: false } },
        },
      },
    ],
    config: {
      width: 900,
      height: 550,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      grid: {
        rows: 2,
        columns: 2,
      },
    },
    style: defaultStyle,
  },
};
