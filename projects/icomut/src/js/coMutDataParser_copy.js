import { plots } from "../../../../src/utils/constants";
import * as d3 from "d3";

/**
 * Data parsers for each data type to be displayed in the co-mutation visualization.
 * Each key (e.g. MutationRate, MutationSignature, etc.) corresponds to the name of a panel listed in config.json
 * Within each key, the "panel" attribute is used as a function for any pre-processing needed for that particular panel.
 * Any modifications made are stored with that panel's in the iCoMut object's copy of the config.
 * Other attributes correspond to particular plot types displayed for that panel and correspond to the 
 * panel's plot's "plotType" attribute in config.json, as well as a PatternViz library plot type
 * 
 * Panel processing functions are always passed the data, panel, and config objects.
 * Plot parsers are always passed the data, plot, panel, and config objects.
 * Panel sort functions are always passed a list of samples (to sort by), the original data, panel object, and a sort order value (-1 and 1)
 * 
 * Parser may update the panel or plot object with a "calculated" attribute to be used for interactivity purposes,
 * e.g. calculated sums for sorting the mutation rate or mutation signature
 */
export const coMutDataParser = {
    MutationRate: {
        panel: undefined,
        legend: (data, panel) => {
            const columns = data.sets.filter(d => d.includes(panel.searchKeyword));

            if (columns.length > panel.colors.length) {
                console.warn(`${columns.length} gene mutation data columns found. Only ${panel.colors.length} provided`);
            }

            const mutationRateCategories = columns.map((d, i) => {
                return {
                    column: d,
                    name: d.replace(panel.searchKeyword, ""),
                    color: panel.colors[i]
                };
            });
            return mutationRateCategories;
        },
        sort: (samples, data, panel, sortOrder) => {
            // using spread syntax to make copy of array for sorting
            const sumsToSort = panel.calculated.sum.filter(d => samples.includes(d.id));
            sumsToSort.sort((a, b) => { 
                if (sortOrder == 1) {
                    return a.sum - b.sum; 
                } else {
                    return b.sum - a.sum;
                }
            });
            return sumsToSort.map(d => d.id);           
        },
        [plots.STACKEDCOLUMN]: (data, plot, panel, config) => {
            const ONE_MB = 1000000;
            const plotData = [];

            const columns = data.sets.filter(d => d.includes(panel.searchKeyword));
            if (columns.length > panel.colors.length) {
                console.warn(`${columns.length} gene mutation data columns found. Only ${panel.colors.length} provided`);
            }

            const mutationRateCategories = columns.map((d, i) => {
                return {
                    column: d,
                    name: d.replace(panel.searchKeyword, ""),
                    color: panel.colors[i]
                };
            });
            const mutationRateSums = {}; // pre-calculating for sorting purposes
            data.samples.forEach(sId => {
                if (config.excludedSamples.indexOf(sId) == -1) {
                    mutationRateCategories.forEach(c => {
                        const y = data.data[sId][c.column] ? data.data[sId][c.column] * ONE_MB : 0;
                        plotData.push({ series: c.name, x: sId, y: y });

                        if (mutationRateSums[sId] === undefined) {
                            mutationRateSums[sId] = y;
                        } else {
                            mutationRateSums[sId] += y;
                        }
                    });
                }
            });
            plot.calculated = {
                plotData: plotData,
                categories: mutationRateCategories,
            };
            panel.calculated = {
                sum: Object.keys(mutationRateSums).map(d => { return {id: d, sum: mutationRateSums[d]}; })
            };
            return {
                row: plot.row, column: plot.column,
                data: plotData,
                type: plot.plotType,
                series: mutationRateCategories,
                axis: plot.plotOptions.axis,
                padding: plot.plotOptions.padding,
                tooltip: {
                    formatter: (d) => {
                        const tooltipDataList = Object.keys(d.data).map(x => `${x}: ${d.data[x]}`);
                        const tooltipData = tooltipDataList.join("<br/>");
                        return tooltipData;
                    }
                }
            };
        }
    },
    MutationSignature: {
        panel: undefined,
        sort: (samples, data, panel, sortOrder) => {
            // using spread syntax to make copy of array for sorting
            const sumsToSort = panel.calculated.sum.filter(d => samples.includes(d.id));
            sumsToSort.sort((a, b) => { 
                if (sortOrder == 1) {
                    return a.sum - b.sum; 
                } else {
                    return b.sum - a.sum;
                }
            });
            return sumsToSort.map(d => d.id);      
        },
        legend: (data, panel) => {
            const columns = data.sets.filter(d => d.includes(panel.searchKeyword));

            if (columns.length > panel.colors.length) {
                console.warn(`${columns.length} gene signature data columns found. Only ${panel.colors.length} provided`);
            }

            const mutationSigCategories = columns.map((d, i) => {
                return {
                    column: d,
                    name: d.replace(panel.searchKeyword, ""),
                    color: panel.colors[i]
                };
            });
            return mutationSigCategories;
        },
        [plots.STACKEDCOLUMN]: (data, plot, panel, config) => {
            const plotData = [];

            const columns = data.sets.filter(d => d.includes(panel.searchKeyword));
            if (columns.length > panel.colors.length) {
                console.warn(`${columns.length} mutation signature data columns found. Only ${panel.colors.length} provided`);
            }

            const mutationSigSums = {};
            const mutSigCategories = columns.map((d, i) => {
                return {
                    column: d,
                    name: d.replace(panel.searchKeyword, ""),
                    color: panel.colors[i]
                };
            });
            data.samples.forEach(sId => {
                if (config.excludedSamples.indexOf(sId) == -1) {
                    mutationSigSums[sId] = 0; 
                    mutSigCategories.forEach(c => {
                        if (data.data[sId][c.column]) {
                            plotData.push({ series: c.name, x: sId, y: data.data[sId][c.column]});
                            mutationSigSums[sId] += data.data[sId][c.column];
                        }
                    });
                }
            });
            panel.calculated = {
                sum: Object.keys(mutationSigSums).map(d => { return {id: d, sum: mutationSigSums[d]}; })
            };
            return {
                row: plot.row, column: plot.column,
                data: plotData,
                type: plot.plotType,
                series: mutSigCategories,
                axis: plot.plotOptions.axis,
                padding: plot.plotOptions.padding,
                tooltip: {
                    formatter: (d) => {
                        const tooltipDataList = Object.keys(d.data).map(x => `${x}: ${d.data[x]}`);
                        const tooltipData = tooltipDataList.join("<br/>");
                        return tooltipData;
                    }
                }
            };
        }
    },
    // TODO: explicitly ensure the y-axis of the 3 plots are the same. is currently implicitly happening.
    GeneMutation: {
        panel: (data, panelInfo, config) => {
            const GENE_MUT_COLS = data.sets.filter(d => d.indexOf(panelInfo.searchKeyword) !== -1);
            const mutationTypeByGene = {};
            const mutationCountByGene = {};
            GENE_MUT_COLS.forEach(d => {
                mutationTypeByGene[d] = {};
                mutationCountByGene[d] = { geneKey: d, sum: 0 };
            });

            // filling in variables needed to calculate values needed for gene mutation panel. saving to config
            data.samples.forEach(d => {
                if (config.excludedSamples.indexOf(d) == -1) {
                    GENE_MUT_COLS.forEach(g => {
                        // 0 is "no-mutation"
                        if (data.data[d][g] !== undefined && data.data[d][g] != 0) {
                            mutationCountByGene[g].sum++;
                            mutationTypeByGene[g][data.data[d][g]] = mutationTypeByGene[g][data.data[d][g]] + 1 || 1;
                        }
                    });
                }
            });
            const geneSumList = Object.values(mutationCountByGene);
            geneSumList.sort((a, b) => b.sum - a.sum);
            const FILTERED_GENE_MUT_COLS = geneSumList.slice(0, panelInfo.rowsDisplayed).map(d => d.geneKey);

            panelInfo.geneMutColumns = GENE_MUT_COLS;
            panelInfo.mutationCountByGene = mutationTypeByGene;
            panelInfo.mutationTypeByGene = mutationTypeByGene;
            panelInfo.yAxisCols = FILTERED_GENE_MUT_COLS;
        },
        sort: (samples, data, panel, sortOrder) => {
            /** 
             * Recursive sort function that makes it possible to sort all data by multiple genes.
             */
            let sortByGene = (samples, sortColNum, sortCols, data, panel, sortOrder) => {
                if (sortColNum >= sortCols.length || samples.length == 1) {
                    return samples;
                } else {
                    const geneCol = sortCols[sortColNum];
                    const sampleValList = samples.map(sId => {
                        return {
                            sId: sId,
                            val: data.data[sId][geneCol] === undefined ? 0 : data.data[sId][geneCol]
                        };
                    });
                    const groups = d3.nest()
                        .key(d => +d.val)
                        .entries(sampleValList);
                    groups.sort((a, b) => {
                        if (sortOrder == 1) {
                            return a.key - b.key; 
                        } else {
                            return b.key - a.key;
                        }
                    });
                    let sampleGroups = groups.map(d => { return d.values.map(s => s.sId); });
                    let sortedSamples = [];
                    const recSampleGroups = sampleGroups.map(d => sortByGene(d, sortColNum+1, sortCols, data, panel, sortOrder));
                    recSampleGroups.forEach(d => {sortedSamples = sortedSamples.concat(d);});
                    return sortedSamples;
                }
            };
            const geneColsToSortBy = panel.yAxisCols;
            let sortedSamples = sortByGene(samples, 0, geneColsToSortBy, data, panel, sortOrder);
            return sortedSamples;
        },
        legend: (data, panel) => {
            const geneMutationGroups = panel.colors.map((d, i) => {
                return {
                    name: i,
                    color: d
                };
            });
            return geneMutationGroups;
        },
        [plots.CATEGORICAL_HEATMAP]: (data, plot, panel, config) => {
            const samples = data.samples.filter(d => config.excludedSamples.indexOf(d) == -1);
            const sampleData = data.data;
            const sampleGeneMutationData = [];
            samples.forEach(sample => {
                panel.yAxisCols.forEach(geneCol => {
                    const geneName = geneCol.replace(panel.searchKeyword, "");
                    const sampleGeneMutationType = sampleData[sample][geneCol];
                    if (sampleGeneMutationType !== undefined) {
                        sampleGeneMutationData.push( {x: sample, y: geneName, c: sampleGeneMutationType});
                    }
                });
            });
            plot.calculated = {
                plotData: sampleGeneMutationData
            };
            const plotOptions = {
                ...plot.plotOptions,
                ...{
                    row: plot.row, column: plot.column,
                    type: plot.plotType,
                    data: sampleGeneMutationData,
                }
            };
            plotOptions.axis.c = { domain: [...Array(panel.colors.length).keys()], range: panel.colors };
            return plotOptions;
        },
        [plots.HEATMAP]: (data, plot, panel, config) => {
            const qData = data.data[config.qSample];
            const mutationByGeneLogData = panel.yAxisCols.map(geneCol => {
                const geneName = geneCol.replace(panel.searchKeyword, "");
                return {
                    x: 0,
                    y: geneName,
                    c: -Math.log10(qData[geneCol])
                };
            });
            const cMax = d3.max(mutationByGeneLogData, d=>d.c);
            const cDomain = [0, cMax];
            const plotOptions = {
                ...plot.plotOptions,
                ...{
                    row: plot.row, column: plot.column,
                    type: plot.plotType,
                    data: mutationByGeneLogData
                }
            };
            plotOptions.axis.c = { scaleType: "sequential", domain: cDomain, interpolator: d3.interpolateGreys };
            return plotOptions;
        },
        [plots.STACKEDBAR]: (data, plot, panel, config) => {
            const mutationsByGeneData = [];
            panel.yAxisCols.forEach(geneCol => {
                const geneName = geneCol.replace(panel.searchKeyword, "");
                const geneMutationCounts = panel.mutationTypeByGene[geneCol];
                Object.keys(geneMutationCounts).forEach(mutationType => {
                    const nMutations = panel.mutationTypeByGene[geneCol][mutationType];
                    if (mutationType != "0") {
                        mutationsByGeneData.push({
                            x: nMutations,
                            y: geneName,
                            series: mutationType
                        });
                    }
                });
            });
            return {
                ...plot.plotOptions,
                ...{
                    row: plot.row, column: plot.column,
                    type: plot.plotType,
                    series: panel.colors.map((d, i) => {
                        return { name: i.toString(), color: d };
                    }),
                    data: mutationsByGeneData,
                    tooltip: {
                        formatter: (d) => {
                            const tooltipDataList = Object.keys(d.data).map(x => `${x}: ${d.data[x]}`);
                            const tooltipData = tooltipDataList.join("<br/>");
                            return tooltipData;
                        }
                    }
                }
            };
        }
    }
};
