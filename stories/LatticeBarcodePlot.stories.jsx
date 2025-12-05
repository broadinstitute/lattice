// stories/BarcodePlot.stories.jsx
import React, { useEffect } from "react";
import { plot } from "../src/libs/LatticeLib.js";
import { PlotType } from "../src/utils/constants.js";

const sampleData = [
  { x: 0.1, y: 1, group: "A" },
  { x: 0.3, y: 1, group: "A" },
  { x: 0.5, y: 1, group: "B" },
  { x: 0.7, y: 1, group: "A" },
  { x: 0.9, y: 1, group: "B" },
];

// 1) Turn your visualization into a React component that takes props (args)
const BarcodePlot = ({ width, height, xTitle, showYAxis }) => {
  const containerId = "barcodeplot-container";

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const config = {
      width,
      height,
      padding: { top: 20, bottom: 50 },
      axis: {
        x: {
          title: xTitle,
        },
        y: { display: showYAxis },
      },
    };

    plot(sampleData, PlotType.BARCODEPLOT, containerId, config);
  }, [width, height, xTitle, showYAxis]); // rerender if args change

  return (
    <div
      id={containerId}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

// for the controls on the page
export default {
  title: "Lattice/BarcodePlot",
  component: BarcodePlot,
  argTypes: {
    width: {
      control: { type: "number" },
      description: "Width of the plot container in pixels",
    },
    height: {
      control: { type: "number" },
      description: "Height of the plot container in pixels",
    },
    xTitle: {
      control: { type: "text" },
      description: "Label for the X axis",
    },
    showYAxis: {
      control: { type: "boolean" },
      description: "Toggle Y axis visibility",
    },
  },
};

export const BasicBarcodePlot = {
  // default args
  args: {
    width: 800,
    height: 100,
    xTitle: "x value",
    showYAxis: false,
  },
};
