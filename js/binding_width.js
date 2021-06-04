/**
 * @summary Creates binding width histograms for ChIPdb
 * @author Katherine Decker
 * requires D3
 */
//write chart to container

function generateWidthHist(TF_name, container, buttonID) {
// set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 50, left: 40},
        width = 400 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select(container)
        .append("div")
        .append("center")
        // Container class to make it responsive.
        .classed("svg-container", true)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 400 250")
        // Class to make it responsive.
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// get the data
    d3.csv("/ChIPdb/data/e_coli/NC_000913_3/binding_widths/" + TF_name + "_widths.csv", function (data) {
        // X axis: scale and draw:
        const min = d3.min(data, function (d) {
            return +d.binding_width
        });
        const max = d3.max(data, function (d) {
            return +d.binding_width
        });
        var x = d3.scaleLinear()
            .domain([min, max])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("d")).tickValues(d3.range(min, max + 1, Math.max(1, parseInt((max - min) / 5)))));
        // x axis label
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 35)
            .text("Binding Peak Width");
        // y axis label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", -31)
            .attr("transform", "rotate(-90)")
            .text("Frequency");


        // Y axis: initialization
        var y = d3.scaleLinear()
            .range([height, 0]);
        var yAxis = svg.append("g")

        // A function that builds the graph for a specific value of bin
        function update(nBin) {

            // thresholds
            const thresholds = d3.range(min, max, (max - min) / nBin);

            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(function (d) {
                    return d.binding_width;
                })   // I need to give the vector of value
                .domain(x.domain())  // then the domain of the graphic
                .thresholds(thresholds); // then the numbers of bins

            // And apply this function to data to get the bins
            var bins = histogram(data);

            // Y axis: update now that we know the domain
            ymax = d3.max(bins, function (d) {
                return d.length;
            });
            y.domain([0, ymax]);   // d3.hist has to be called before the Y axis obviously
            yAxis
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y).tickFormat(d3.format("d")).tickValues(d3.range(0, ymax + 1, Math.max(1, parseInt(ymax / 5)))));

            // Join the rect with the bins data
            var u = svg.selectAll("rect")
                .data(bins)

            // Manage the existing bars and eventually the new ones:
            u
                .enter()
                .append("rect") // Add a new rect for each new elements
                .merge(u) // get the already existing elements as well
                .transition() // and apply changes to all of them
                .duration(1000)
                .attr("x", 1)
                .attr("transform", function (d) {
                    return "translate(" + x(d.x0) + "," + y(d.length) + ")";
                })
                .attr("width", function (d) {
                    return x(d.x1) - x(d.x0) - 1;
                })
                .attr("height", function (d) {
                    return height - y(d.length);
                })
                .style("fill", "#f5cb5c")


            // If less bar in the new histogram, I delete the ones not in use anymore
            u
                .exit()
                .remove()

        }

        // Initialize with 3 bins
        update(3)

        // Listen to the button -> update if user change it
        d3.select("#nBin").on("input", function () {
            update(+this.value);
        });

        // Set-up the export button
        d3.select(buttonID).on('click', function () {
            var svgString = getSVGString(svg.node());
            svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback
            function save(dataBlob, filesize) {
                saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
            }
        });
    });
}

// Exporting functions
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString(svgNode) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push('#' + parentElement.id);
        for (var c = 0; c < parentElement.classList.length; c++)
            if (!contains('.' + parentElement.classList[c], selectorTextArr))
                selectorTextArr.push('.' + parentElement.classList[c]);

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if (!contains('#' + id, selectorTextArr))
                selectorTextArr.push('#' + id);

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if (!contains('.' + classes[c], selectorTextArr))
                    selectorTextArr.push('.' + classes[c]);
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];

            try {
                if (!s.cssRules) continue;
            } catch (e) {
                if (e.name !== 'SecurityError') throw e; // for Firefox
                continue;
            }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if (contains(cssRules[r].selectorText, selectorTextArr))
                    extractedCSSText += cssRules[r].cssText;
            }
        }


        return extractedCSSText;

        function contains(str, arr) {
            return arr.indexOf(str) === -1 ? false : true;
        }

    }

    function appendCSS(cssText, element) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore(styleElement, refNode);
    }
}


function svgString2Image(svgString, width, height, format, callback) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function () {
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(function (blob) {
            var filesize = Math.round(blob.length / 1024) + ' KB';
            if (callback) callback(blob, filesize);
        });


    };

    image.src = imgsrc;
}