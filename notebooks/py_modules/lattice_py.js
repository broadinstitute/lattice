// First undefine 'lattice_py' so we can easily reload this file.
require.undef("lattice_plot");

define("lattice_plot", ["lattice/build/js/lattice.min.js"], function (lattice) {
    function draw(container, data, plotType, config) {
        const vizContainerId = `ljs--${new Date().getTime()}`;
        $(container).append(`<div class="ljs--plot" id="${vizContainerId}"></div>`);
        lattice.plot(data, plotType, vizContainerId, config);
    }
    return draw;
});

require.undef("lattice_grid");
define("lattice_grid", ["lattice/build/js/lattice.min.js"], function (lattice) {
    function draw(container, data, config) {
        const vizContainerId = `ljs--${new Date().getTime()}`;
        $(container).append(`<div class="ljs--grid" id="${vizContainerId}"></div>`);
        lattice.grid(data, vizContainerId, config);
    }
    return draw;
});


element.append(`${new Date().toLocaleString()}: lattice_py.js successfully loaded!`);