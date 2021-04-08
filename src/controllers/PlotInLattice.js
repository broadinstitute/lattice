import {Plot} from "./Plot";
/**
 * @description PlotInLattice class is a plot in a lattice
 * @augments Plot
 */
export class PlotInLattice extends Plot {
    /**
     * @constructor
     * @param {Integer} row 
     * @param {Integer} column 
     * @param {Point2D[]|Object[]} data 
     * @param {PlotType} type 
     * @param {String} rootId 
     * @param {PlotKernel|Object} [config] customization 
     */
    constructor(row, column, data, type, rootId, config){
        super(data, type, rootId, config);
        this.row = row;
        this.column = column;
    }

    rowStart(grids){
        return grids[this.row][this.column].rowStart;
    }

    colStart(grids){
        return grids[this.row][this.column].colStart;
    }
}