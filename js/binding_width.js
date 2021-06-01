/**
 * @summary Creates binding width histograms for ChIPdb
 * @author Katherine Decker
 * requires D3
 */
//write function to container

function generateWidthHist(TF_name, container) {
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
            .call(d3.axisBottom(x).tickFormat(d3.format("d")).tickValues(d3.range(min, max + 1, Math.max(1, parseInt((max-min) / 5)))));
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
    });
}