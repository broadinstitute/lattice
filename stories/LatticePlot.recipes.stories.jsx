import React from "react";
import { LatticePlot } from "../src/components/LatticePlot";
import * as d3 from "d3";
import { PlotOrientation, PlotType, ScaleType } from "../src/utils/constants";

export default {
  title: "Lattice/LatticePlot/Recipes",
  component: LatticePlot,
  parameters: {
    docs: {
      codePanel: true,
      source: { language: "javascript" },
    },
  },
};

export const InlineSparkline = {
  name: "Inline/Sparkline",
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
  name: "Cards/Tiles With Sparklines",
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
  name: "Table/Inline Micro-Charts",
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
          (last * 0.25 + j * 0.35 + (i % 3) * 0.25) * (0.85 + (j % 2) * 0.12),
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
      <>
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
      </>
    );
  },
};

export const DivergingBarChart = {
  name: "Composition/Diverging Bar Chart",
  render: () => {
    const categories = [
      "Apples",
      "Bananas",
      "Cherries",
      "Dates",
      "Elderberries",
    ];
    const leftValues = [30, 12, 45, 22, 35];
    const rightValues = [18, 40, 25, 38, 10];
    const maxValue = Math.max(...leftValues, ...rightValues);

    const leftData = categories.map((cat, i) => ({
      x: leftValues[i],
      y: cat,
      c: "#4c6ef5",
    }));
    const rightData = categories.map((cat, i) => ({
      x: rightValues[i],
      y: cat,
      c: "#fa5252",
    }));

    const padTop = 30;
    const padBottom = 40;
    const plotHeight = 260;
    const labelWidth = 100;
    const innerHeight = plotHeight - padTop - padBottom;

    const bandPadding = 0.15;
    const n = categories.length;
    const step = innerHeight / n;
    const bandwidth = step * (1 - bandPadding);

    const axisConfig = {
      x: { title: "Value", max: maxValue },
      y: {
        hideLabels: true,
        hideTitle: true,
        hideTicks: true,
        hideAxis: true,
      },
    };

    return (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <LatticePlot
              data={leftData}
              type={PlotType.BARPLOT}
              config={{
                height: plotHeight,
                orientation: PlotOrientation.NEGATIVE,
                showLabels: true,
                padding: { top: padTop, right: 0, bottom: padBottom, left: 40 },
                axis: axisConfig,
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              width: labelWidth,
              flexShrink: 0,
              height: plotHeight,
            }}
          >
            {categories.map((cat, i) => (
              <div
                key={cat}
                style={{
                  position: "absolute",
                  top: padTop + step * i + bandwidth / 2,
                  left: 0,
                  width: labelWidth,
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#333",
                  transform: "translateY(-50%)",
                }}
              >
                {cat}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <LatticePlot
              data={rightData}
              type={PlotType.BARPLOT}
              config={{
                height: plotHeight,
                orientation: PlotOrientation.POSITIVE,
                showLabels: true,
                padding: { top: padTop, right: 40, bottom: padBottom, left: 0 },
                axis: axisConfig,
              }}
            />
          </div>
        </div>
      </div>
    );
  },
};
