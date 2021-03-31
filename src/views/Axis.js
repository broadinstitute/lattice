import "../css/Axis.css";
import * as d3 from "d3";
import * as constants from "../utils/constants";

import {axisOrientations, axisTypes, defaultAxisOrientation} from "../utils/constants";
import {isNumericalScale} from "../utils/plot-utils";
/**
 * TODO: document the customizable config the same way as in Plot.js
 */
export default class Axis {
    /**
     * Constructor for Axis object
     * config properties include: scaleType, title, ticks, display, min, max, orientation, padding, angle, text-anchor
    */
    constructor(axisType, config={}) {
        this.axisType = axisType;
        Object.keys(config).forEach((attr)=>{
            this[attr] = config[attr];
        });
        this._scale = undefined;
        this._validate();
    }

    /**
     * Verifies that the orientation makes sense for the axis
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
     * @param {d3 Selection} svg - plot d3 selection group
     * @param {Plot} plot
     */
    _renderLabel(svg, plot) {
        if (this.title === undefined) return;
        const label = svg.append("text")
            .attr("class", `ljs--${this.axisType}-axis-label`)
            .html(this.title);

        switch(this.orientation) {
        case(axisOrientations.BOTTOM):
            label.attr("x", plot.innerWidth/2).attr("y", plot.height - plot.padding.bottom/2).attr("text-anchor", "middle");
            break;
        case(axisOrientations.TOP):
            label.attr("x", plot.innerWidth/2).attr("text-anchor", "middle");
            break;
        case(axisOrientations.LEFT):
            label.attr("x", -plot.padding.left).attr("text-anchor", "end");
            break;
        case(defaultAxisOrientation.RIGHT):
            label.attr("x", `${plot.innerWidth}`).attr("text-anchor", "start");
            break;
        }
    }

    /**
     * Renders the axis
     * @param {d3 Selection} svg - plot d3 selection group
     * @param {Plot} a Plot object
     */
    render(svg, plot) {
        if (!this.display) return;

        let axis;
        const axisId = `${this.axisType}-axis`;
        let axisFn = this._getAxisFn(this.orientation).scale(this._scale);

        if (!plot.hasRendered) {
            axis = svg.append("g").attr("class", `ljs--${axisId}`);
            this._renderLabel(svg, plot);
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

        if (this.angle != 0){
            axis.selectAll("text")
                .attr("dy", "-1em")
                .attr("transform", `translate(0, 7) rotate(${this.angle})`); 
        }
        if (this["text-anchor"]){
            axis.selectAll("text")
                .style("text-anchor", this["text-anchor"]);
        }
    }

    /**
     * Creates a scale for the axis
     * @param {[min, max]} domain 
     * @param {[low, high]} range 
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