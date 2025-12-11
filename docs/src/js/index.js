import "../../../src/css/LatticeLib.css";
import "../css/index.css";

import {
  demoAreaPlot,
  demoBarcodePlot,
  demoBarPlot,
  demoColumnPlot,
  demoCategoricalHeatmap,
  demoHeatmap,
  demoScatterPlot,
  demoStackedBarPlot,
  demoStackedColumnPlot,
} from "./demos/basic-plots-demo.js";

import { demoScatterHistograms } from "./demos/scatterplot-histograms-demo.js";
import { initCovidMap } from "./demos/covid-us-map-demo.js";
import { init as iCoMutInit } from "../../../notebooks/icomut/src/js/iCoMut.js";

// Expose demoScatterHistograms to window for onclick handlers in HTML
window.demoScatterHistograms = demoScatterHistograms;

document.addEventListener("DOMContentLoaded", function () {
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
  demoHeatmap();
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
    config: "/src/config/comut-config.json",
    data: "/src/data/ACC-TP.coMut_table.json",
  };

  iCoMutInit(rootId, dataFiles, 1200, 600);
};
