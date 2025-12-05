import React, { useEffect } from "react";
import { plot } from "../src/libs/LatticeLib.js";
import { PlotType } from "../src/utils/constants.js";

const sampleData = [
  { x: 1, y: 2, group: "A" },
  { x: 2, y: 3, group: "A" },
  { x: 3, y: 1, group: "B" },
];

export default {
  title: "Lattice/Scatterplot",
};

export const BasicScatterplot = () => {
  const containerId = "scatterplot-container";

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // clear old render on hot reload
    container.innerHTML = "";

    plot(sampleData, PlotType.SCATTERPLOT, containerId, {
      x: "x",
      y: "y",
      color: "group",
      xLabel: "X axis",
      yLabel: "Y axis",
    });
  }, []);

  return <div id={containerId} style={{ width: "800px", height: "500px" }} />;
};
