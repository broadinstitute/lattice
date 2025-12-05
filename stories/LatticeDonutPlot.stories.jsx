import React, { useEffect } from "react";
import { plot } from "../src/libs/LatticeLib.js";
import { PlotType } from "../src/utils/constants.js";

const sampleData = [
  { category: "Group 1", value: 30 },
  { category: "Group 2", value: 20 },
  { category: "Group 3", value: 10 },
  { category: "Group 4", value: 40 },
];

/**
 * Code snippet shown in Storybook.
 */
const getCodeSnippet = ({ width, height, showLabels, innerRadiusRatio }) => {
  return `import { plot } from "../src/libs/LatticeLib.js";
import { PlotType } from "../src/utils/constants.js";

const data = ${JSON.stringify(sampleData)}

plot(data, PlotType.DONUT, "donutplot-container", {
  width: ${width},
  height: ${height},
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  title: "Donut Plot Example",
  data,
  showLabels: ${showLabels},
  innerRadiusRatio: ${innerRadiusRatio},
  categoryAccessor: (d) => d.category,
  valueAccessor: (d) => d.value,
});`;
};

/**
 * Playground component used by the story.
 * - Left: actual DonutPlot rendered via DonutPlot.render(config)
 * - Right: live-updating code snippet based on current args
 */
const DonutPlotPlayground = (args) => {
  const { width, height, showLabels, innerRadiusRatio } = args;
  const containerId = "donutplot-container";

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // clear old render on hot reload / re-renders
    container.innerHTML = "";

    const config = {
      title: "Donut Plot Example",
      width,
      height,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },

      // donut-specific options
      showLabels,
      innerRadiusRatio,

      // accessors expected by DonutPlot.render
      categoryAccessor: (d) => d.category,
      valueAccessor: (d) => d.value,
    };

    // DonutPlot.render(config);
    plot(sampleData, PlotType.DONUT, containerId, config);
  }, [width, height, showLabels, innerRadiusRatio]);

  const code = getCodeSnippet(args);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1.5fr",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <div
        id={containerId}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid #eee",
        }}
      />
      <pre
        style={{
          margin: 0,
          padding: "0.75rem",
          background: "#0b1020",
          color: "#f6f8fa",
          fontSize: "12px",
          borderRadius: "4px",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default {
  title: "Lattice/DonutPlot",
  component: DonutPlotPlayground,
  argTypes: {
    width: {
      control: { type: "number" },
    },
    height: {
      control: { type: "number" },
    },
    showLabels: {
      control: { type: "boolean" },
      description: "Toggle slice labels",
    },
    innerRadiusRatio: {
      control: { type: "range", min: 0.3, max: 0.9, step: 0.05 },
      description: "Inner radius as a fraction of outer radius",
    },
  },
};

/**
 * CSF3 story object.
 * Storybook will pass args into DonutPlotPlayground.
 */
export const BasicDonutPlot = {
  render: (args) => <DonutPlotPlayground {...args} />,
  args: {
    width: 300,
    height: 300,
    showLabels: true,
    innerRadiusRatio: 0.6,
  },
};
