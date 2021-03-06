
function demoScatterHistograms(distri="randomNormal"){
    // a lattice
    // TODO: need more contig options
    const latticeBlue = "#96d0cb";
    const latticeColorScheme10 = [latticeBlue, "#666666", "#c28b9a", "#cdaf70", "#7092a5", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

    const data = RandomDataLib.createRandomNumericalData(5000, distri, latticeColorScheme10[1]);
    const xbins = getBins(data.map((d)=>d.x), 30);
    const ybins = getBins(data.map((d)=>d.y), 30);
    const latticeMap = [
        {
            row: 0,
            column: 0,
            data: xbins.map((d)=>{
                return {
                    x: d.bin,
                    y: d.count,
                    c: latticeColorScheme10[3]
                }
            }),
            type: "columnplot",
            axis: {
                x: {display: false},
                y: {ticks: 5, title: ""}
            },
            padding: {bottom: 0}
        },
        {
            row: 1,
            column: 0,
            data: data,
            type: "scatterplot",
            axis: {
                x: {title: ""},
                y: {title: ""}
            },
            padding: {top: 30, right: 30}
        },
        {
            row: 1,
            column: 1,
            data: ybins.map((d)=>{
                return {
                    x: d.count,
                    y: d.bin,
                    c: latticeColorScheme10[2]
                };
            }).reverse(),
            type: "barplot",
            axis: {
                y: {display: false},
                x: {title: "", ticks: 5}
            },
            padding: {
                left: 0
            }
        },
       
    ];
    const grid = {
        rows: 2,
        columns: 2,
        rowSizes: [
            {
                row: 0,
                size: 0.2
            },
            {
                row: 1,
                size: 0.8
            }
        ],
        columnSizes: [
            {
                column: 0,
                size: 0.8
            },
            {
                column: 1,
                size: 0.2
            }
        ]
    };
    document.getElementById("scatter-hist").innerHTML = "";
    let lattice = LatticeLib.lattice(latticeMap, "scatter-hist", {grid:grid});
    console.log(LatticeLib.getPlotOptions(lattice.plots[1]));
}

/**
 * Generate histogram bins
 * @param {Number[]} data 
 * @param {Integer} bins: set the number of bins
 * @returns {Object[]} a list of bin objects with attributes: top, bottom, bin, count
 */
function getBins(data, bins=10){
    let hist = new Array();
    const max = Math.max.apply(null, data), //lowest data value
        min = Math.min.apply(null, data), //highest data value
        range = max - min, //total range of the data
        width = range / bins; //size of the bins
      
    //create bins
    for (let i = 0; i < bins; i++) {
        //set the upper and lower limits of the current cell
        let bottom = min + (i * width);
      
        //check for and set the x value of the bin
        if (!hist[i]) {
            hist[i] = {
                bottom: min + (i*width),
                top: bottom + width,
                bin: bottom + (width/2),
                count: 0
            };
        }
    }

    // bin counts
    data.forEach((d)=>{
        let i = Math.floor(d/width)-1;
        let found = false;
        let token = 0;
        while (!found){  
            if (i>=hist.length){
                hist[hist.length-1].count += 1;
                break;
            } else if (i<0){
                hist[0].count += 1;
                break;
            } else if (!hist[i]){
                console.log(min, max);
                throw "Error: " + d;
            }
            let bottom = hist[i].bottom;
            let top = hist[i].top;
            if (d>=bottom && d<top){
                hist[i].count += 1;
                found = true;
            } else if (d>=top){
                i += 1;
                // 
            } else if (d<bottom) {
                i -= 1;
            } else {
                console.log(d, hist[i].bottom, hist[i].top);
            }
            token++;
            if (token == 5) break;
        }
    });
    return(hist);  
}
