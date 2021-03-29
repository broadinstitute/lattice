import { PatternLattice } from "../../../../src/controllers/PatternLattice";
import * as d3 from "d3";

// const testFile = "/data/ACC-TP.coMut_table.json";
const testFile = "/data/SARC-TP.coMut_table.json";

const ONE_MB = 1000000;
const SUMMARY_SAMPLE = "all_q";

const config = {
    summarySample: "all_q",
    mutationRate: { // for stacked column chart
        prefix: "rate_",
        colors: ["#376770", "#9bcad3"]
    },
    mutationSignature: { // for stacked column chart
        prefix: "MutsigCateg_",
        colors: ["#C72C43", "#F67F55", "#FCD97F", "#E2F590", "#8BCD84"]
    },
    geneMutation: { // for heatmap + stacked bar chart
        prefix: "SMG_mutsig_",
        colors: ["#FFF", "#59D0F4", "#376770", "#639D4B", "#004080", "#0080ff", "#A6DA8F", "#EA89DA", "#DA5C5C"],
        sort: true,
        rowsDisplayed: 25
    },
    clusters: { // for clustering strip plots
        colors: ["#A6C780", "#60B1BE", "#F6BE79", "#CF8181", "#90bbc1", "#97426A", "#BDF7FD", "#8F999A", "#4379A8", "#e5a5d4"],
        keys: [...Array(10)].map((_, i) => i+1) // cluster numbering starts at 1
    },
    colors: {
        generic: ["#BDF7FD", "#febf85", "#B87DB2", "#388885", "#C1EFAE", "#845930", "#1F4951", "#376770", "#ad5b56", "#e6a561", "#333333", "#3a4b4d", "#6f9196", "#d1d1d1"]
    },
    mRNASeqCNMF: {
        field: "CLUS_miRseq_cNMF"
    },
    mRNASeqCHier: {
        field: "CLUS_miRseq_cHierarchical"
    },
    histology: {
        field: "CLI_histology"
    }
};

let MUTATION_RATE_CATS = [];
let MUT_SIG_CATS = [];
let GENE_MUT_COLS = [];

/**
 * Generates a list of objects needed for a particular data type
 * @param {Array{String}} columns - Full list of comutation data file headers
 * @param {String} prefix - Prefix in column headers denoting it as a column of interest
 * @param {Array{String}} colors - List of colors to use with this particular datatype
 * @param {Array} arr - Array that the info should be stored in
 */
function generateDataInfoList(columns, prefix, colors, arr) {
    const filteredCols = columns.filter(d => d.includes(prefix));
    if (arr.length) {
        console.warn(`Array passed in to create objects for data with prefix ${prefix} is not empty and may cause errors.`);
    }
    if (filteredCols.length > colors.length) {
        console.warn(`Not enough colors to use a different one for each column in array ${filteredCols.join(", ")} for data with prefix ${prefix}`);
    }

    filteredCols.forEach((d, i) => {
        arr.push({
            column: d,
            name: d.replace(prefix, ""),
            color: colors[i]
        });
    });
}

/**
 * Uses information from the configs + comut file headers to populate necessary variables
 * @param {Array{String}} columns - List of columns from comutation data file
 */
function populateVariables(columns) {
    generateDataInfoList(columns, config.mutationRate.prefix, config.mutationRate.colors, MUTATION_RATE_CATS);
    generateDataInfoList(columns, config.mutationSignature.prefix, config.mutationSignature.colors, MUT_SIG_CATS);

    // gene mutation type per sample
    let regex = new RegExp(`^${config.geneMutation.prefix}.*`);
    GENE_MUT_COLS = columns.filter(d => regex.test(d));
}

export function init(rootId) {
    console.log(config);
    d3.json(testFile)
        .then(resp => {
            console.log(resp);
            const data = resp.data;
            const sets = resp.sets;
            const samples = resp.samples;


            populateVariables(sets);

            // PLOT DATA VARIABLES
            const mutRateData = []; // mutation rate stackedcolumnplot
            const mutSigData = []; // mutation signature stackedcolumnplot
            const sampleGeneMutationData = []; // mutation type per gene heatmap
            const mutationsByGeneData = []; // total mutations per gene stackedbarplot
            // horizontal strip plots -- donor/sample attributes
            const histologyData = [];
            // horizontal strip plots -- clustering
            const mRNASeqCNMFData = [];
            const mRNASeqCHierData = [];

            // extra processing
            const mutationTypeByGene = {};
            const mutationSumByGene = {};
            GENE_MUT_COLS.forEach(d => {
                mutationTypeByGene[d] = {};
                mutationSumByGene[d] = { geneKey: d, sum: 0 };
                // mutationTypeByGene[d] = { geneKey: d, sum: 0 };
            });
            const histologyVals = new Set();

            // calculating gene mutation summary list
            samples.forEach(d => {
                GENE_MUT_COLS.forEach(g => {
                    // 0 is "no-mutation"
                    if (data[d][g] !== undefined && data[d][g] != 0) {
                        mutationSumByGene[g].sum++;
                    }
                });
            });
            const geneSumList = Object.values(mutationSumByGene);
            geneSumList.sort((a, b) => b.sum - a.sum);
            const FILTERED_GENE_MUT_COLS = geneSumList.slice(0, config.geneMutation.rowsDisplayed).map(d => d.geneKey);


            samples.forEach(d => {
                if (d != SUMMARY_SAMPLE) {
                    MUTATION_RATE_CATS.forEach(c => {
                        mutRateData.push({ series: c.name, x: d, y: data[d][c.column] ? data[d][c.column] * ONE_MB : 0 });
                    });

                    MUT_SIG_CATS.forEach(c => {
                        mutSigData.push({ series: c.name, x: d, y: data[d][c.column] ? data[d][c.column] : 0 });
                    });

                    FILTERED_GENE_MUT_COLS.forEach(g => {
                        if (data[d][g] !== undefined) {
                            sampleGeneMutationData.push( {x: d, y: g.replace(config.geneMutation.prefix, ""), c: data[d][g] });
                            mutationTypeByGene[g][data[d][g]] = mutationTypeByGene[g][data[d][g]] + 1 || 1;
                            if (data[d][g] != 0) {
                                mutationSumByGene[g].sum++;
                            }
                        }
                    });
                    if (data[d][config.histology.field] !== undefined) histologyData.push({ x: d, y: 0, c: data[d][config.histology.field] });
                    if (data[d][config.mRNASeqCNMF.field] !== undefined) mRNASeqCNMFData.push({ x: d, y: 0, c: data[d][config.mRNASeqCNMF.field] });
                    if (data[d][config.mRNASeqCHier.field] !== undefined) mRNASeqCHierData.push({ x: d, y: 0, c: data[d][config.mRNASeqCHier.field] });

                    // to get the keys
                    histologyVals.add(data[d][config.histology.field]);
                }
            });

            

            Object.keys(mutationTypeByGene).forEach(geneCol => {
                const gene = geneCol.replace(config.geneMutation.prefix, "");
                Object.keys(geneCol).forEach(d => {
                    // filtering out the "0" series, since it's not displayed in this chart
                    if (mutationTypeByGene[geneCol][d] !== undefined && d != "0") {
                        mutationsByGeneData.push({
                            x: mutationTypeByGene[geneCol][d],
                            y: gene,
                            series: d
                        });
                    }
                });
            });
            
            const latticePlotData = [
                {
                    row: 0, column: 1,
                    data: mutRateData,
                    type: "stackedcolumnplot",
                    series: MUTATION_RATE_CATS,
                    xAxis: { display: false },
                    padding: { top: 10, bottom: 10, right: 10 }
                }, {
                    row: 1, column: 1,
                    data: mutSigData,
                    type: "stackedcolumnplot",
                    series: MUT_SIG_CATS,
                    xAxis: { display: false },
                    padding: { top: 10, bottom: 10, right: 10 }
                }, {
                    row: 2, column: 0,
                    data: mutationsByGeneData,
                    type: "stackedbarplot",
                    orientation: -1,
                    series: config.geneMutation.colors.map((d, i) => {
                        return { name: i.toString(), color: d };
                    }),
                    yAxis: { display: false },
                    padding: { top: 10, bottom: 10, right: 25 }
                }, {
                    row: 2, column: 1,
                    data: sampleGeneMutationData,
                    type: "categoricalheatmap",
                    xAxis: {display: false},
                    cAxis: { domain: [...Array(config.geneMutation.colors.length).keys()], range: config.geneMutation.colors },
                    padding: { top: 10, bottom: 10, right: 10 }
                }, {
                    row: 3, column: 1,
                    data: histologyData,
                    type: "categoricalheatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: { domain: Array.from(histologyVals), range: Array.from(histologyVals).map((_, i) => config.colors.generic[i]) },
                    padding: { top: 3, bottom: 3, right: 10 }
                }, {
                    row: 4, column: 1,
                    data: mRNASeqCNMFData,
                    type: "categoricalheatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: { domain: config.clusters.keys, range: config.clusters.colors },
                    padding: { top: 3, bottom: 3, right: 10 }
                }, {
                    row: 5, column: 1,
                    data: mRNASeqCHierData,
                    type: "categoricalheatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: { domain: config.clusters.keys, range: config.clusters.colors },
                    padding: { top: 3, bottom: 3, right: 10 }
                }
            ];
            const latticeConfig = {
                width: window.innerWidth * .9,
                height: window.innerHeight * .9,
                grid: {
                    rowSizes: [
                        { row: 0, size: 0.15 },
                        { row: 1, size: 0.15 },
                        { row: 2, size: 0.55 },
                        { row: 3, size: 0.05 },
                        { row: 4, size: 0.05 },
                        { row: 5, size: 0.05 }
                    ],
                    columnSizes: [
                        { column: 0, size: 0.2 },
                        { column: 1, size: 0.8 },
                    ]
                }
            };
            const lattice = new PatternLattice(latticePlotData, rootId, latticeConfig);

            // ensuring everything in the main plot has the same x-axis
            const xAxisDomain = samples.filter(d => d != config.summarySample);
            const geneMutYAxisDomain = FILTERED_GENE_MUT_COLS.map(d => d.replace(config.geneMutation.prefix, ""));
            lattice.config.plots.forEach(d => {
                if (d.column == 1) {
                    d.config.xScale.domain(xAxisDomain);
                }
                if (d.row == 2) {
                    d.config.yScale.domain(geneMutYAxisDomain);
                }
            });
            lattice.render();
        });
}