import "../css/icomut.css";

import { Lattice } from "../../../../src/controllers/Lattice";
import { getDataColumns } from "./coMutDataParser";
import { Panel } from "./Panel";
import { json, select, selectAll } from "d3";

const configFile = "/config/comut-config.json";
// const configFile = "/src/config/config_2.json";
const testFile = "/data/ACC-TP.coMut_table.json";
// const testFile = "/data/SARC-TP.coMut_table.json";

export default class CoMutationPlot {
  constructor(
    rootId,
    dataFiles = { config: configFile, data: testFile },
    width,
    height
  ) {
    this.rendered = false;
    this.rootId = rootId;
    this.dataFiles = dataFiles;
    this.config = undefined;
    this.data = undefined;
    this.latticePlots = [];
    this.lattice = undefined;
    this.dimensions = {
      width: width || window.innerWidth * 0.9,
      height: height || window.innerHeight * 1.3,
    };
    this.panels = [];

    this.sampleBasedPlots = [];
    this.allSamples = [];
    this.sortedSamples = [];
    this.excludedSamples = [];
    this.currentSampleOrder = [];
    this.sorts = [];

    this._init();
  }

  _init() {
    const promises = [json(this.dataFiles.config), json(this.dataFiles.data)];
    Promise.all(promises).then((data) => {
      this.config = data[0];
      this.data = data[1];
      this.allSamples = this.data.samples.filter((d) => d != "all_q");
      this.sortedSamples = this.data.samples.filter((d) => d != "all_q");
      this._createPanels();
      this._initLattice();
      this._initSort();

      this._render();
      this._addLabelSortEvents();
      // this._parseData();
    });
  }

  _createPanels() {
    this.config.panels.forEach((p) => {
      const panel = new Panel(
        p.id,
        p.label,
        p.searchKeyword,
        p.row,
        p.plots,
        p.colors,
        p.panelOptions,
        this
      );
      this.panels.push(panel);
    });
  }

  _getAllPlotData() {
    this.latticePlots = [];
    this.panels.forEach((p) => {
      this.latticePlots = this.latticePlots.concat(p.generatePlotConfigs());
    });
  }

  /**
   * Passes Plot objects to the panels
   */
  _setPanelPlotObjects() {
    this.panels.forEach((p) => {
      const row = p.row;
      const panelPlots = this.lattice.plots.filter((p) => row == p.row);
      p.setPlotObjects(panelPlots);
    });
  }

  /**
   * Sorts the comut plot for the initial render based off user input.
   * If the user does not specify a sort, it will automatically sort by the
   * displayed columns of the gene mutation panel.
   *
   * Expected "initialSort" format:
   * [ { "panel": <panel_id>, "order": <0 or 1 for ascending/descending> }]
   *
   */
  _initSort() {
    if (
      this.config.initialSort === undefined ||
      !this.config.initialSort.length
    ) {
      this.config.initialSort = [{ panel: "GeneMutation", order: 1 }];
    }
    const sorts = this.config.initialSort;

    sorts.forEach((s) => {
      const panel = this.panels.find((d) => d.id == s.panel);
      if (panel === undefined) return;

      if (panel.sortedYColumns.length > 1) {
        const searchKey = panel.searchKeyword;
        panel.sortedYColumns.forEach((col) => {
          this.sorts.push({ search: `${searchKey}${col}`, order: s.order });
        });
      } else {
        this.sorts.push({ search: panel.searchKeyword, order: s.order });
      }
    });
    this._sortSamples();
    this._updateMainPanelOrder();
  }

  /**
   * Ensures that sample based plots are properly aligned
   */
  _updateMainPanelOrder() {
    this.sampleBasedPlots.forEach((p) => p.scale.x.domain(this.sortedSamples));
  }

  /**
   * Ensures all plots within each panel are properly aligned on the y-axis
   */
  _updateYAxisOrder() {
    this.panels.forEach((p) => p.updateYAxisOrder());
  }

  /**
   * Creates the Lattice object
   */
  _initLattice() {
    this._getAllPlotData();

    const width = this.dimensions.width;
    const height = this.dimensions.height;
    const latticeConfig = {
      width: width,
      height: height,
      grid: this.config.grid,
    };
    this.lattice = new Lattice(this.latticePlots, this.rootId, latticeConfig);

    const sampleBasedColumn = this.config.sampleBasedColumn;
    this.sampleBasedPlots = this.lattice.plots.filter(
      (p) => p.column == sampleBasedColumn
    );

    this._setPanelPlotObjects();
    this._updateMainPanelOrder();
    this._updateYAxisOrder();
  }

  _rerenderPlots() {
    select(`#${this.rootId}`).html("");
    this._initLattice();
    this._render();

    this._addLabelSortEvents();
  }

  /**
   * Sorts samples and updates the object sortedSamples attribute.
   */
  _sortSamples() {
    const samples = this.allSamples.filter(
      (s) => !this.excludedSamples.includes(s)
    );
    const compareFn = (a, b) => {
      /**
       * Gets the sample's value for a particular data dimension determined by
       * the search keyword.
       * If a keyword matches multiple columns, the value is determined based off
       * the sum of all columns (e.g. for stacked column charts)
       * Assumed lowest value is 0, which is used for filling in undefined data.
       * @param {String} sId
       * @param {String} keyword
       * @returns Number
       */
      const getSampleVal = (sId, keyword) => {
        const allCols = this.data.sets;
        const data = this.data.data[sId];
        let val = 0;

        const cols = getDataColumns(allCols, keyword);
        if (cols.length > 1) {
          val = cols.reduce(
            (x, y) => (data[y] === undefined ? x : x + data[y]),
            0
          );
        } else {
          val = data[cols[0]] === undefined ? 0 : data[cols[0]];
        }
        return val;
      };

      /**
       * Multi-key sorting function based of a list of sort objects (attributes: search, order)
       * @param {String} a - sample id
       * @param {String} b - sample id
       * @param {Integer} i - index of key to sort by
       * @returns 1, -1, 0, defining whether a or b should come first
       */
      const sort = (a, b, i) => {
        const sorts = this.sorts;
        if (i >= sorts.length) return 0;

        const sortInfo = sorts[i];
        const aVal = getSampleVal(a, sortInfo.search);
        const bVal = getSampleVal(b, sortInfo.search);

        if (aVal < bVal) {
          if (sortInfo.order == 0) return -1; // ascending
          else return 1;
        } else if (aVal > bVal) {
          if (sortInfo.order == 0) return 1;
          else return -1;
        } else {
          return sort(a, b, i + 1);
        }
      };

      return sort(a, b, 0);
    };
    samples.sort(compareFn);
    this.sortedSamples = samples;
  }

  _addLabelSortEvents() {
    const yAxisLabel = "ljs--y-axis-label";
    const yAxis = "ljs--y-axis";

    const updateSort = (searchKeyword, resetSort) => {
      const match = this.sorts.find((s) => s.search == searchKeyword);
      const sortInfo = {
        search: searchKeyword,
        order: match === undefined ? 0 : match.order ? 0 : 1,
      };
      // Clear any other sorts if alt key isn't clicked. If it was already sorted by this, reverse the sort order.
      if (resetSort) {
        this.sorts = [sortInfo];
      } else {
        // reverse sort if the key already exists in the list, otherwise add a new sort
        if (match) {
          const index = this.sorts.findIndex((d) => d.search == searchKeyword);
          this.sorts[index] = sortInfo;
        } else {
          this.sorts.push(sortInfo);
        }
      }
      this._sortSamples();
      this._rerenderPlots();
    };

    this.sampleBasedPlots.forEach((plot) => {
      const yAxisTitle = plot.axisInternal.y.title;
      const panel = this.panels.filter((p) => p.row == plot.row)[0];
      if (yAxisTitle) {
        const label = select(`#${plot.parentId} .${yAxisLabel}`);
        label.on("click", (event) => {
          const resetSort = !event.altKey;
          const searchKeyword = panel.searchKeyword;
          updateSort(searchKeyword, resetSort);
        });
      } else {
        const labels = selectAll(`#${plot.parentId} .${yAxis} text`);
        labels.on("click", (event, d) => {
          const resetSort = !event.altKey;
          const searchKeyword = `${panel.searchKeyword}${d}`;
          updateSort(searchKeyword, resetSort);
        });
      }
    });
  }

  // DEPRECATED
  // _parseData() {
  //     this.config.panels.forEach(panel => {
  //         const row = panel.row;
  //         if (coMutDataParser[panel.id].panel !== undefined) {
  //             coMutDataParser[panel.id].panel(this.data, panel, this.config);
  //         }
  //         panel.plots.forEach(plot => {
  //             plot.row = row;
  //             const plotData = coMutDataParser[panel.id][plot.plotType](this.data, plot, panel, this.config);
  //             this.latticePlots.push(plotData);
  //         });
  //     });
  // }

  // DEPRECATED
  /**
   * Takes care of any processing that needs to happen pre-rendering
   * Functionality so far includes:
   * - sorts samples based off gene mutation type
   * - ensuring that all sample based axes (i.e. the main middle panel) are all the same
   */
  // _preprocess() {
  //     const sorter = this.config.initialSort;
  //     const samples = this.data.samples.filter(d => !this.config.excludedSamples.includes(d));
  //     let sortedSamples = [];
  //     if (sorter === undefined) {
  //         sortedSamples = samples;
  //     } else {
  //         const sortPanel = this.config.panels.filter(p => p.id == sorter.dataType)[0]; // should only return 1 thing
  //         sortedSamples = coMutDataParser[sorter.dataType].sort(samples, this.data, sortPanel, sorter.order);
  //     }
  //     this.lattice.config.plots.forEach(p => {
  //         if (this.config.sampleBasedColumns.includes(p.column)) {
  //             p.scale.x.domain(sortedSamples);
  //         }
  //     });
  // }

  // DEPRECATED
  /**
   * Adds labels for each panel/row of data.
   * Label should be provided by user in config.json in each panel object under the attribute "label".
   */
  // _addRowLabels() {
  //     const createLegend = (panel, labelGroup) => {
  //         const legendT = labelGroup.append("g")
  //             .attr("class", "panel-legend")
  //             .attr("transform", "translate(0, 15)");
  //         const legendData = coMutDataParser[panel.id].legend(this.data, panel);
  //         const legendItems = legendT.selectAll("g.legend-item")
  //             .data(legendData)
  //             .enter()
  //             .append("g")
  //             .attr("class", "legend-item")
  //             .attr("transform", (d, i)=>`translate(0, ${i*15})`);
  //         legendItems.append("rect")
  //             .attr("width", 8)
  //             .attr("height", 8)
  //             .attr("fill", d=> d.color);
  //         legendItems.append("text")
  //             .html(d => d.name)
  //             .attr("dx", 15)
  //             .attr("dy", 8);
  //     };

  //     if (!this.rendered) {
  //         const laticeParentId = this.lattice.config.parentId;
  //         const latticeG = select(`#${laticeParentId}`).select("g");
  //         const labels = latticeG.append("g").attr("class", "icomut-panel-labels");
  //         const rowSizes = this.lattice.config.grid.rowSizes;

  //         this.config.panels.forEach(p => {
  //             const rowStart = rowSizes.filter(d => d.row == p.row)[0].start;
  //             const x = this.lattice.config.xScale(0);
  //             const y = this.lattice.config.yScale(rowStart) + 10; // +10 for some vertical padding
  //             const panelLabelG = labels.append("g").attr("transform", `translate(${x}, ${y})`);

  //             // row label
  //             const rowLabel = panelLabelG.append("text").attr("class", "panel-label")
  //                 .html(p.label);
  //             if (p.sortByPanelLabel) {
  //                 rowLabel.classed("icomut-clickable-label", true)
  //                     .on("click", ()=>{
  //                         const samples = this.data.samples.filter(d => !this.config.excludedSamples.includes(d));
  //                         const sortedSamples = coMutDataParser[p.id].sort(samples, this.data, p, 1);
  //                         this._updateSampleOrder(sortedSamples);
  //                     });
  //             }

  //             // legend
  //             if (p.displayLegend) {
  //                 createLegend(p, panelLabelG);
  //             }

  //         });
  //     }
  // }

  // DEPRECATED
  /**
   * Determines and retusrns panel object from the viz config that
   * has a plot with a matching y-axis label as the one passed in.
   * Used for sorting purposes on click.
   * Only works if exactly one panel matches this criteria.
   * @param {String} label
   */
  // _getDataTypeFromYAxisLabel(label) {
  //     const matchingPanels = this.config.panels.filter(panel => {
  //         const matchingPlots = panel.plots.filter(p => p.plotOptions.axis.y && p.plotOptions.axis.y.title == label);
  //         if (matchingPlots.length) return true;
  //         else return false;
  //     });
  //     if (matchingPanels.length == 0) {
  //         throw `Error: No panel config found with y-axis label "${label}". If label was post-processed, this method needs to be updated or changed.`;
  //     } else if (matchingPanels.length > 1) {
  //         throw `Error: Multiple panel configs found with y-axis label "${label}". This method needs to be updated to deal with this case.`;
  //     }
  //     return matchingPanels[0];
  // }

  // DEPRECATED
  // _updateSampleOrder(samples) {
  //     console.log(this);
  //     const sampleBasedColumns = this.config.sampleBasedColumns;
  //     this.lattice.config.plots.forEach(p => {
  //         if (sampleBasedColumns.includes(p.column)) {
  //             p.updateAxis("x", {order: samples});
  //         }
  //     });

  //     // need to add the click events back in
  //     this._postprocess();
  // }

  // DEPRECATED
  // _addAxisLabelClickEvents() {
  //     const yAxisLabels = selectAll(`#${this.rootId} .ljs--y-axis-label`);
  //     yAxisLabels.nodes().forEach(d => {
  //         const labelSelection = select(d);
  //         const label = d.innerHTML;
  //         const panel = this._getDataTypeFromYAxisLabel(label);
  //         const dataType = panel.id;

  //         labelSelection.classed("icomut-clickable-label", true).on("click", ()=>{
  //             console.log(dataType, panel);
  //             const samples = this.data.samples.filter(d => !this.config.excludedSamples.includes(d));
  //             const sortedSamples = coMutDataParser[dataType].sort(samples, this.data, panel, 1);
  //             this._updateSampleOrder(sortedSamples);
  //         });
  //     });
  // }

  // DEPRECATED
  // _postprocess() {
  //     this._addRowLabels();
  //     this._addAxisLabelClickEvents();
  // }

  _render() {
    // this._preprocess();
    this.lattice.render();
    // this._postprocess();
    // this.rendered = true;
  }
}

export function init(
  rootId,
  dataFiles = { config: configFile, data: testFile },
  width,
  height
) {
  const iCoMutPlot = new CoMutationPlot(rootId, dataFiles, width, height);
  return iCoMutPlot;
}
