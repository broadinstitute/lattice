import * as d3 from "d3";

/**
 * Determines all columns that pertain to a particular data type based off a search keyword.
 */
export const getDataColumns = (columns, searchKeyword) => {
  return columns.filter((d) => d.includes(searchKeyword));
};

const createDataSeries = (seriesColumns, panel) => {
  if (seriesColumns.length > panel.colors.length) {
    console.warn(
      `${panel.id} stacked bar chart data: ${seriesColumns.length} data columns found. Only ${panel.colors.length} provided`
    );
  }

  return seriesColumns.map((d, i) => {
    return {
      column: d,
      name: d.replace(panel.searchKeyword, ""),
      color: panel.colors[i],
    };
  });
};

/**
 * Creates an object with category counts and totals for all "y" values in a categorical heatmap
 * @param {Array} data - Categorical heatmap main panel plot data. Generated from parseCategoricalHeatmapData
 */
export const getPanelCountData = (data) => {
  const countsByGroup = d3
    .nest()
    .key((d) => d.y)
    .key((d) => d.c)
    .rollup((v) => v.length)
    .entries(data);

  const counts = {};
  countsByGroup.forEach((g) => {
    const y = g.key;
    counts[y] = {};
    g.values.forEach((k) => {
      const c = k.key;
      const count = k.value;
      counts[y][c] = count;
      if (counts[y]["total"] === undefined) {
        counts[y]["total"] = count;
      } else {
        counts[y]["total"] += count;
      }
    });
  });
  return counts;
};

/**
 * Creates plot data from count data generated for a categorical heatmap.
 */
export const parseStackedCountData = (data, panel) => {
  const countSeries = panel.colors.map((c, i) => {
    return {
      name: i.toString(),
      color: c,
    };
  });

  const plotData = [];
  Object.keys(data).forEach((y) => {
    Object.keys(data[y]).forEach((c) => {
      if (c !== "total") {
        plotData.push({
          series: c,
          x: data[y][c],
          y: y,
        });
      }
    });
  });

  return {
    plotData: plotData,
    series: countSeries,
  };
};

/**
 * Parses q-value heatmap data from JSON file for a specific panel and generates plot data.
 */
export const parseQValData = (data, panel) => {
  const dataTransform = dataTransformer.Q;
  const qData = data.data["all_q"];
  const columns = getDataColumns(data.sets, panel.searchKeyword);
  const plotData = [];

  columns.forEach((col) => {
    const y = col.replace(panel.searchKeyword, "");
    const c = dataTransform(qData[col]);
    if (c !== undefined) {
      plotData.push({
        x: 0,
        y: y,
        c: c,
      });
    }
  });

  const cMax = d3.max(plotData, (d) => d.c);
  const cDomain = [0, cMax];

  return {
    plotData: plotData,
    cDomain: cDomain,
  };
};

/**
 * Data transformations for specific data types. Used for generating plot data.
 */
export const dataTransformer = {
  default: (val) => val,
  Q: (val) => -Math.log10(val),
  MutationRate: (val) => {
    const ONE_MB = 1000000;
    return val === undefined ? 0 : val * ONE_MB;
  },
  MutationSignature: (val) => (val === undefined ? 0 : val),
  GeneMutation: (val) => (val ? val : undefined),
  CopyNumberGain: (val) => (val ? val : undefined),
};

/**
 * Parses out stacked barchart data from a JSON file and generates plot data.
 * undefined values are not displayed
 */
export const parseStackedData = (data, panel) => {
  const columns = getDataColumns(data.sets, panel.searchKeyword);
  const series = createDataSeries(columns, panel);
  const dataTransform =
    dataTransformer[panel.id] === undefined
      ? dataTransformer.default
      : dataTransformer[panel.id];
  const plotData = [];
  const sums = {};

  data.samples.forEach((sId) => {
    if (sId == "all_q") return;
    series.forEach((c) => {
      const y = dataTransform(data.data[sId][c.column]);
      if (y !== undefined) {
        plotData.push({
          series: c.name,
          x: sId,
          y: y,
        });

        sums[sId] = sums[sId] == undefined ? y : sums[sId] + y;
      }
    });
  });

  return {
    columns: columns,
    series: series,
    plotData: plotData,
    sums: sums,
  };
};

/**
 * Parses out stacked barchart data from a JSON file and generates plot data.
 * undefined values are not displayed
 */
export const parseCategoricalHeatmapData = (data, panel) => {
  const sampleData = data.data;
  const columns = getDataColumns(data.sets, panel.searchKeyword);
  const dataTransform =
    dataTransformer[panel.id] === undefined
      ? dataTransformer.default
      : dataTransformer[panel.id];
  const plotData = [];

  data.samples.forEach((sId) => {
    if (sId == "all_q") return;
    columns.forEach((col) => {
      const y = col.replace(panel.searchKeyword, "");
      const c = dataTransform(sampleData[sId][col]);
      if (c !== undefined) {
        plotData.push({
          x: sId,
          y: y,
          c: c,
        });
      }
    });
  });
  return {
    columns: columns,
    plotData: plotData,
  };
};

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
// const coMutDataParser = {
//     MutationRate: {
//         panel: undefined,
//         legend: (data, panel) => {
//             const columns = data.sets.filter(d => d.includes(panel.searchKeyword));

//             if (columns.length > panel.colors.length) {
//                 console.warn(`${columns.length} gene mutation data columns found. Only ${panel.colors.length} provided`);
//             }

//             const mutationRateCategories = columns.map((d, i) => {
//                 return {
//                     column: d,
//                     name: d.replace(panel.searchKeyword, ""),
//                     color: panel.colors[i]
//                 };
//             });
//             return mutationRateCategories;
//         },
//         sort: (samples, data, panel, sortOrder) => {
//             // using spread syntax to make copy of array for sorting
//             const sumsToSort = panel.calculated.sum.filter(d => samples.includes(d.id));
//             sumsToSort.sort((a, b) => {
//                 if (sortOrder == 1) {
//                     return a.sum - b.sum;
//                 } else {
//                     return b.sum - a.sum;
//                 }
//             });
//             return sumsToSort.map(d => d.id);
//         }
//     },
//     MutationSignature: {
//         panel: undefined,
//         sort: (samples, data, panel, sortOrder) => {
//             // using spread syntax to make copy of array for sorting
//             const sumsToSort = panel.calculated.sum.filter(d => samples.includes(d.id));
//             sumsToSort.sort((a, b) => {
//                 if (sortOrder == 1) {
//                     return a.sum - b.sum;
//                 } else {
//                     return b.sum - a.sum;
//                 }
//             });
//             return sumsToSort.map(d => d.id);
//         },
//         legend: (data, panel) => {
//             const columns = data.sets.filter(d => d.includes(panel.searchKeyword));

//             if (columns.length > panel.colors.length) {
//                 console.warn(`${columns.length} gene signature data columns found. Only ${panel.colors.length} provided`);
//             }

//             const mutationSigCategories = columns.map((d, i) => {
//                 return {
//                     column: d,
//                     name: d.replace(panel.searchKeyword, ""),
//                     color: panel.colors[i]
//                 };
//             });
//             return mutationSigCategories;
//         }
//     },
//     // TODO: explicitly ensure the y-axis of the 3 plots are the same. is currently implicitly happening.
//     GeneMutation: {
//         panel: (data, panelInfo, config) => {
//             const GENE_MUT_COLS = data.sets.filter(d => d.indexOf(panelInfo.searchKeyword) !== -1);
//             const mutationTypeByGene = {};
//             const mutationCountByGene = {};
//             GENE_MUT_COLS.forEach(d => {
//                 mutationTypeByGene[d] = {};
//                 mutationCountByGene[d] = { geneKey: d, sum: 0 };
//             });

//             // filling in variables needed to calculate values needed for gene mutation panel. saving to config
//             data.samples.forEach(d => {
//                 if (config.excludedSamples.indexOf(d) == -1) {
//                     GENE_MUT_COLS.forEach(g => {
//                         // 0 is "no-mutation"
//                         if (data.data[d][g] !== undefined && data.data[d][g] != 0) {
//                             mutationCountByGene[g].sum++;
//                             mutationTypeByGene[g][data.data[d][g]] = mutationTypeByGene[g][data.data[d][g]] + 1 || 1;
//                         }
//                     });
//                 }
//             });
//             const geneSumList = Object.values(mutationCountByGene);
//             geneSumList.sort((a, b) => b.sum - a.sum);
//             const FILTERED_GENE_MUT_COLS = geneSumList.slice(0, panelInfo.rowsDisplayed).map(d => d.geneKey);

//             panelInfo.geneMutColumns = GENE_MUT_COLS;
//             panelInfo.mutationCountByGene = mutationTypeByGene;
//             panelInfo.mutationTypeByGene = mutationTypeByGene;
//             panelInfo.yAxisCols = FILTERED_GENE_MUT_COLS;
//         },
//         sort: (samples, data, panel, sortOrder) => {
//             /**
//              * Recursive sort function that makes it possible to sort all data by multiple genes.
//              */
//             let sortByGene = (samples, sortColNum, sortCols, data, panel, sortOrder) => {
//                 if (sortColNum >= sortCols.length || samples.length == 1) {
//                     return samples;
//                 } else {
//                     const geneCol = sortCols[sortColNum];
//                     const sampleValList = samples.map(sId => {
//                         return {
//                             sId: sId,
//                             val: data.data[sId][geneCol] === undefined ? 0 : data.data[sId][geneCol]
//                         };
//                     });
//                     const groups = d3.nest()
//                         .key(d => +d.val)
//                         .entries(sampleValList);
//                     groups.sort((a, b) => {
//                         if (sortOrder == 1) {
//                             return a.key - b.key;
//                         } else {
//                             return b.key - a.key;
//                         }
//                     });
//                     let sampleGroups = groups.map(d => { return d.values.map(s => s.sId); });
//                     let sortedSamples = [];
//                     const recSampleGroups = sampleGroups.map(d => sortByGene(d, sortColNum+1, sortCols, data, panel, sortOrder));
//                     recSampleGroups.forEach(d => {sortedSamples = sortedSamples.concat(d);});
//                     return sortedSamples;
//                 }
//             };
//             const geneColsToSortBy = panel.yAxisCols;
//             let sortedSamples = sortByGene(samples, 0, geneColsToSortBy, data, panel, sortOrder);
//             return sortedSamples;
//         },
//         legend: (data, panel) => {
//             const geneMutationGroups = panel.colors.map((d, i) => {
//                 return {
//                     name: i,
//                     color: d
//                 };
//             });
//             return geneMutationGroups;
//         }
//     }
// };
