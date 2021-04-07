import * as d3 from "d3";
import * as constants from "../utils/constants";

import {axisOrientations, axisTypes, defaultAxisOrientation} from "../utils/constants";
import {isNumericalScale} from "../utils/plot-utils";


/**
 * TODO: document the customizable config the same way as in Plot.js
 * @description Axis class
 */
export class Axis {
    /**
     * 
     * @param {AxisType} axisType axis type
     * @param {Object} [config] config object to override customizable properties 
     * @property [scaleType] scale type auto-detected if undefined
     * @property {String} [title=undefined] axis title
     * @property {Number} [min] applicable for a numerical scale
     * @property {Number} [max] applicable for a numerical scale

     */
    constructor(axisType, config={}) {
        this.axisType = axisType;

        this.scaleType = undefined;
        this.title = undefined;
        this.orientation = undefined;
        this.padding = 0.15
        this.textAngle = 0;
        this.textAnchor = undefined;
        this.display = true;
        this.hideAxis = false;
        this.hideTicks = false;
        this.hideLabels = false;
        this.hideTitle = false;
        this.min = undefined;
        this.max = undefined;
        Object.keys(config).forEach((attr)=>{
            this[attr] = config[attr];
        });
        this._scale = undefined;
        this._validate();
        this.customizableProp = [
            "scaleType", 
            "title", 
            "orientation",
            "padding",
            "textAngle",
            "textAnchor",
            "display",
            "hideAxis",
            "hideTicks",
            "hideLabels",
            "hideTitle",
            "min",
            "max"
        ];
    }

    /**
     * @description reports what properties of the Axis object are customizable
     * @public
     */
    getCustomizable(){
        let config = {};
        this.customizableProp.forEach((prop)=>{
            config[prop] = this[prop];
        });
        return config;
    }

    /**
     * Verifies that the orientation makes sense for the axis
     * @private
     */
    _validate() {
        if (this.axisType == axisTypes.X && !([axisOrientations.TOP, axisOrientations.BOTTOM].includes(this.orientation))) {
            throw `Invalid orientation ${this.orientation} found for ${this.axisType} axis`;
        }

        if (this.axisType == axisTypes.Y && ![axisOrientations.LEFT, axisOrientations.RIGHT].includes(this.orientation)) {
            throw `Invalid orientation ${this.orientation} found for ${this.axisType} axis`;
        }
    }

    /** 
     * Determines the correct axis generator function to use based off Axis orientation
     * @private
     */
    _getAxisFn(orientation) {
        switch(orientation) {
        case(axisOrientations.BOTTOM):
            return d3.axisBottom();
        case(axisOrientations.TOP):
            return d3.axisTop();
        case(axisOrientations.LEFT):
            return d3.axisLeft();
        case(axisOrientations.RIGHT):
            return d3.axisRight();
        default:
            console.error(`unrecognized axis orientation ${orientation}`);
        }
    }

    /**
     * Renders the label
     * @param {Object} svg - plot d3 selection group
     * @param {Plot} plot
     * @private
     */
    _renderTitle(svg, plot) {
        if (plot.hasRendered || !this.display || this.title === undefined || this.hideTitle) return;
        const label = svg.append("text")
            .attr("class", `ljs--${this.axisType}-axis-title`)
            .html(this.title);

        switch(this.orientation) {
        case(axisOrientations.BOTTOM):
            label.attr("x", plot.innerWidth/2).attr("y", plot.height - plot.padding.bottom/2).attr("text-anchor", "middle");
            break;
        case(axisOrientations.TOP):
            label.attr("x", plot.innerWidth/2).attr("text-anchor", "middle");
            break;
        case(axisOrientations.LEFT):
            label.attr("x", -plot.padding.left/2).attr("y", -plot.padding.top/2).attr("text-anchor", "middle");
            break;
        case(defaultAxisOrientation.RIGHT):
            label.attr("x", `${plot.innerWidth}`).attr("text-anchor", "start");
            break;
        }
    }

    /**
     * Renders the axis
     * @param {Object} svg - plot d3 selection group
     * @param {Plot} a Plot object
     * @public
     */
    render(svg, plot) {
        if (!this.display) return;
        this._renderTitle(svg, plot);
        if (this.hideAxis) return;

        let axis;
        const axisId = `${this.axisType}-axis`;
        let axisFn = this._getAxisFn(this.orientation).scale(this._scale).tickSizeOuter(0);

        if (!plot.hasRendered) {
            axis = svg.append("g").attr("class", `ljs--${axisId}`);
            if (isNumericalScale(this.scaleType)) {
                axisFn = axisFn.ticks(this.ticks);
            }
            // translating axis to the appropriate location if necessary
            if (this.orientation == axisOrientations.BOTTOM) {
                axis.attr("transform", `translate(0,${plot.innerHeight})`);
                
            } else if (this.orientation == axisOrientations.RIGHT) {
                axis.attr("transform", `translate(${plot.innerWidth}, 0)`);
            }
            axis.call(axisFn);
            
        } else {
            // TODO: need to test if text transformation remains in effect.
            axis = svg.select(`.${axisId}`);
            axis.transition().duration(1000).call(axisFn);
        }

        if (this.textAngle != 0){
            axis.selectAll("text")
                .attr("dy", "-0.8em")
                .attr("transform", `translate(0, 7) rotate(${this.textAngle})`); 
        }
        if (this.textAnchor){
            axis.selectAll("text")
                .style("text-anchor", this.textAnchor);
        }
        if (this.hideLabels) {
            axis.selectAll(".tick > text").remove();
        }
        if (this.hideTicks) {
            axis.selectAll(".tick > line").remove();
        }
    }

    /**
     * Creates a scale for the axis
     * @param {Number[]} domain [min, max]
     * @param {Number[]} range [low, high]
     * @public
     */
    createScale(domain, range){ 
        if (this.min !== undefined) domain[0] = this.min;
        if (this.max !== undefined) domain[1] = this.max;
        const types = constants.scales;
        switch(this.scaleType){
        case types.CATEGORICAL:
            this._scale = d3.scaleBand().padding([this.padding]);
            break;
        case types.LINEAR:
            this._scale = d3.scaleLinear();
            break;
        case types.TEMPORAL:
            this._scale = d3.scaleTime();
            break;
        default:
            console.error("Unknown scale type: ", this.scaleType);
        }
        return this._scale.domain(domain).range(range);
    }
}