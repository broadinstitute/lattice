require.undef("icomut");
define("icomut", ["icomut/build/js/icomut.umd.min.js"], function (icomut) {
    /**
     * finds all old tooltip divs that were appended to the HTML body (by lattice.js)
     * and removes them if no corresponding SVG exists.
     */
    const cleanUpTooltips = () => {
        $(`.ljs--tooltip`).each(function (i) {
            const tooltipId = $(this).attr("id");
            const tooltipSuffixIndex = tooltipId.indexOf("-tooltip");
            const svgContainerId = tooltipId.substring(0, tooltipSuffixIndex);
            // SVG container is no longer there
            if (!$(`#${svgContainerId}`).length) {
                $(this).remove();
            }
        });
    };

    function draw(container, dataFile, configFile) {
        cleanUpTooltips();
        const vizContainerId = `ljs--${new Date().getTime()}`;
        const dataFiles = {
            config: configFile,
            data: dataFile
        };

        // jupyter notebook cuts off width + height of plot if it's larger than the possible width
        // the scrolling within the notebook still doesn't display the entire plot,
        // so we will constrain it to be no larger in width than possible within the user's notebook
        const containerWidth = $(container).width();
        $(container).append(`<div class="ljs--grid" id="${vizContainerId}"></div>`);
        icomut.init(vizContainerId, dataFiles, containerWidth);
    }
    return draw;
});

element.append(`${new Date().toLocaleString()}: icomut_py.js successfully loaded!`);