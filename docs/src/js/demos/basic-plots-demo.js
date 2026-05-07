import * as LatticeLib from "../../../../src/libs/LatticeLib.js";
import * as RandomDataLib from "../../../../src/libs/RandomDataLib.js";

const latticeBlue = "#96d0cb";
const latticeColorScheme10 = [
  latticeBlue,
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

export function demoAreaPlot() {
  const id = "area-plot";
  const distri = "randomInt";
  const data = RandomDataLib.createRandomNumericalData(20, distri);
  // areaplot data input order matters for the area calculation -- sorting the random data beforehand
  data.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else return 0;
  });
  const config = {
    padding: { top: 20 },
    axis: {
      x: {
        title: "x value",
        scaleType: "linear",
      },
      y: {
        title: "y value",
      },
    },
  };
  let plot = LatticeLib.plot(data, "areaplot", id, config); // todo: more plot options demos

  return data;
}

export function demoBarcodePlot() {
  const id = "barcode-plot";
  const distri = "randomInt";
  const data = RandomDataLib.createRandomNumericalData(50, distri);
  const config = {
    height: 100,
    padding: { top: 20, bottom: 50 },
    axis: {
      x: {
        title: "x value",
      },
      y: { display: false },
    },
  };
  let plot = LatticeLib.plot(data, "barcodeplot", id, config); // todo: more plot options demos
  return data;
}

export function demoScatterPlot() {
  // scatterplot
  const id = "scatter-plot";
  const distri = "randomNormal";
  const data = RandomDataLib.createRandomNumericalData(
    200,
    distri,
    latticeBlue
  );

  const plotConfig = {
    padding: {
      top: 20,
    },
    axis: {
      y: { title: "y value", ticks: 5 },
      x: {
        title: "x value",
        ticks: 5,
      },
    },
  }; // todo: Y axis title isn't showing
  LatticeLib.plot(data, "scatterplot", id, plotConfig); // todo: more plot options demos
  return data;
}

export function demoBarPlot() {
  // bar plot
  const id = "bar-plot";
  const data = RandomDataLib.createRandomCategoricalData(
    20,
    "horizontal",
    5,
    latticeBlue
  );
  const plotConfig = {
    padding: { top: 20, bottom: 50 },
    axis: {
      x: {
        title: "value",
        ticks: 5,
      },
      y: {
        title: "",
      },
    },
  }; // todo: how to change the plot height
  let plot = LatticeLib.plot(data, "barplot", id, plotConfig); // todo: more plot options demos
  console.log(LatticeLib.getPlotOptions(plot));
}

export function demoCategoricalHeatmap() {
  const id = "cat-heatmap";
  const nCategories = 15;
  const nCols = 15;
  const nRows = 15;
  const colorsObj = RandomDataLib.createHeatmapColors(
    nCategories,
    "discrete",
    latticeColorScheme10
  );
  const data = RandomDataLib.createRandomHeatmapData(nRows, nCols, nCategories);
  const plotConfig = {
    padding: { top: 20 },
    axis: {
      x: {
        orientation: "bottom",
        textAngle: 90,
        title: "",
        textAnchor: "start",
      },
      y: {
        title: "",
      },
      c: { domain: colorsObj.domain, range: colorsObj.range },
    },
  };
  let plot = LatticeLib.plot(data, "categoricalheatmap", id, plotConfig);
  console.log(LatticeLib.getPlotOptions(plot));
}

export function demoColumnPlot() {
  // column plot
  const id = "column-plot";
  const data = RandomDataLib.createRandomCategoricalData(
    20,
    "vertical",
    5,
    latticeBlue
  ); // todo: how to rotate cateogy text labels
  const plotConfig = {
    padding: { top: 20, bottom: 50 },
    axis: {
      x: { title: "", textAngle: 90, textAnchor: "start" },
      y: { title: "value", ticks: 5 },
    },
  }; // todo: yAxis title not showing
  LatticeLib.plot(data, "columnplot", id, plotConfig); // todo: more plot options demos
}

export function demoHeatmap() {
  const id = "heatmap";
  const maxValue = 15;
  const nCols = 20;
  const nRows = 20;
  const data = RandomDataLib.createRandomHeatmapData(nRows, nCols, maxValue);
  const colorsObj = RandomDataLib.createContinuousColors(maxValue, "Lattice");
  console.info(colorsObj.interpolator);
  const plotConfig = {
    padding: { top: 20 },
    axis: {
      x: {
        title: "",
        orientation: "bottom",
        textAngle: 90,
        textAnchor: "start",
      },
      y: {
        title: "",
      },
      c: { domain: colorsObj.domain, interpolator: colorsObj.interpolator },
    },
  };
  LatticeLib.plot(data, "heatmap", id, plotConfig);
}

export function demoStackedColumnPlot() {
  const id = "stacked-column";
  const nBars = 20;
  const nSeries = 5;
  const seriesInfo = RandomDataLib.createSeriesColorInfo(
    nSeries,
    latticeColorScheme10
  );
  const data = RandomDataLib.createRandomStackedCategoricalData(
    nBars,
    nSeries,
    "vertical",
    5
  );
  const plotConfig = {
    padding: { top: 20, bottom: 50 },
    series: seriesInfo,
    axis: {
      x: {
        textAngle: 90,
        textAnchor: "start",
        title: "",
      },
      y: {
        title: "value",
        ticks: 5,
      },
    },
  };
  LatticeLib.plot(data, "stackedcolumnplot", id, plotConfig);
}

export function demoLinePlot() {
  const id = "line-plot";
  const distri = "randomNormal";
  const data = RandomDataLib.createRandomNumericalData(30, distri);
  data.sort((a, b) => a.x - b.x);
  const plotConfig = {
    padding: { top: 20, bottom: 50 },
    color: latticeColorScheme10[4],
    axis: {
      x: { title: "x value", ticks: 5, scaleType: "linear" },
      y: { title: "y value", ticks: 5 },
    },
  };
  LatticeLib.plot(data, "lineplot", id, plotConfig);
}

export function demoDonutPlot() {
  const id = "donut-plot";
  const data = [
    { category: "A", value: 30 },
    { category: "B", value: 22 },
    { category: "C", value: 18 },
    { category: "D", value: 15 },
    { category: "E", value: 15 },
  ];
  const plotConfig = {
    // All four sides must be specified; render() spreads userInput.padding,
    // overwriting the merged default and leaving missing sides undefined.
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
    showLabels: true,
    innerRadiusRatio: 0.6,
    categoryAccessor: (d) => d.category,
    valueAccessor: (d) => d.value,
  };
  LatticeLib.plot(data, "donut", id, plotConfig);
}

export function demoPetalPlot() {
  const id = "petal-plot";
  const data = [
    { label: "A", value: 1.6, width: 0.4, color: latticeColorScheme10[2] },
    { label: "B", value: -1.1, width: 0.9, color: latticeColorScheme10[3] },
    { label: "C", value: 1.9, width: 0.8, color: latticeColorScheme10[4] },
    { label: "D", value: -0.6, width: 0.3, color: latticeColorScheme10[5] },
    { label: "E", value: 0.9, width: 0.6, color: latticeColorScheme10[0] },
  ];
  const plotConfig = {
    padding: { top: 30, right: 30, bottom: 30, left: 30 },
    valueDomain: [-2, 2],
    gridlineValues: [-1, 0, 1],
    valueAccessor: (d) => d.value,
    widthAccessor: (d) => d.width,
    labelAccessor: (d) => d.label,
    colorAccessor: (d) => d.color,
  };
  LatticeLib.plot(data, "petalplot", id, plotConfig);
}

export function demoStackedBarPlot() {
  const id = "stacked-bar";
  const nBars = 20;
  const nSeries = 5;
  const seriesInfo = RandomDataLib.createSeriesColorInfo(
    nSeries,
    latticeColorScheme10
  );
  const data = RandomDataLib.createRandomStackedCategoricalData(
    nBars,
    nSeries,
    "horizontal",
    5
  );
  const plotConfig = {
    padding: { top: 20, bottom: 50 },
    series: seriesInfo,
    orientation: 1,
    axis: {
      x: { title: "value", ticks: 5 },
      y: {
        title: "",
      },
    },
  };
  LatticeLib.plot(data, "stackedbarplot", id, plotConfig);
}
