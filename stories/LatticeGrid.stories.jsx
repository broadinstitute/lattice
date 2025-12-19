import React from "react";
import { LatticeGrid } from "../src/components/LatticeGrid";
import { PlotType } from "../src/utils/constants";
import * as d3 from "d3";
import {
  barcodeData,
  columnData,
  lineDataTemporal,
  makeTemporalLineData,
  makeTemporalLineDataWithDelta,
  scatterData,
} from "./fixtures/plotData";

const Template = (args) => <LatticeGrid {...args} />;
const defaultStyle = { border: "1px solid #eee" };

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
  name: "Layouts/Two By Two",
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

export const BeforeAfterSmallMultiples = {
  name: "Small Multiples/Before vs After",
  render: Template,
  args: {
    plots: (() => {
      const cohorts = [
        { name: "Cohort A", seed: 11, delta: -0.6 },
        { name: "Cohort B", seed: 12, delta: +0.8 },
        { name: "Cohort C", seed: 13, delta: -1.1 },
        { name: "Cohort D", seed: 14, delta: +1.5 },
        { name: "Cohort E", seed: 15, delta: -0.2 },
        { name: "Cohort F", seed: 16, delta: +0.4 },
      ];

      const plots = [];
      cohorts.forEach((c, row) => {
        const beforeColor = "#4c6ef5";
        const afterColor = "#fa5252";

        plots.push({
          row,
          column: 0,
          data: makeTemporalLineDataWithDelta(c.seed, 18, 0),
          type: PlotType.LINEPLOT,
          config: {
            animate: false,
            color: beforeColor,
            title: row === 0 ? "Before" : undefined,
            padding: { top: 6, right: 6, bottom: 6, left: 34 },
            tooltip: { enabled: true },
            axis: {
              x: { display: false },
              y: { hideTitle: true, ticks: 2 },
            },
          },
        });

        plots.push({
          row,
          column: 1,
          data: makeTemporalLineDataWithDelta(c.seed, 18, c.delta),
          type: PlotType.LINEPLOT,
          config: {
            animate: false,
            color: afterColor,
            title: row === 0 ? "After" : undefined,
            padding: { top: 6, right: 6, bottom: 6, left: 10 },
            tooltip: { enabled: true },
            axis: {
              x: { display: false },
              y: { display: false },
            },
          },
        });
      });
      return plots;
    })(),
    config: {
      animate: false,
      width: 500,
      height: 400,
      padding: { top: 24, right: 12, bottom: 12, left: 12 },
      grid: {
        rows: 6,
        columns: 2,
        rowSizes: Array.from({ length: 6 }, (_, row) => ({ row, size: 1 / 6 })),
        columnSizes: [
          { column: 0, size: 0.5 },
          { column: 1, size: 0.5 },
        ],
      },
    },
    style: defaultStyle,
  },
};

export const LineSmallMultiples = {
  name: "Small Multiples/Line Grid",
  render: Template,
  args: {
    plots: (() => {
      const rows = 15;
      const columns = 10;
      const plots = [];
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const seed = row * columns + column;
          const showYAxis = true;
          const xT = columns === 1 ? 0 : column / (columns - 1);
          const yT = rows === 1 ? 0 : row / (rows - 1);
          const color = d3.hsl(360 * xT, 0.9, 0.25 + 0.5 * yT).formatHex();
          plots.push({
            row,
            column,
            data: makeTemporalLineData(seed),
            type: PlotType.LINEPLOT,
            config: {
              animate: false,
              color,
              padding: { top: 2, right: 2, bottom: 2, left: 28 },
              tooltip: { enabled: true },
              axis: {
                x: { display: false },
                y: showYAxis
                  ? { hideTitle: true, ticks: 2 }
                  : { display: false },
              },
            },
          });
        }
      }
      return plots;
    })(),
    config: {
      animate: false,
      width: 600,
      height: 400,
      padding: { top: 10, right: 10, bottom: 10, left: 10 },
      grid: {
        rows: 15,
        columns: 10,
      },
    },
    style: defaultStyle,
  },
};

export const CustomRowAndColumnSizes = {
  name: "Layouts/Custom Row + Column Sizes",
  render: Template,
  args: {
    plots: [
      {
        row: 0,
        column: 0,
        data: scatterData,
        type: PlotType.SCATTERPLOT,
        config: {
          title: "Narrow Cell (0,0)",
          axis: { x: { title: "X" }, y: { title: "Y" } },
        },
      },
      {
        row: 0,
        column: 1,
        data: lineDataTemporal,
        type: PlotType.LINEPLOT,
        config: {
          title: "Big Cell (0,1)",
          axis: { x: { title: "Date" }, y: { title: "Value" } },
        },
      },
      {
        row: 1,
        column: 0,
        data: barcodeData,
        type: PlotType.BARCODEPLOT,
        config: {
          title: "Small Cell (1,0)",
          axis: { x: { title: "Position" }, y: { display: false } },
        },
      },
      {
        row: 1,
        column: 1,
        data: columnData,
        type: PlotType.COLUMNPLOT,
        config: {
          title: "Wide Cell (1,1)",
          axis: { x: { title: "Category" }, y: { title: "Value" } },
        },
      },
    ],
    config: {
      width: 900,
      height: 550,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      grid: {
        rowSizes: [
          { row: 0, size: 0.65 },
          { row: 1, size: 0.35 },
        ],
        columnSizes: [
          { column: 0, size: 0.3 },
          { column: 1, size: 0.7 },
        ],
      },
    },
    style: defaultStyle,
  },
};

export const SparseGrid = {
  name: "Layouts/Sparse Grid",
  render: Template,
  args: {
    plots: [
      {
        row: 0,
        column: 0,
        data: makeTemporalLineData(2, 24),
        type: PlotType.AREAPLOT,
        config: {
          title: "Area",
          axis: {
            x: { hideLabels: true, hideTitle: true },
            y: { hideLabels: true, hideTitle: true },
          },
        },
      },
      {
        row: 0,
        column: 5,
        data: barcodeData,
        type: PlotType.BARCODEPLOT,
        config: {
          title: "Barcode",
          axis: {
            x: { hideLabels: true, hideTitle: true },
            y: { display: false },
          },
        },
      },
      {
        row: 2,
        column: 2,
        data: scatterData,
        type: PlotType.SCATTERPLOT,
        config: {
          title: "Scatter",
          axis: {
            x: { hideLabels: true, hideTitle: true },
            y: { hideLabels: true, hideTitle: true },
          },
        },
      },
      {
        row: 4,
        column: 3,
        data: columnData,
        type: PlotType.COLUMNPLOT,
        config: {
          title: "Column",
          axis: {
            x: { hideLabels: true, hideTitle: true },
            y: { hideLabels: true, hideTitle: true },
          },
        },
      },
    ],
    config: {
      width: 900,
      height: 600,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      grid: {
        rows: 5,
        columns: 6,
      },
    },
    style: defaultStyle,
  },
};
