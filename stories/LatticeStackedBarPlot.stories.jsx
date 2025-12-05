import React, { useEffect } from "react";
import { plot } from "../src/libs/LatticeLib.js";
import { PlotType } from "../src/utils/constants.js";

const sampleData = [
  { y: "Sample A", x: 30, series: "Group 1" },
  { y: "Sample A", x: 20, series: "Group 2" },
  { y: "Sample A", x: 10, series: "Group 3" },

  { y: "Sample B", x: 40, series: "Group 1" },
  { y: "Sample B", x: 15, series: "Group 2" },
  { y: "Sample B", x: 25, series: "Group 3" },

  { y: "Sample C", x: 10, series: "Group 1" },
  { y: "Sample C", x: 30, series: "Group 2" },
  { y: "Sample C", x: 35, series: "Group 3" },
];

const StackedBarPlot = ({ width, height, showYAxis, showXAxis }) => {
  const containerId = "stackedbarplot-container";

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const config = {
      width,
      height,
      padding: { top: 20, right: 40, bottom: 50, left: 80 },
      axis: {
        x: {
          title: "Value",
          display: showXAxis,
        },
        y: {
          title: "Sample",
          display: showYAxis,
        },
      },
      // required for stacked plots
      series: [
        { name: "Group 1", color: "#1f77b4" },
        { name: "Group 2", color: "#ff7f0e" },
        { name: "Group 3", color: "#2ca02c" },
      ],
    };

    plot(sampleData, PlotType.STACKEDBAR, containerId, config);
  }, [width, height, showYAxis, showXAxis]);

  return (
    <div
      id={containerId}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default {
  title: "Lattice/StackedBarPlot",
  component: StackedBarPlot,
  argTypes: {
    width: {
      control: { type: "number" },
    },
    height: {
      control: { type: "number" },
    },
    showYAxis: {
      control: { type: "boolean" },
      description: "Toggle Y axis visibility",
    },
    showXAxis: {
      control: { type: "boolean" },
      description: "Toggle X axis visibility",
    },
  },
};

export const BasicStackedBarPlot = {
  parameters: {
    docs: {
      codePanel: true,
      source: { language: "javascript" },
    },
  },
  args: {
    width: 800,
    height: 300,
    showXAxis: false,
    showYAxis: false,
  },
};
