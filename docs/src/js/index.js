document.addEventListener('DOMContentLoaded', function() {
    plotTypeDemo();
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