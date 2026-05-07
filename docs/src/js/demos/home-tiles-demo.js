import * as LatticeLib from "../../../../src/libs/LatticeLib.js";
import * as RandomDataLib from "../../../../src/libs/RandomDataLib.js";

const TILE_W = 320;
const TILE_H = 240;

const LATTICE_BLUE = "#96d0cb";
const LATTICE_BLUE_DARK = "#6bafa9";
const PALETTE = [
  LATTICE_BLUE,
  "#666666",
  "#c28b9a",
  "#cdaf70",
  "#7092a5",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const NO_TOOLTIP = { enabled: false };
const NO_AXES = {
  x: { display: false, title: "" },
  y: { display: false, title: "" },
};
const TIGHT = { top: 2, right: 2, bottom: 2, left: 2 };

/**
 * The lattice library renders SVGs with fixed width/height. To let CSS scale
 * tiles to their container size, we replace those attributes with a viewBox.
 */
function makeTileSvgResponsive(rootId) {
  const svg = document.querySelector(`#${rootId} svg`);
  if (!svg) return;
  svg.setAttribute("viewBox", `0 0 ${TILE_W} ${TILE_H}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
}

function clear(rootId) {
  const el = document.getElementById(rootId);
  if (el) el.innerHTML = "";
}

function getBins(data, bins = 10) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  if (max === min) {
    return [{ bottom: min, top: min, bin: min, count: data.length }];
  }
  const width = (max - min) / bins;
  const hist = [];
  for (let i = 0; i < bins; i++) {
    const bottom = min + i * width;
    hist.push({ bottom, top: bottom + width, bin: bottom + width / 2, count: 0 });
  }
  data.forEach((d) => {
    let i = Math.min(Math.floor((d - min) / width), bins - 1);
    if (i < 0) i = 0;
    hist[i].count += 1;
  });
  return hist;
}

/** Tile 1: scatter + marginal histograms. */
export function renderScatterTile(rootId = "tile-scatter") {
  clear(rootId);

  const data = RandomDataLib.createRandomNumericalData(60, "randomNormal", PALETTE[1]);
  const xbins = getBins(data.map((d) => d.x), 14);
  const ybins = getBins(data.map((d) => d.y), 14);

  const plots = [
    {
      row: 0,
      column: 0,
      data: xbins.map((d) => ({ x: d.bin, y: d.count, c: PALETTE[3] })),
      type: "columnplot",
      axis: NO_AXES,
      tooltip: NO_TOOLTIP,
      padding: TIGHT,
    },
    {
      row: 1,
      column: 0,
      data,
      type: "scatterplot",
      axis: NO_AXES,
      tooltip: NO_TOOLTIP,
      padding: TIGHT,
    },
    {
      row: 1,
      column: 1,
      data: ybins.map((d) => ({ x: d.count, y: d.bin, c: PALETTE[2] })).reverse(),
      type: "barplot",
      axis: NO_AXES,
      tooltip: NO_TOOLTIP,
      padding: TIGHT,
    },
  ];

  const grid = {
    rows: 2,
    columns: 2,
    rowSizes: [
      { row: 0, size: 0.22 },
      { row: 1, size: 0.78 },
    ],
    columnSizes: [
      { column: 0, size: 0.78 },
      { column: 1, size: 0.22 },
    ],
  };

  LatticeLib.lattice(plots, rootId, {
    width: TILE_W,
    height: TILE_H,
    grid,
    padding: { top: 4, right: 4, bottom: 4, left: 4 },
  });
  makeTileSvgResponsive(rootId);
}

/**
 * Generate trended y-values across N steps. Trend types are weighted toward
 * recognisable shapes so the small-multiple grid reads as "real" data instead
 * of noise.
 */
function trendedSeries(n) {
  if (n <= 1) return [{ x: 0, y: 0.5 }];
  const trends = ["rise", "fall", "hill", "valley", "wave", "step", "drift"];
  const trend = trends[Math.floor(Math.random() * trends.length)];
  const phase = Math.random() * Math.PI * 2;
  const noise = () => (Math.random() - 0.5) * 0.18;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1); // 0..1
    let y;
    switch (trend) {
      case "rise":
        y = 0.15 + 0.7 * t;
        break;
      case "fall":
        y = 0.85 - 0.7 * t;
        break;
      case "hill":
        y = 0.2 + 0.7 * Math.sin(Math.PI * t);
        break;
      case "valley":
        y = 0.9 - 0.7 * Math.sin(Math.PI * t);
        break;
      case "wave":
        y = 0.5 + 0.35 * Math.sin(Math.PI * 2 * t + phase);
        break;
      case "step":
        y = t < 0.45 ? 0.25 : 0.75;
        break;
      case "drift":
      default:
        y = 0.5 + 0.25 * (t - 0.5) * 2 + 0.1 * Math.sin(Math.PI * 3 * t + phase);
        break;
    }
    return { x: i, y: Math.max(0.02, Math.min(0.98, y + noise())) };
  });
}

/** Tile 2: 5×5 small multiple of mini line plots with trended data. */
export function renderSmallMultipleTile(rootId = "tile-small-multiple") {
  clear(rootId);

  const ROWS = 5;
  const COLS = 5;
  const N_POINTS = 16;
  const plots = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      plots.push({
        row: r,
        column: c,
        data: trendedSeries(N_POINTS),
        type: "lineplot",
        color: LATTICE_BLUE_DARK,
        axis: {
          x: { display: false, title: "", scaleType: "linear" },
          y: { display: false, title: "", scaleType: "linear" },
        },
        tooltip: NO_TOOLTIP,
        padding: { top: 2, right: 2, bottom: 2, left: 2 },
      });
    }
  }

  LatticeLib.lattice(plots, rootId, {
    width: TILE_W,
    height: TILE_H,
    padding: { top: 4, right: 4, bottom: 4, left: 4 },
  });
  makeTileSvgResponsive(rootId);
}

/**
 * Tile 3: comut-style abstraction.
 *
 * Layout (3 rows × 2 columns):
 *   ┌──────────────────────┬────┐
 *   │ stacked column (top) │    │   row 0  (h=0.18)
 *   ├──────────────────────┼────┤
 *   │                      │    │
 *   │   heatmap (large)    │ ▌  │   row 1  (h=0.62)
 *   │                      │    │
 *   ├──────────────────────┼────┤
 *   │ annotation tracks    │    │   row 2  (h=0.20)
 *   └──────────────────────┴────┘
 *      col 0 (w=0.85)       col 1 (w=0.15)
 */
export function renderComutTile(rootId = "tile-comut") {
  clear(rootId);

  const N_COLS = 22;
  const N_ROWS = 8;
  const samples = Array.from({ length: N_COLS }, (_, i) => `s${i}`);
  const features = Array.from({ length: N_ROWS }, (_, i) => `f${i}`);

  // Top: stacked column plot (e.g., mutation burden by category)
  const stackedSeriesCount = 3;
  const seriesInfo = RandomDataLib.createSeriesColorInfo(
    stackedSeriesCount,
    [PALETTE[2], PALETTE[3], PALETTE[4]]
  );
  const stackedData = RandomDataLib.createRandomStackedCategoricalData(
    N_COLS,
    stackedSeriesCount,
    "vertical",
    5
  );

  // Center: heatmap (samples × features)
  // Heatmap renderer reads `d.c` for the color value; use a teal-ish palette
  // by interpolating from a darker accent to white.
  const heatmapMax = 12;
  const heatmapData = [];
  for (let r = 0; r < N_ROWS; r++) {
    for (let c = 0; c < N_COLS; c++) {
      heatmapData.push({
        x: samples[c],
        y: features[r],
        c: Math.floor(Math.random() * heatmapMax),
      });
    }
  }
  const heatmapColors = RandomDataLib.createContinuousColors(heatmapMax, "Lattice");

  // Right: side annotation track (1 col × N_ROWS) — categorical, complementary palette
  const sideCategories = ["A", "B", "C"];
  const sidePalette = [PALETTE[2], PALETTE[3], PALETTE[4]]; // mauve / mustard / steel-blue
  const sideColors = {
    domain: sideCategories,
    range: sidePalette,
  };
  const sideData = features.map((f) => ({
    x: "side",
    y: f,
    c: sideCategories[Math.floor(Math.random() * sideCategories.length)],
  }));

  // Bottom: 2 categorical annotation tracks (2 rows × N_COLS), distinct palette
  const bottomCategories = ["I", "II", "III", "IV"];
  const bottomPalette = [PALETTE[5], PALETTE[6], PALETTE[8], PALETTE[9]]; // brown / pink / olive / cyan
  const bottomColors = {
    domain: bottomCategories,
    range: bottomPalette,
  };
  const bottomTracks = ["t1", "t2"];
  const bottomData = [];
  for (const t of bottomTracks) {
    for (const s of samples) {
      bottomData.push({
        x: s,
        y: t,
        c: bottomCategories[Math.floor(Math.random() * bottomCategories.length)],
      });
    }
  }

  const plots = [
    {
      row: 0,
      column: 0,
      data: stackedData,
      type: "stackedcolumnplot",
      series: seriesInfo,
      axis: NO_AXES,
      tooltip: NO_TOOLTIP,
      padding: TIGHT,
    },
    {
      row: 1,
      column: 0,
      data: heatmapData,
      type: "heatmap",
      axis: {
        x: { display: false, title: "" },
        y: { display: false, title: "" },
        c: { domain: heatmapColors.domain, interpolator: heatmapColors.interpolator },
      },
      tooltip: NO_TOOLTIP,
      padding: TIGHT,
    },
    {
      row: 1,
      column: 1,
      data: sideData,
      type: "categoricalheatmap",
      axis: {
        x: { display: false, title: "" },
        y: { display: false, title: "" },
        c: { domain: sideColors.domain, range: sideColors.range },
      },
      tooltip: NO_TOOLTIP,
      padding: TIGHT,
    },
    {
      row: 2,
      column: 0,
      data: bottomData,
      type: "categoricalheatmap",
      axis: {
        x: { display: false, title: "" },
        y: { display: false, title: "" },
        c: { domain: bottomColors.domain, range: bottomColors.range },
      },
      tooltip: NO_TOOLTIP,
      padding: TIGHT,
    },
  ];

  const grid = {
    rows: 3,
    columns: 2,
    rowSizes: [
      { row: 0, size: 0.18 },
      { row: 1, size: 0.62 },
      { row: 2, size: 0.2 },
    ],
    columnSizes: [
      { column: 0, size: 0.85 },
      { column: 1, size: 0.15 },
    ],
  };

  LatticeLib.lattice(plots, rootId, {
    width: TILE_W,
    height: TILE_H,
    grid,
    padding: { top: 4, right: 4, bottom: 4, left: 4 },
  });
  makeTileSvgResponsive(rootId);
}

/**
 * Tile 4: a 2×2 sampler of basic chart types (donut, petal, area, barcode).
 * Renders four small standalone plots into separate sub-divs since donut and
 * petal aren't part of the lattice grid plot types.
 */
export function renderChartTypesTile(rootId = "tile-chart-types") {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = "";

  const cellW = TILE_W / 2;
  const cellH = TILE_H / 2;
  const cells = ["ct-donut", "ct-petal", "ct-area", "ct-barcode"];

  // Build a 2×2 wrapper with positioned sub-divs
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    width: 100%;
    height: 100%;
  `;
  for (const id of cells) {
    const cell = document.createElement("div");
    cell.id = id;
    cell.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    `;
    wrap.appendChild(cell);
  }
  root.appendChild(wrap);

  // Donut
  const donutData = [
    { category: "a", value: 30 },
    { category: "b", value: 20 },
    { category: "c", value: 15 },
    { category: "d", value: 35 },
  ];
  LatticeLib.plot(donutData, "donut", "ct-donut", {
    width: cellW,
    height: cellH,
    showLabels: false,
    innerRadiusRatio: 0.55,
    categoryAccessor: (d) => d.category,
    valueAccessor: (d) => d.value,
    tooltip: NO_TOOLTIP,
    padding: { top: 6, right: 6, bottom: 6, left: 6 },
  });

  // Petal
  const petalData = [
    { label: "a", value: 1.5, width: 0.3, color: PALETTE[2] },
    { label: "b", value: -1.2, width: 1.0, color: PALETTE[3] },
    { label: "c", value: 1.8, width: 0.9, color: PALETTE[4] },
    { label: "d", value: -0.5, width: 0.15, color: PALETTE[5] },
    { label: "e", value: 0.8, width: 0.5, color: PALETTE[0] },
  ];
  LatticeLib.plot(petalData, "petalplot", "ct-petal", {
    width: cellW,
    height: cellH,
    valueDomain: [-2, 2],
    gridlineValues: [-1, 0, 1],
    valueAccessor: (d) => d.value,
    widthAccessor: (d) => d.width,
    labelAccessor: (d) => d.label,
    colorAccessor: (d) => d.color,
    showLabels: false,
    showGridlineLabels: false,
    tooltip: NO_TOOLTIP,
    padding: { top: 6, right: 6, bottom: 6, left: 6 },
  });

  // Area
  const areaData = trendedSeries(20);
  LatticeLib.plot(areaData, "areaplot", "ct-area", {
    width: cellW,
    height: cellH,
    axis: {
      x: { display: false, title: "", scaleType: "linear" },
      y: { display: false, title: "", scaleType: "linear" },
    },
    tooltip: NO_TOOLTIP,
    padding: { top: 6, right: 6, bottom: 6, left: 6 },
  });

  // Barcode
  const barcodeData = Array.from({ length: 30 }, () => ({
    x: Math.random(),
    y: 0,
  }));
  LatticeLib.plot(barcodeData, "barcodeplot", "ct-barcode", {
    width: cellW,
    height: cellH,
    axis: NO_AXES,
    tooltip: NO_TOOLTIP,
    padding: { top: 6, right: 6, bottom: 6, left: 6 },
  });

  // Make each sub-svg scale to its cell
  for (const id of cells) {
    const svg = document.querySelector(`#${id} svg`);
    if (!svg) continue;
    svg.setAttribute("viewBox", `0 0 ${cellW} ${cellH}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.style.width = "100%";
    svg.style.height = "100%";
  }
}

export function renderHomeTiles() {
  renderScatterTile();
  renderSmallMultipleTile();
  renderComutTile();
  renderChartTypesTile();
}
