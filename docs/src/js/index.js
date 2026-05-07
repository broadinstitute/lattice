import "../../../src/css/LatticeLib.css";
import "../css/index.css";

import {
  demoAreaPlot,
  demoBarcodePlot,
  demoBarPlot,
  demoColumnPlot,
  demoCategoricalHeatmap,
  demoDonutPlot,
  demoHeatmap,
  demoLinePlot,
  demoPetalPlot,
  demoScatterPlot,
  demoStackedBarPlot,
  demoStackedColumnPlot,
} from "./demos/basic-plots-demo.js";

import { demoScatterHistograms } from "./demos/scatterplot-histograms-demo.js";
import { initCovidMap } from "./demos/covid-us-map-demo.js";
import { init as iCoMutInit } from "../../../notebooks/icomut/src/js/iCoMut.js";
import { renderHomeTiles } from "./demos/home-tiles-demo.js";

// Expose demoScatterHistograms to window for onclick handlers in HTML
window.demoScatterHistograms = demoScatterHistograms;

document.addEventListener("DOMContentLoaded", function () {
  renderHomeTiles();
  plotTypeDemo();
  coordinatedScatterDemo();
  initCovidMap();
  comutDemo();
});

const plotTypeDemo = () => {
  demoAreaPlot();
  demoBarcodePlot();
  demoBarPlot();
  demoColumnPlot();
  demoCategoricalHeatmap();
  demoDonutPlot();
  demoHeatmap();
  demoLinePlot();
  demoPetalPlot();
  demoScatterPlot();
  demoStackedBarPlot();
  demoStackedColumnPlot();
};

const coordinatedScatterDemo = () => {
  demoScatterHistograms();
};

const comutDemo = () => {
  const rootId = "comut-plot";
  const dataFiles = {
    config: "/config/comut-config.json",
    data: "/data/ACC-TP.coMut_table.json",
  };

  iCoMutInit(rootId, dataFiles, 1200, 600);
};
