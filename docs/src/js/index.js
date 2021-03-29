document.addEventListener('DOMContentLoaded', function() {
    plotTypeDemo();
    coordinatedScatterDemo();
    initCovidMap();
    comutDemo();
});

const plotTypeDemo = () => {
    // list all plot types in the Lattice Library
    document.getElementById("plot-types").innerHTML = Object.values(LatticeLib.showAvailablePlotTypes()).join("<br>");
    
    // show plot config default settings
    document.getElementById("plot-config-opt").innerHTML = LatticeLib.getPlotOptions();
    
    // demos
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
    // show lattice config default settings
    document.getElementById("lattice-config-opt").innerHTML = LatticeLib.getLatticeOptions();

    // demos
    init();
};

const comutDemo = () => {
    const rootId = "comut-plot";
    const dataFiles = {
        config: "/src/config/config.json",
        data: "/src/data/ACC-TP.coMut_table.json"
    }

    iCoMut.init(rootId, dataFiles);
};