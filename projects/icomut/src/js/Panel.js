import * as dataParser from "./coMutDataParser";
import * as d3 from "d3";

export class Panel {
    constructor(id, label, searchKeyword, row, plots, colors, panelOptions, comutObj) {
        plots.sort((a, b) => {a.column < b.column ? -1 : a.column > b.column ? 1 : 0;});

        this.id = id;
        this.label = label;
        this.searchKeyword = searchKeyword;
        this.row = row;
        this.colors = colors;
        this.comutObj = comutObj;
        this.sampleBasedCol = comutObj.config.sampleBasedColumn;

        this.ySort = panelOptions.sort; // default panel sort order; accepted vals: undefined | count | qval
        this.yLimit = panelOptions.limit;
        this.clusterKey = panelOptions.clusterKey;
        this.plots = []; // stores the lattice.js Plot objects relevamt to the panel
        this.yColumns = []; // stores all Y-axis categories, if applicable
        this.sortedYColumns = [];

        this._plotConfigs = {};
        plots.forEach(p => {
            p.row = this.row;
            this._plotConfigs[p.column] = p;
        });
        this._full = {}; // stores all plot data, series, domain, information for each plot. keys = columns.
        this._displayedData = {};
        
        this.mainPlotType = this._plotConfigs[this.sampleBasedCol].plotType;
        this.panelCountData = undefined;
        this._parsePanelData();
    }

    _parsePanelData() {
        switch(this.mainPlotType) {
        case "categoricalheatmap": {
            const mainPlotInfo = dataParser.parseCategoricalHeatmapData(this.comutObj.data, this);
            this._full[this.sampleBasedCol] = mainPlotInfo;
            this.yColumns = mainPlotInfo.columns.length > 1 ? mainPlotInfo.columns.map(d => d.replace(this.searchKeyword, "")) : mainPlotInfo.columns;
            this.sortedYColumns = this.yColumns.map(d => d); // mapping to create new copy
            
            // generating data for auxiliary plots for this panel type
            // count bar charts
            const countCol = this.sampleBasedCol - 1;
            this.panelCountData = dataParser.getPanelCountData(this._full[this.sampleBasedCol].plotData);
            const countPlotInfo = dataParser.parseStackedCountData(this.panelCountData, this);
            this._full[countCol] = countPlotInfo;

            // q-value heatmap
            const qCol = this.sampleBasedCol + 1;
            const qValPlotInfo = dataParser.parseQValData(this.comutObj.data, this);
            this._full[qCol] = qValPlotInfo;

            const heatmapTtipFormatter = (d) => {
                const tooltipData = [`${d.x}`, `${d.y}`, `${this.clusterKey? this.clusterKey[d.c] : d.c}`];
                return tooltipData.join("<br/>");
            };
            const countTtipFormatter = (d) => {
                const tooltipData = [`${this.clusterKey? this.clusterKey[d.series] : d.series}`, `Count: ${d.data[d.series]}`];
                return tooltipData.join("<br/>");
            };
            const qTtipFormatter = (d) => {
                const tooltipData = [`${d.y}`, `${d.c}`];
                return tooltipData.join("<br/>");
            };
            this._full[this.sampleBasedCol]["ttipFormatter"] = heatmapTtipFormatter;
            this._full[countCol]["ttipFormatter"] = countTtipFormatter;
            this._full[qCol]["ttipFormatter"] = qTtipFormatter;

            break;
        }
        case "stackedcolumnplot": {
            const mainPlotInfo = dataParser.parseStackedData(this.comutObj.data, this);
            this._full[this.sampleBasedCol] = mainPlotInfo;
            break;
        }
        case "stripplot": {
            // special case of categorical heatmap data that's 1D
            const mainPlotInfo = dataParser.parseCategoricalHeatmapData(this.comutObj.data, this);
            const categories = [...new Set(mainPlotInfo.plotData.map(d => d.c))];
            mainPlotInfo.domain = categories.map(d => d);
            mainPlotInfo.range = categories.map((_, i) => this.colors[i]);
            this._full[this.sampleBasedCol] = mainPlotInfo;
            this.yColumns = mainPlotInfo.columns.map(d => d.replace(this.searchKeyword, ""));
            this.sortedYColumns = this.yColumns.map(d => d); // mapping to create new copy

            let ttipFormatter = (d) => {
                const tooltipData = [`${d.x}`, `${this.clusterKey? this.clusterKey[d.c] : d.c}`];
                return tooltipData.join("<br/>");
            };
            this._full[this.sampleBasedCol]["ttipFormatter"] = ttipFormatter;
            break;
        }
        default:
        }
        this._setDataToDisplay();
    }

    _setDataToDisplay() {
        const mainCol = this.sampleBasedCol;
        const excludedSamples = this.comutObj.excludedSamples;
        const sampleExcludedData = this._full[mainCol].plotData.filter(d => !excludedSamples.includes(d.x));

        switch (this.mainPlotType) {
        case "stackedcolumnplot":
        case "stripplot":
            this._displayedData[mainCol] = sampleExcludedData;
            break;
        case "categoricalheatmap": {
            const countData = dataParser.getPanelCountData(sampleExcludedData);
            const countPlotInfo = dataParser.parseStackedCountData(countData, this);
            const qValData = this._full[mainCol + 1].plotData;

            // do some sort of sorting and data filtering
            const sort = this.ySort;
            const lim = this.yLimit;
            if (sort == "count") {
                const countData = dataParser.getPanelCountData(this._full[mainCol].plotData);
                const countList = Object.keys(countData).map(d => ({ total: countData[d].total, y: d }));
                countList.sort((a, b) => {
                    if (a.total > b.total) return -1;
                    else if (a.total < b.total) return 1;
                    else return 0;
                });
                this.sortedYColumns = countList.filter((_, i) => lim === undefined || i < lim).map(d => d.y);
            } else if (sort == "qval") {
                const dataTransform = dataParser.dataTransformer.Q;
                const qLim = lim === undefined ? undefined : dataTransform(lim);
                const filteredQData = qValData.filter(d => qLim === undefined || d.c >= qLim);
                filteredQData.sort((a, b) => {
                    if (a.c > b.c) return -1;
                    else if (a.c < b.c) return 1;
                    else return 0;
                });
                this.sortedYColumns = filteredQData.map(d => d.y);
            }
            // filtering count data + qval data down to only y-axis categories of interest
            this._displayedData[mainCol] = sampleExcludedData.filter(d => this.sortedYColumns.includes(d.y));
            this._displayedData[mainCol - 1] = countPlotInfo.plotData.filter(d => this.sortedYColumns.includes(d.y));
            this._displayedData[mainCol + 1] = qValData.filter(d => this.sortedYColumns.includes(d.y));
            break;
        }
        default:
        }
    }

    /**
     * Creates plot configuration objects for generating Plots in a Lattice
     * @returns Array of plot configuration objects
     */
    generatePlotConfigs() {
        const configs = Object.keys(this._full).map(col => {
            const pData = this._displayedData[col];
            const pDataConfig = this._full[col];
            const pConfig = this._plotConfigs[col];
            let config = {};

            switch(pConfig.plotType) {
            case "categoricalheatmap":
                config = {
                    row: pConfig.row, column: pConfig.column,
                    data: pData,
                    type: pConfig.plotType,
                    axis: pConfig.plotOptions.axis,
                    padding: pConfig.plotOptions.padding,
                    orientation: pConfig.plotOptions.orientation || 1,
                    tooltip: { formatter: pDataConfig.ttipFormatter }
                };
                config.axis.c = { domain: [...Array(this.colors.length).keys()], range: this.colors };
                break;
            case "heatmap":
                config = {
                    row: pConfig.row, column: pConfig.column,
                    data: pData,
                    type: pConfig.plotType,
                    axis: pConfig.plotOptions.axis,
                    padding: pConfig.plotOptions.padding,
                    orientation: pConfig.plotOptions.orientation,
                    tooltip: { formatter: pDataConfig.ttipFormatter }
                };
                config.axis.c = { scaleType: "sequential", domain: pDataConfig.cDomain, interpolator: d3.interpolateGreys };
                break;
            case "stackedbarplot":
                config = {
                    row: pConfig.row, column: pConfig.column,
                    data: pData,
                    type: pConfig.plotType,
                    series: pDataConfig.series,
                    axis: pConfig.plotOptions.axis,
                    padding: pConfig.plotOptions.padding,
                    orientation: pConfig.plotOptions.orientation || -1,
                    tooltip: { formatter: pDataConfig.ttipFormatter }
                };
                break;
            case "stackedcolumnplot":
                config = {
                    row: pConfig.row, column: pConfig.column,
                    data: pData,
                    type: pConfig.plotType,
                    series: pDataConfig.series,
                    axis: pConfig.plotOptions.axis,
                    padding: pConfig.plotOptions.padding,
                    orientation: pConfig.plotOptions.orientation || 1,
                    tooltip: {
                        formatter: (d) => {
                            const tooltipDataList = Object.keys(d.data).map(x => `${x}: ${d.data[x]}`);
                            const tooltipData = tooltipDataList.join("<br/>");
                            return tooltipData;
                        }
                    }
                };
                break;
            case "stripplot":
                config = {
                    row: pConfig.row, column: pConfig.column,
                    data: pData,
                    type: "categoricalheatmap",
                    axis: pConfig.plotOptions.axis,
                    padding: pConfig.plotOptions.padding,
                    orientation: pConfig.plotOptions.orientation || 1,
                    tooltip: { formatter: pDataConfig.ttipFormatter }
                };
                config.axis.c = { domain: pDataConfig.domain, range: pDataConfig.range };
                break;
            default:
            }
            if (this.plotType == "stackedbarplot") console.log(config);
            return config;
        });
        return configs;
    }

    /**
     * Stores Plot objects for the Panel
     */
    setPlotObjects(plots) {
        this.plots = plots;
    }

    /**
     * Ensures all plots within the panel are properly aligned on the y-axis
     * @returns 
     */
    updateYAxisOrder() {
        if (!this.yColumns.length) return;
        this.plots.forEach(p => p.scale.y.domain(this.sortedYColumns));
    }
}