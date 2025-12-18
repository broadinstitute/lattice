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

export const TilesWithSparklines = {
  render: () => {
    const makeSpark = (seed, points = 24) => {
      const rng = d3.randomLcg(seed + 1);
      const noise = d3.randomNormal.source(rng)(0, 0.35);
      const phase = ((seed % 97) / 97) * Math.PI * 2;
      const amp = 1.8 + (seed % 5) * 0.25;
      const trend = ((seed % 3) - 1) * 0.08;
      const baseline = 10 + (seed % 10) * 0.25;
      return Array.from({ length: points }, (_, i) => {
        const t = points === 1 ? 0 : i / (points - 1);
        const y =
          baseline +
          trend * i +
          amp * Math.sin(t * Math.PI * 2 + phase) +
          noise();
        return { x: i, y };
      });
    };

    const tiles = [
      { label: "CPU", unit: "%", seed: 1, value: 62.4, delta: +3.1 },
      { label: "Memory", unit: "GB", seed: 2, value: 14.2, delta: -1.8 },
      { label: "Latency", unit: "ms", seed: 3, value: 182, delta: +12.6 },
      { label: "Errors", unit: "%", seed: 4, value: 0.34, delta: -0.05 },
      { label: "Requests", unit: "k/min", seed: 5, value: 8.1, delta: +0.7 },
      { label: "Queue", unit: "", seed: 6, value: 23, delta: +5 },
      { label: "Disk", unit: "%", seed: 7, value: 71.9, delta: +0.9 },
      { label: "Cache hit", unit: "%", seed: 8, value: 93.1, delta: -0.4 },
    ];

    const Spark = ({ seed, color }) => (
      <LatticePlot
        data={makeSpark(seed)}
        type={PlotType.LINEPLOT}
        config={{
          width: 140,
          height: 28,
          padding: { top: 2, right: 2, bottom: 2, left: 2 },
          animate: false,
          color,
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
        style={{ display: "block" }}
      />
    );

    return (
      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {tiles.map((t, i) => {
            const deltaGood = t.delta <= 0;
            const deltaColor = deltaGood ? "#12b886" : "#fa5252";
            const lineColor = deltaGood ? "#15aabf" : "#fa5252";
            const deltaText = `${t.delta > 0 ? "+" : ""}${t.delta}`;
            return (
              <div
                key={i}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 12,
                  background: "white",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ fontSize: 12, color: "#666" }}>{t.label}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: deltaColor,
                      border: `1px solid ${deltaColor}33`,
                      background: `${deltaColor}14`,
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {deltaText}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 650,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {t.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>{t.unit}</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Spark seed={t.seed} color={lineColor} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

export const TableWithInlineMicroCharts = {
  render: () => {
    const makeTrend = (seed, points = 20) => {
      const rng = d3.randomLcg(seed + 1);
      const noise = d3.randomNormal.source(rng)(0, 0.25);
      const phase = ((seed % 97) / 97) * Math.PI * 2;
      const amp = 1.6 + (seed % 5) * 0.22;
      const trend = ((seed % 3) - 1) * 0.1;
      const baseline = 8 + (seed % 10) * 0.35;
      return Array.from({ length: points }, (_, i) => {
        const t = points === 1 ? 0 : i / (points - 1);
        const y =
          baseline +
          trend * i +
          amp * Math.sin(t * Math.PI * 2 + phase) +
          noise();
        return { x: i, y };
      });
    };

    const rows = Array.from({ length: 8 }, (_, i) => {
      const trend = makeTrend(i + 2);
      const last = trend[trend.length - 1].y;
      const bars = Array.from({ length: 5 }, (_, j) => ({
        x: `T-${4 - j}`,
        y: Math.max(
          0,
          (last * 0.25 + j * 0.35 + (i % 3) * 0.25) * (0.85 + (j % 2) * 0.12)
        ),
        c: "#4c6ef5",
      }));
      const donut = [
        { category: "A", value: 30 + (i % 4) * 8 },
        { category: "B", value: 45 - (i % 3) * 6 },
        { category: "C", value: 25 + (i % 5) * 3 },
      ];
      return {
        name: `Service ${String.fromCharCode(65 + i)}`,
        trend,
        bars,
        donut,
      };
    });

    const cellStyle = {
      padding: "10px 12px",
      borderBottom: "1px solid #f0f0f0",
      verticalAlign: "middle",
    };

    const headerStyle = {
      ...cellStyle,
      textAlign: "left",
      fontWeight: 600,
      color: "#666",
    };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>
          Inline micro-charts inside a table
        </div>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th
                  style={{
                    ...headerStyle,
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    ...headerStyle,
                  }}
                >
                  Trend
                </th>
                <th
                  style={{
                    ...headerStyle,
                  }}
                >
                  Last 5
                </th>
                <th
                  style={{
                    ...headerStyle,
                  }}
                >
                  Mix
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...cellStyle, fontSize: 13 }}>{r.name}</td>
                  <td style={cellStyle}>
                    <LatticePlot
                      data={r.trend}
                      type={PlotType.LINEPLOT}
                      config={{
                        width: 140,
                        height: 26,
                        padding: { top: 2, right: 2, bottom: 2, left: 2 },
                        animate: false,
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
                      style={{ display: "block" }}
                    />
                  </td>
                  <td style={cellStyle}>
                    <LatticePlot
                      data={r.bars}
                      type={PlotType.COLUMNPLOT}
                      config={{
                        width: 90,
                        height: 26,
                        padding: { top: 2, right: 2, bottom: 2, left: 2 },
                        animate: false,
                        tooltip: { enabled: false },
                        axis: {
                          x: {
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
                      style={{ display: "block" }}
                    />
                  </td>
                  <td style={cellStyle}>
                    <LatticePlot
                      data={r.donut}
                      type={PlotType.DONUT}
                      config={{
                        width: 30,
                        height: 30,
                        padding: { top: 1, right: 1, bottom: 1, left: 1 },
                        tooltip: { enabled: false },
                        showLabels: false,
                        innerRadiusRatio: 0.65,
                        categoryAccessor: (d) => d.category,
                        valueAccessor: (d) => d.value,
                      }}
                      style={{ display: "block" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
