import {PlotInLattice} from "./PlotInLattice";
import { createGroup, createSvg } from "../utils/plot-utils";
import * as d3 from "d3";

const LATTICE_DEFAULT_PADDING = 20; 
/**@description LatticeKernel class is the core of Lattice */
class LatticeKernel {
    /**
     * @constructor
     * @property {String} parentId div ID that the plot should be created in, if the SVG already exists
     * @property {Number} width - outer width of lattice plot
     * @property {Number} height - outer height of lattice plot
     * @property {Grid} grid                              
     * @property {Object} padding - attr: top, right, bottom, left; padding to apply around the chart
     */

    constructor(){
        this.parentId = undefined;
        this.width = 1000;
        this.height = 600;
        /**
         * @typedef GridSize
         * @property {Int} row, zero-based
         * @property {Float} size, Decimal between [0, 1]
         */
        /**
         * @typedef Grid 
         * @property {Int} rows
         * @property {Int} columns
         * @property {GridSize[]} rowSizes
         * @property {GridSize[]} colSizes
        */
        let Grid = {
            rows: 1,
            columns: 1,
            rowSizes: undefined, 
            columnSizes: undefined
        };
        this.grid = Grid
        
        this.padding={
            top:LATTICE_DEFAULT_PADDING, 
            right:LATTICE_DEFAULT_PADDING, 
            bottom:LATTICE_DEFAULT_PADDING, 
            left:LATTICE_DEFAULT_PADDING
        };
    }
}

/**
 * @description Lattice class for creating a lattice visualization object
 */
export class Lattice extends LatticeKernel{
    /**
     * Constructor for Lattice controller. This is one of two entry points for a user using this library.
     * @constructor
     * @param {PlotInLattice[]|Object[]} plots - Specifies the configuration for each individual plot. 
     * @param {String} rootId - div ID that the SVG should be created in
     * @param {LatticeKernel|Object} userInput - optional, can include any attribute in LatticeKernel
     */ 
     
    constructor(plots, rootId, userInput) {
        super();
        this.customizableProp = Object.keys(this);

        this.rootId = rootId;
        this._userInput = userInput;
        this.grid = {
            rows: d3.max(plots.map((x) => x.row)) + 1 || 1,
            columns: d3.max(plots.map((x) => x.column)) + 1 || 1,
            rowSizes: undefined,
            columnSizes: undefined
        };
        this.gridInternal = {
            plotSizes: undefined
        };
        this.title = undefined;
        this._changeSettings(userInput);

        // computed values
        this.innerWidth = this.width - this.padding.left - this.padding.right;
        this.innerHeight = this.height - this.padding.top - this.padding.bottom;

        this.plots = plots.map(d => {
            let config = d.config===undefined?d:d.config;
            config.width = this.innerWidth * this.gridInternal.plotSizes[d.row][d.column].colSize;
            config.height = this.innerHeight * this.gridInternal.plotSizes[d.row][d.column].rowSize;
            const plot = new PlotInLattice(d.row, d.column, d.data, d.type, this.rootId, config);

            // computed property
            // plot.rowStart = this.gridInternal.plotSizes[d.row][d.column].rowStart; // side effect: undocumented plot properties
            // plot.colStart = this.gridInternal.plotSizes[d.row][d.column].colStart;
            return plot;
        }, this);
        this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.innerWidth]);
        this.yScale = d3.scaleLinear().domain([0, 1]).range([0, this.innerHeight]);
    }  

    /**
     * @public
     * @description reports what properties of Lattice object are customizable
     */
    getCustomizable(){
        let config = {};
        this.customizableProp.forEach((prop)=>{
            config[prop] = this[prop];
        });
        return config;
    }

    /**
     * @public
     * @description rendering function of a Lattice object. It creates an SVG/group element as needed for the initial Lattice, generates a group for each individual plot
     */
    render() {
        let svg;
        if (this.parentId === undefined) {
            this.parentId = createSvg(this.rootId, this.width, this.height, "lattice");
        }
        svg = createGroup(this.parentId, this.padding, "lattice");
        
        const svgId = svg.attr("id");
        let plot = svg.selectAll(".ljs--lattice-plot").data(this.plots);
        plot.enter()
            .append("g")
            .attr("class", "ljs--lattice-plot")
            .attr("id", (d) => `${svgId}-${d.row}-${d.column}`) // this needs to be the same as the parentId given below
            .attr("transform", (d) => {
                let x = this.xScale(d.colStart(this.gridInternal.plotSizes));
                let y = this.yScale(d.rowStart(this.gridInternal.plotSizes));
                return `translate(${x}, ${y})`;
            })
            .each((d) =>{
                d.parentId = `${svgId}-${d.row}-${d.column}`;
                d.render();
            })
            .attr("opacity", 0)
            .transition()
            .duration(500)
            .attr("opacity", 1);
        plot.exit().remove();

    }

    /**
     * @description changes the Lattice's default settings based on user input
     * @param {Object} userInput 
     * @private
     */
    _changeSettings(userInput){
        let lattice = this;
        Object.keys(userInput).forEach((prop)=>{
            switch(prop){
            case "padding":
                lattice.padding = Object.assign({}, lattice.padding, userInput.padding);
                break;
            case "grid":
                lattice.grid = Object.assign({}, lattice.grid, userInput.grid);
                break;
            default:
                lattice[prop] = userInput[prop];
            }
        });
        lattice._validateGridInfo();
        lattice._updateGridInfo();
       
    }

    /**
     * Private function.
     * Called by the constructor to validate that:
     * - ALL rows are customized if passed in by user
     * - ALL columns are customized if passed in by user
     * - that the customized percentages add up to 1 (100%)
     * If no customizations were made, calculates the needed grid information for generating lattice grid
     * @private
     */
    _validateGridInfo() {
        if (this.grid.rowSizes !== undefined) {
            this.grid.rows = this.grid.rowSizes.length; // if the attr rowsizes is defined, the value of rows should be the array length of rowSizes, and will disregard user input
            const rowGridTotal = this.grid.rowSizes.reduce((a, b) => a + b.size, 0);
            if (Number(rowGridTotal.toPrecision(2)) != 1) {
                console.error("In rowSizes, sum of all size values must add up to 1.");
                throw "In rowSizes, sum of all size values must add up to 1.";
            }
        } else {
            this.grid.rowSizes = [];
            for (let i = 0; i < this.grid.rows; i++) {
                this.grid.rowSizes.push({ row: i, size: 1/this.grid.rows });
            }
        }

        if (this.grid.columnSizes !== undefined) {
            this.grid.columns = this.grid.columnSizes.length;
            const colGridTotal = this.grid.columnSizes.reduce((a, b) => a + b.size, 0);
            if (Number(colGridTotal.toPrecision(2)) != 1) {
                console.error("In columnSizes, sum of all size values must add up to 1.");
                throw "In columnSizes, sum of all size values must add up to 1.";
            }
        } else {
            this.grid.columnSizes = [];
            for (let i = 0; i < this.grid.columns; i++) {
                this.grid.columnSizes.push({ column: i, size: 1/this.grid.columns });
            }
        }
    }

    /**
     * Private function.
     * Calculates where each plot in the grid should start, as well as the relative height/width of each plot within the grid
     * @private
     */
    _updateGridInfo() {
        this.grid.rowSizes.sort((a, b) => a.row - b.row);
        this.grid.columnSizes.sort((a, b) => a.column - b.column);
        this.grid.rowSizes.forEach((d, i) => {
            if (i == 0) {
                d.start = 0;
            } else {
                const prev = this.grid.rowSizes[i-1];
                d.start = prev.start + prev.size;
            }
        });
        this.grid.columnSizes.forEach((d, i) => {
            if (i == 0) {
                d.start = 0;
            } else {
                const prev = this.grid.columnSizes[i-1];
                d.start = prev.start + prev.size;
            }
        });

        this.gridInternal.plotSizes = this.grid.rowSizes.map(i => {
            return this.grid.columnSizes.map(j => {
                return {
                    rowSize: i.size,
                    rowStart: i.start,
                    colSize: j.size,
                    colStart: j.start
                };
            });
        });
    }
}
