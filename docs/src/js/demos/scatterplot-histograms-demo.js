function demoScatterHistograms(distri="randomNormal"){
    // a lattice
    // TODO: need more contig options
    const data = RandomDataLib.createRandomNumericalData(5000, distri);
    const xbins = getBins(data.map((d)=>d.x), 30);
    const ybins = getBins(data.map((d)=>d.y), 30);
    const latticeMap = [
        {
            row: 0,
            column: 0,
            data: data,
            type: "scatterplot"
        },
        {
            row: 0,
            column: 1,
            data: ybins.map((d)=>{
                return {
                    x: d.count,
                    y: d.bin,
                    c: "rgba(70, 130, 180, 0.6)"
                };
            }).reverse(),
            type: "barplot"
        },
        {
            row: 1,
            column: 0,
            data: xbins.map((d)=>{
                return {
                    x: d.bin,
                    y: d.count,
                    c: "rgba(70, 130, 180, 0.6)"
                }
            }),
            type: "columnplot",
            axis: {
                x: {
                    angle: 90,
                    "text-anchor": "start",
                    title: ""
                }
            }
        }
    ];
    const grid = {
        rows: 2,
        columns: 2,
        rowSizes: [
            {
                row: 0,
                size: 0.7
            },
            {
                row: 1,
                size: 0.3
            }
        ],
        columnSizes: [
            {
                column: 0,
                size: 0.7
            },
            {
                column: 1,
                size: 0.3
            }
        ]
    };
    document.getElementById("lattice").innerHTML = "";
    LatticeLib.lattice(latticeMap, "lattice", {grid:grid});
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
