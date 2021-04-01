function initCovidMap(){
    const rootId = "covid-plot";
    // data source: "https://api.covidtracking.com/v1/states/daily.json" // they are soon going to stop updating data, not sure if the API will continue to work
    const dataFiles = [
        "src/data/us.states.data.json",
        "src/data/daily.03112021.json"
    ];
    Promise.all(createPromises(dataFiles))
        .then((resp) => {
            const promiseData = {
                coordinates: resp[0],
                cases: resp[1]
            };

            const plotData = createPlotData(promiseData);

            const latticeConfig = {
                width: 1400,
                height: 875,
                padding: {top: 5, right: 20, bottom:20, left:20},
            };
            const lattice = LatticeLib.lattice(plotData, rootId, latticeConfig);
            lattice.render();

        });
    
}
/**
 * creating promises for JSON data type
 * @param [String] files
 */
function createPromises(files) {
    let promises = files.map((f) => LatticeLib.utils.json(f));
    return promises;
}

/**
 * Uses passed in cases/coordinates data to create an array of scatterplot configs.
 * @param {Object} data - Contains data from resolved promises.
 *                        Expected keys: coordinates, cases
 */
function createPlotData(data) {
    // COVID Tracking Project data has more data than just the 50 states
    // - filtering the data down to just what's in our coordinates data
    const casesByState = LatticeLib.utils.nest()
        .key(d => d.state)
        .entries(data.cases)
        .filter(d => d.key in data.coordinates);

    const allStatesData = casesByState.map(d => {
        const values = d.values.filter(d => d.positiveIncrease >= 0);
        const stateData = values.map(d => {
            const date = String(d.date);
            return {
                x: new Date(`${date.substring(0, 4)}.${date.substring(4,6)}.${date.substring(6)}`),
                y: d.positiveIncrease
            };
        });
        stateData.sort((a, b) => a.x - b.x); // if using a categorical scale for the x-axis, need to sort
        return {
            // data based configs
            row: data.coordinates[d.key].x,
            column: data.coordinates[d.key].y,
            // title: d.key,
            data: stateData,
            type: "areaplot",
            padding: {top: 25, right: 20, bottom:20, left:20},
            axis: {
                x:{
                    title: "",
                    scaleType: "temporal", 
                    ticks: 5,
                    angle: 30,
                    "text-anchor": "start"
                },
                y: {
                    title: d.key,
                    ticks: 1,
                }
                
            }, // show tick mark for every month since COVID tracking roughly started
        };
    });
    return allStatesData;
}

