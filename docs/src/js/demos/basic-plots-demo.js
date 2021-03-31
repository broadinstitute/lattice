const latticeBlue = "#96d0cb";
const latticeColorScheme10 = [latticeBlue, "#666666", "#c28b9a", "#cdaf70", "#7092a5", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
function demoAreaPlot(){
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
        axis: {
            x: {scaleType: "linear"}
        }
    };
    let plot = LatticeLib.plot(data, "areaplot", id, config); // todo: more plot options demos
    
    return data;
}

function demoBarcodePlot(){
    const id="barcode-plot";
    const distri = "randomInt";
    const data = RandomDataLib.createRandomNumericalData(20, distri);
    const config = {
        padding: {top: 20},
        axis: {
            y: {display: false}
        }
    }
    let plot = LatticeLib.plot(data, "barcodeplot", id, config); // todo: more plot options demos
    return data;
}

function demoScatterPlot(){
    // scatterplot
    const id = "scatter-plot";
    const distri = "randomNormal";
    const data = RandomDataLib.createRandomNumericalData(200, distri, latticeBlue);
    
    const plotConfig = {
        axis: {
            y: {title: distri, ticks: 10}, 
            x: {title: distri}
        }
    }; // todo: Y axis title isn't showing
    LatticeLib.plot(data, "scatterplot", id, plotConfig); // todo: more plot options demos
    return data;
}

function demoBarPlot(){
    // bar plot
    const id = "bar-plot";
    const data = RandomDataLib.createRandomCategoricalData(20, "horizontal", 5, latticeBlue);
    const plotConfig = {
        padding: {top: 0}, 
        axis: {
            x: {
                title: "value",
                ticks: 5
            }
        }
        
    }; // todo: how to change the plot height
    let plot = LatticeLib.plot(data, "barplot", id, plotConfig); // todo: more plot options demos
    console.log(LatticeLib.getPlotOptions(plot))
}

function demoCategoricalHeatmap(){
    const id = "cat-heatmap";
    const nCategories = 15;
    const nCols = 15;
    const nRows = 15;
    const colorsObj = RandomDataLib.createHeatmapColors(nCategories, "discrete", range=latticeColorScheme10);
    const data = RandomDataLib.createRandomHeatmapData(nRows, nCols, nCategories);
    const plotConfig = {
        padding: { top: 0 },
        axis: {
            c: { domain: colorsObj.domain, range: colorsObj.range }
        }
    };
    LatticeLib.plot(data, "categoricalheatmap", id, plotConfig);
}

function demoColumnPlot(){
    // column plot
    const id = "column-plot";
    const data = RandomDataLib.createRandomCategoricalData(20, "vertical", 5, latticeBlue); // todo: how to rotate cateogy text labels
    const plotConfig = {
        padding: {top: 0}, 
        axis:{
            x: {title: "", angle: 60, "text-anchor": "start"},
            y: {title: "value", ticks: 5}
        }
    }; // todo: yAxis title not showing
    LatticeLib.plot(data, "columnplot", id, plotConfig); // todo: more plot options demos  
}

function demoHeatmap(){
    const id = "heatmap";
    const maxValue = 15;
    const nCols = 20;
    const nRows = 20;
    const data = RandomDataLib.createRandomHeatmapData(nRows, nCols, maxValue);
    const colorsObj = RandomDataLib.createContinuousColors(maxValue, "Lattice");
    console.info(colorsObj.interpolator);
    const plotConfig = {
        padding: { top: 0 },
        axis: {
            c: { domain: colorsObj.domain, interpolator: colorsObj.interpolator }
        }
    };
    LatticeLib.plot(data, "heatmap", id, plotConfig);
}

function demoStackedColumnPlot() {
    const id = "stacked-column";
    const nBars = 10;
    const nSeries = 5;
    const seriesInfo = RandomDataLib.createSeriesColorInfo(nSeries, latticeColorScheme10);
    const data = RandomDataLib.createRandomStackedCategoricalData(nBars, nSeries, "vertical");
    const plotConfig = {
        padding: { top: 0 },
        series: seriesInfo,
        axis: {
            x: {
                angle: 60,
                "text-anchor": "start"
            }
        }
    };
    LatticeLib.plot(data, "stackedcolumnplot", id, plotConfig);
}

function demoStackedBarPlot() {
    const id = "stacked-bar";
    const nBars = 10;
    const nSeries = 5;
    const seriesInfo = RandomDataLib.createSeriesColorInfo(nSeries, latticeColorScheme10);
    const data = RandomDataLib.createRandomStackedCategoricalData(nBars, nSeries, "horizontal");
    const plotConfig = {
        padding: { top: 0 },
        series: seriesInfo,
        orientation: -1
    };
    LatticeLib.plot(data, "stackedbarplot", id, plotConfig);
}