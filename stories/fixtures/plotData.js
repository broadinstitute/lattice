import * as d3 from "d3";

export const scatterData = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 3 },
  { x: 4, y: 7 },
  { x: 5, y: 5 },
];

export const donutData = [
  { category: "Group A", value: 30 },
  { category: "Group B", value: 20 },
  { category: "Group C", value: 15 },
  { category: "Group D", value: 35 },
];

export const scatterDataColored = [
  { x: 1, y: 2, c: "#4c6ef5", r: 2 },
  { x: 2, y: 4, c: "#15aabf", r: 4 },
  { x: 3, y: 3, c: "#12b886", r: 3 },
  { x: 4, y: 7, c: "#fab005", r: 5 },
  { x: 5, y: 5, c: "#fa5252", r: 4 },
];

export const lineDataTemporal = [
  { x: new Date(2024, 0, 1), y: 10 },
  { x: new Date(2024, 1, 1), y: 15 },
  { x: new Date(2024, 2, 1), y: 12 },
  { x: new Date(2024, 3, 1), y: 20 },
  { x: new Date(2024, 4, 1), y: 18 },
];

export const areaDataTemporal = [
  { x: new Date(2024, 0, 1), y: 4 },
  { x: new Date(2024, 1, 1), y: 9 },
  { x: new Date(2024, 2, 1), y: 6 },
  { x: new Date(2024, 3, 1), y: 14 },
  { x: new Date(2024, 4, 1), y: 11 },
  { x: new Date(2024, 5, 1), y: 16 },
];

export const barcodeData = [
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

export const stackedColumnData = [
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

export const heatmapData = [
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

export const barData = [
  { x: 30, y: "Apples", c: "#4c6ef5" },
  { x: 20, y: "Bananas", c: "#15aabf" },
  { x: 45, y: "Cherries", c: "#12b886" },
  { x: 15, y: "Dates", c: "#fab005" },
  { x: 35, y: "Elderberries", c: "#fa5252" },
];

export const columnData = [
  { x: "A", y: 10, c: "#4c6ef5" },
  { x: "B", y: 25, c: "#15aabf" },
  { x: "C", y: 15, c: "#12b886" },
  { x: "D", y: 30, c: "#fab005" },
];

export const makeTemporalLineData = (seed = 0, points = 12) => {
  const start = new Date(2024, 0, 1);
  const rng = d3.randomLcg(seed + 1);
  const noise = d3.randomNormal.source(rng)(0, 0.4);

  const phase = ((seed % 97) / 97) * Math.PI * 2;
  const amp1 = 3.5 + (seed % 7) * 0.25;
  const amp2 = 1.4 + (seed % 5) * 0.2;
  const trend = ((seed % 3) - 1) * 0.15;
  const baseline = 10 + (seed % 10) * 0.6;

  return Array.from({ length: points }, (_, i) => {
    const x = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const t = points === 1 ? 0 : i / (points - 1);
    const w1 = Math.sin(t * Math.PI * 2 + phase);
    const w2 = Math.sin(t * Math.PI * 6 + phase * 0.7);
    const y = baseline + trend * i + amp1 * w1 + amp2 * w2 + noise();
    return { x, y };
  });
};

export const makeTemporalLineDataWithDelta = (
  seed = 0,
  points = 18,
  delta = 0,
) => {
  const start = new Date(2024, 0, 1);
  const rng = d3.randomLcg(seed + 1);
  const noise = d3.randomNormal.source(rng)(0, 0.35);
  const phase = ((seed % 97) / 97) * Math.PI * 2;
  const amp1 = 3.0 + (seed % 7) * 0.2;
  const amp2 = 1.2 + (seed % 5) * 0.15;
  const trend = ((seed % 3) - 1) * 0.12;
  const baseline = 10 + (seed % 10) * 0.45 + delta;

  return Array.from({ length: points }, (_, i) => {
    const x = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const t = points === 1 ? 0 : i / (points - 1);
    const w1 = Math.sin(t * Math.PI * 2 + phase);
    const w2 = Math.sin(t * Math.PI * 6 + phase * 0.7);
    const y = baseline + trend * i + amp1 * w1 + amp2 * w2 + noise();
    return { x, y };
  });
};
