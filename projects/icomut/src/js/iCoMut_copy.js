import { PatternLattice } from "../../../../src/controllers/PatternLattice";
import * as d3 from "d3";

const testFile = "/data/ACC-TP.coMut_table.json";
// const testFile = "/data/SARC-TP.coMut_table.json";

const ONE_MB = 1000000;
const SUMMARY_SAMPLE = "all_q";
const MUTATION_RATE_CATS = [
    { fileKey: "rate_non", name: "non-synonymous mutations", color: "#376770" },
    { fileKey: "rate_sil", name: "synonymous mutations", color: "#9bcad3" }
];
const MUT_SIG_PREFIX = "MutsigCateg_";
const MUT_SIG_PREFIX_REGEX = RegExp(`^${MUT_SIG_PREFIX}.*`);
let MUT_SIG_CATS = [
    { fileKey: "MutsigCateg_*CpG->T", name: "G->T", color: "#C72C43" },
    { fileKey: "MutsigCateg_*CpG->(G/A)", name: "G->(G/A)", color: "#F67F55" },
    { fileKey: "MutsigCateg_*Cp(A/C/T)->mut", name: "(A/C/T->mut)", color: "#FCD97F" },
    { fileKey: "MutsigCateg_A->G", name: "A->G", color: "#E2F590" },
    { fileKey: "MutsigCateg_A->(T/C)", name: "A->(T/C)", color: "#8BCD84" }
];
const GENE_MUT_PREFIX = "SMG_mutsig_";
const GENE_MUT_PREFIX_REGEX = RegExp(`^${GENE_MUT_PREFIX}.*`); // any set that begins with this key is a gene mutation
const GENE_MUT_TYPE_CATS = [
    // "no mutation category" is not displayed in the stacked bar chart
    { fileKey: 0, name: "no-mutation", color: "#FFFFFF" },
    { fileKey: 1, name: "synonymous", color: "#59D0F4" }, 
    { fileKey: 2, name: "in-frame indel", color: "#376770"},
    { fileKey: 3, name: "other non-synonymous", color: "#639D4B" },
    { fileKey: 4, name: "missense", color: "#004080" },
    { fileKey: 5, name: "splice site", color: "#0080ff" },
    { fileKey: 6, name: "frameshift", color: "#A6DA8F" },
    { fileKey: 7, name: "nonsense", color: "#EA89DA" }
];
const GENE_MUT_MAPPER = {};
GENE_MUT_TYPE_CATS.forEach(d => GENE_MUT_MAPPER[d.fileKey] = d.name);

const AMPLIFICATION_PREFIX = "Amp_";
const AMP_PREFIX_REGEX = RegExp(`^${AMPLIFICATION_PREFIX}.*`);
const AMP_CATS = [
    { fileKey: 0, name: "no change", color: "#FFFFFF" },
    { fileKey: 1, name: "deletion", color: "#2B69CA" },
    { fileKey: 2, name: "loss", color: "#68AEFF" },
    { fileKey: 3, name: "gain", color: "#FF5468" },
    { fileKey: 4, name: "amplification", color: "#FF0825" },
    { fileKey: 5, name: "N/A", color: "#EEE" }
];
const AMP_MAPPER = {};
AMP_CATS.forEach(d => AMP_MAPPER[d.fileKey] = d.name);

const VITAL_STAT_CATS = [
    { name: "deceased", color: "#800040" },
    { name: "alive", color: "#535353" },
    { name: undefined, color: "#AAAAAA" }
];
const GENDER_CATS = [
    { name: "male", color: "#2A5291" },
    { name: "female", color: "#FF0000" },
    { name: undefined, color: "#AAAAAA" }
];
const HISTOLOGY_CATS = [
    { name: "adrenocortical carcinoma- usual type", color: "#BDF7FD" },
    { name: "adrenocortical carcinoma- oncocytic type", color: "#FEBF85" },
    { name: "adrenocortical carcinoma- myxoid type", color: "#B87DB2" },
    { name: undefined, color: "#AAAAAA" }
];
const RACE_CATS = [
    { name: "white", color: "#BDF7FD" },
    { name: "black or african american", color: "#FEBF85" },
    { name: "asian", color: "#B87DB2" },
    { name: undefined, color: "#AAAAAA" }
];
const CLUSTER_CATS = [
    { name: "1", color: "#A6C780" },
    { name: "2", color: "#60B1BE" },
    { name: "3", color: "#F6BE79" },
    { name: "4", color: "#CF8181" },
    { name: "5", color: "#90BBC1" },
    { name: "6", color: "#97426A" },
    { name: "7", color: "#BDF7FD" },
    { name: "8", color: "#8F999A" },
    { name: "9", color: "#4379A8" },
    { name: "10", color: "#E5A5D4" },
    { name: undefined, color: "#AAAAAA" }
];

// donor attributes / sample attributes -- for strip plots
const status = "CLI_vitalstatus";
const gender = "CLI_gender";
const histology = "CLI_histology";
const race = "CLI_race";

// clustering attributes -- for strip plots
const mRNASeqCNMF = "CLUS_miRseq_cNMF";
const mRNASeqCHier = "CLUS_miRseq_cHierarchical";


export function init(rootId) {
    d3.json(testFile)
        .then(resp => {
            console.log(resp);
            const data = resp.data;
            const sets = resp.sets;
            const samples = resp.samples;
            console.log(sets.filter(d => d.includes(MUT_SIG_PREFIX)));
            // VARIABLES THAT HELP WITH PLOTTING DATA
            const geneMutationObj = {}; // object to store mutation data by gene and mutation type
            const amplificationObj = {}; // to store mutation data by amplification type

            // PLOT DATA VARIABLES
            const mutRateData = []; // mutation rate stackedcolumnplot
            const mutSigData = []; // mutation signature stackedcolumnplot
            // horizontal strip plots -- donor/sample attr
            const donorVitalStatusData = [];
            const donorGenderData = [];
            const sampleHistologyData = [];
            const donorRaceData = [];
            // horizontal strip plots -- clustering "#BDF7FD", "#febf85", "#B87DB2", "#388885", "#C1EFAE", "#845930", "#1F4951", "#376770", "#ad5b56", "#e6a561", "#333333", "#3a4b4d", "#6f9196", "#d1d1d1"
            const mRNASeqCNMFData = [];
            const mRNASeqCHierData = [];
            // -log10 vertical strip plots
            // plots with extra setup
            const mutationsByGeneData = []; // num mutations per gene stackedbarplot
            const sampleGeneMutationData = []; // mutation type per gene heatmap
            const amplificationData = []; // copy number gain/amplification heatmap
            const amplificationByLocusData = []; // copy number gain/amplification by genomic location stackedbarplot

            // EXTRA PARSING TO SETUP FOR PLOTTNG
            // finding all the keys that are gene specific data and creating an object from it
            const geneMutationKeys = sets.filter(d => GENE_MUT_PREFIX_REGEX.test(d));
            geneMutationKeys.forEach(d => {
                geneMutationObj[d] = { geneKey: d, sum: 0 };
                GENE_MUT_TYPE_CATS.forEach(c => {
                    // "no-mutation" or 0 case is not displayed in the gene summary heatmap
                    if (c.name != "no-mutation") { geneMutationObj[d][c.name] = 0; }
                });
            });

            const ampLociKeys = sets.filter(cat => AMP_PREFIX_REGEX.test(cat));
            ampLociKeys.forEach(d => {
                amplificationObj[d] = { ampKey: d, sum: 0 };
                AMP_CATS.forEach(c => {
                    if (c.name != "N/A" && c.name != "no change") { amplificationObj[d][c.name] = 0; }
                });
            });

            samples.forEach(d => {
                if (d != SUMMARY_SAMPLE) {
                    geneMutationKeys.forEach(g => {
                        if (data[d][g] !== undefined && geneMutationObj[g][GENE_MUT_MAPPER[data[d][g]]] !== undefined) {
                            geneMutationObj[g][GENE_MUT_MAPPER[data[d][g]]]++;
                            geneMutationObj[g].sum++;
                        }
                    });

                    ampLociKeys.forEach(g => {
                        if (data[d][g] !== undefined && amplificationObj[g][AMP_MAPPER[data[d][g]]] !== undefined) {
                            amplificationObj[g][AMP_MAPPER[data[d][g]]]++;
                            amplificationObj[g].sum++;
                        }
                    });
                }
            });
            // find top 25 genes w/ most mutations
            const highestMutationGenes = Object.values(geneMutationObj).sort((a, b) => b.sum - a.sum).slice(0, 25);
            const highestMutationGeneKeys = highestMutationGenes.map(d => d.geneKey);


            samples.forEach(d => {
                if (d != SUMMARY_SAMPLE) {
                    MUTATION_RATE_CATS.forEach(c => {
                        mutRateData.push({
                            x: d,
                            y: data[d][c.fileKey] ? data[d][c.fileKey] * ONE_MB : 0,
                            series: c.name
                        });
                    });

                    MUT_SIG_CATS.forEach(c => {
                        mutSigData.push({
                            x: d,
                            y: data[d][c.fileKey] ? data[d][c.fileKey] : 0,
                            series: c.name
                        });
                    });

                    highestMutationGeneKeys.forEach(g => {
                        sampleGeneMutationData.push({ x: d, y: g.replace(GENE_MUT_PREFIX, ""), c: data[d][g] });
                    });

                    ampLociKeys.forEach(cat => {
                        amplificationData.push({ x: d, y: cat.replace(AMPLIFICATION_PREFIX, ""), c: data[d][cat] });
                    });

                    // horizontal strip plots
                    donorVitalStatusData.push({ x: d, y: 0, c: data[d][status] });
                    donorGenderData.push({ x: d, y: 0, c: data[d][gender] });
                    sampleHistologyData.push({ x: d, y: 0, c: data[d][histology] });
                    donorRaceData.push({ x: d, y: 0, c: data[d][race] });

                    // cluster strip plots
                    mRNASeqCNMFData.push({ x: d, y: 0, c: data[d][mRNASeqCNMF] });
                    mRNASeqCHierData.push({ x: d, y: 0, c: data[d][mRNASeqCHier] });
                }
            });
            
            
            // plot data generated from extra pre-parsed data
            highestMutationGenes.forEach(d => {
                const gene = d.geneKey.replace(GENE_MUT_PREFIX, "");
                for (const [series, val] of Object.entries(d)) {
                    if (!["genekey", "sum"].includes(series.toLowerCase())) {
                        mutationsByGeneData.push({ x: val, y: gene, series: series });
                    }
                }
            });

            Object.values(amplificationObj).forEach(d => {
                const locus = d.ampKey.replace(AMPLIFICATION_PREFIX, "");
                for (const [series, val] of Object.entries(d)) {
                    if (!["ampkey", "sum"].includes(series.toLowerCase())) {
                        amplificationByLocusData.push({ x: val, y: locus, series: series });
                    }
                }
            });

            // amplification -log10 vertical strip plot
            const ampByLocusLogData = ampLociKeys.map(d => {
                return {
                    x: 0,
                    y: d.replace(AMPLIFICATION_PREFIX, ""),
                    c: -Math.log10(data[SUMMARY_SAMPLE][d])
                };
            });

            // gene mutation -log10 vertical strip plot
            const mutationByGeneLogData = highestMutationGeneKeys.map(g => {
                return {
                    x: 0, // x is just a single column
                    y: g.replace(GENE_MUT_PREFIX, ""),
                    c: -Math.log10(data.all_q[g])
                };
            });


            const geneMutationColorDomain = GENE_MUT_TYPE_CATS.map(d => d.fileKey);
            const geneMutationColorRange = GENE_MUT_TYPE_CATS.map(d => d.color);
            geneMutationColorDomain.push(undefined);
            geneMutationColorRange.push("#AAAAAA");
            const ampColorDomain = AMP_CATS.map(d => d.fileKey);
            const ampColorRange = AMP_CATS.map(d => d.color);
            const vitalStatColorDomain = VITAL_STAT_CATS.map(d => d.name);
            const vitalStatColorRange = VITAL_STAT_CATS.map(d => d.color);
            const genderColorDomain = GENDER_CATS.map(d => d.name);
            const genderColorRange = GENDER_CATS.map(d => d.color);
            const raceColorDomain = RACE_CATS.map(d => d.name);
            const raceColorRange = RACE_CATS.map(d => d.color);
            const histologyColorDomain = HISTOLOGY_CATS.map(d => d.name);
            const histologyColorRange = HISTOLOGY_CATS.map(d => d.color);
            const clusterColorDomain = CLUSTER_CATS.map(d => d.name);
            const clusterColorRange = CLUSTER_CATS.map(d => d.color);

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
                    row: 2, column: 1,
                    data: donorVitalStatusData,
                    type: "heatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: {scaleType: "ordinal", domain: vitalStatColorDomain, range: vitalStatColorRange},
                    padding: { top: 3, bottom: 3, right: 10 }
                }, {
                    row: 3, column: 1,
                    data: donorGenderData,
                    type: "heatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: {scaleType: "ordinal", domain: genderColorDomain, range: genderColorRange},
                    padding: { top: 3, bottom: 3, right: 10 }
                }, {
                    row: 4, column: 1,
                    data: sampleHistologyData,
                    type: "heatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: {scaleType: "ordinal", domain: histologyColorDomain, range: histologyColorRange},
                    padding: { top: 3, bottom: 3, right: 10 }
                }, 
                {
                    row: 5, column: 1,
                    data: donorRaceData,
                    type: "heatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: {scaleType: "ordinal", domain: raceColorDomain, range: raceColorRange},
                    padding: { top: 3, bottom: 3, right: 10 }
                }, {
                    row: 6, column: 0,
                    data: mutationsByGeneData,
                    type: "stackedbarplot",
                    orientation: -1,
                    series: GENE_MUT_TYPE_CATS.filter((d => d.name != "no-mutation")),
                    yAxis: { display: false },
                    padding: { top: 10, bottom: 10, right: 25 }
                }, {
                    row: 6, column: 1,
                    data: sampleGeneMutationData,
                    type: "heatmap",
                    xAxis: {display: false},
                    cAxis: {scaleType: "ordinal", domain: geneMutationColorDomain, range: geneMutationColorRange},
                    padding: { top: 10, bottom: 10, right: 10 }
                }, {
                    row: 6, column: 2,
                    data: mutationByGeneLogData,
                    type: "heatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: { scaleType: "sequential", domain: d3.extent(mutationByGeneLogData, d => d.c), interpolator: d3.interpolateGreys },
                    padding: { top: 10, bottom: 10, left: 10 }
                }, {
                    row: 7, column: 0,
                    data: amplificationByLocusData,
                    type: "stackedbarplot",
                    orientation: -1,
                    series: AMP_CATS.filter((d => d.name != "no change" && d.name != "N/A")),
                    yAxis: { display: false },
                    padding: { top: 10, bottom: 10, right: 25 }
                }, {
                    row: 7, column: 1,
                    data: amplificationData,
                    type: "heatmap",
                    xAxis: {display: false},
                    cAxis: {scaleType: "ordinal", domain: ampColorDomain, range: ampColorRange},
                    padding: { top: 10, bottom: 10, right: 10 }
                }, 
                {
                    row: 7, column: 2,
                    data: ampByLocusLogData,
                    type: "heatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: { scaleType: "sequential", domain: d3.extent(ampByLocusLogData, d => d.c), interpolator: d3.interpolateGreys },
                    padding: { top: 10, bottom: 10, left: 10 }
                }, 
                {
                    row: 8, column: 1,
                    data: mRNASeqCNMFData,
                    type: "heatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: {scaleType: "ordinal", domain: clusterColorDomain, range: clusterColorRange},
                    padding: { top: 3, bottom: 3, right: 10 }
                }, {
                    row: 9, column: 1,
                    data: mRNASeqCHierData,
                    type: "heatmap",
                    xAxis: { display: false },
                    yAxis: { display: false },
                    cAxis: {scaleType: "ordinal", domain: clusterColorDomain, range: clusterColorRange},
                    padding: { top: 3, bottom: 3, right: 10 }
                }
            ];
            const latticeConfig = {
                width: window.innerWidth * .9,
                height: window.innerHeight * .9,
                grid: {
                    rowSizes: [
                        { row: 0, size: 0.2 },
                        { row: 1, size: 0.2 },
                        { row: 2, size: 0.03 },
                        { row: 3, size: 0.03 },
                        { row: 4, size: 0.03 },
                        { row: 5, size: 0.03 },
                        { row: 6, size: 0.3 },
                        { row: 7, size: 0.15 },
                        { row: 8, size: 0.03 },
                        { row: 9, size: 0.03}
                    ],
                    columnSizes: [
                        { column: 0, size: 0.2 },
                        { column: 1, size: 0.74 },
                        { column: 2, size: 0.06 }
                    ]
                }
            };
            const lattice = new PatternLattice(latticePlotData, rootId, latticeConfig);
            lattice.render();
        });
}