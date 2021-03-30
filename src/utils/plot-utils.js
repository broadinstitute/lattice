import * as d3 from "d3";
import {NUMERICAL_SCALES} from "./constants";

/**
 * Creates an SVG element in the given rootId and returns it.
 * @param {*} rootId 
 * @param {*} width 
 * @param {*} height 
 */
export function createSvg(rootId, width, height) {
    const root = d3.select(`#${rootId}`);

    if (root.empty()) {
        console.error(`Element with id ${rootId} not found`);
        throw `Element with id ${rootId} not found`;
    }
    // create svg
    const svgId = `${rootId}-svg`;
    root.append("svg").attr("id", svgId)
        .attr("width", width)
        .attr("height", height);
    return svgId;
}

/**
 * Creates a group in the given rootId and returns it.
 * @param {String} parentId
 * @param {Object} padding
 * @param {String} tag  - id to be appended to end of the group name in the form of config.rootId-id
 */
export function createGroup(parentId, padding, tag) {
    if (parentId === undefined) {
        console.error("parentId not provided for creating new group for plot");
        throw "parentId not provided for creating new group for plot";
    }

    const parent = d3.select(`#${parentId}`);
    if (parent.empty()) {
        console.error(`Element with id ${parentId} not found`);
        throw `Element with id ${parentId} not found`;
    }
    const g = parent.append("g").attr("id", `${parentId}-${tag}`)
        .attr("transform", `translate(${padding.left}, ${padding.top})`);
    return g;
}

/**
 * Creates a d3 scale with a domain and range.
 * Defaults to a linear scale if none of the other cases are found.
 * @param {String} type - type of scale to create
 * @param {Array} domain - array for specifying the domain. Expected to be in format of [min, ..., max]
 * @param {Array} range - array for specifying the range. Expected to be in format of [min, ..., max]
 * @param {Function?} interpolator - d3 interpolator function for specifying color scale
 * @param {Float?} padding - amount of padding between each ordinal band scale. 0 <= padding <=1
 */
// export function createScale(type, domain, range, {interpolator=undefined, padding=.15} = {}) {
//     let scale;
//     switch(type) {
//     case scales.CATEGORICAL:
//         scale = d3.scaleBand().padding([padding]);
//         break;
//     case scales.LINEAR:
//         scale = d3.scaleLinear();
//         break;
//     case scales.ORDINAL:
//         scale = d3.scaleOrdinal();
//         scale.unknown(undefined); // so that unknown inputs aren't implicitly assigned a value
//         break;
//     case scales.SEQUENTIAL:
//         scale = d3.scaleSequential(interpolator);
//         return scale.domain(domain);
//     case scales.SQRT:
//         scale = d3.scaleSqrt();
//         break;
//     case scales.TEMPORAL:
//         scale = d3.scaleTime();
//         break;
//     default:
//         console.error(`unrecognized scale type ${type}`);
//     }

//     return scale.range(range).domain(domain);
    
// }

export function isNumericalScale(type) {
    return NUMERICAL_SCALES.indexOf(type) != -1;
}