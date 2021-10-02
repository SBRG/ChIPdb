/**
 * @summary Creates position relative to gene scatterplot for proChIPdb
 * @author Katherine Decker
 * requires Highcharts, PapaParse
 */
//write chart to container

// data download helper function
 function data_download(csv_data, file_name) {
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Set the HREF to a Blob representation of the data to be downloaded
    a.href = window.URL.createObjectURL(
        new Blob([csv_data], {type: 'text/plain'})
    );

    // Use download attribute to set set desired file name
    a.setAttribute("download", file_name);

    // Trigger the download by simulating click
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
 }


// Write Highcharts plot to container
function generatePeakScatter(csvContent, row, container) {
    var data = Papa.parse(csvContent, {dynamicTyping: true}).data;

    // coordinates
    var coord_data = [];
    for (i = 1; i < data.length-1; i++) {
        coord_data.push({
            peak: data[i][1],
            gene: data[i][9],
            x: data[i][10],
            y: data[i][5],
        });
    }

    // type of intensity
    const peak_intensity_name = row[16];

    // set up the plot
    var chartOptions = {
        title: {
            text: TF_name + ' Peak Position Relative to Nearest Gene'
        },
        xAxis: {
            title: {
                text: 'Relative Peak Position to Gene (Normalized to Gene Length)'
            },
            crosshair: true,
            startOnTick: false,
            endOnTick: false,
            plotLines: [{
                value: 0,
                zIndex: 5,
                color: '#87978F',
                dashStyle: 'ShortDash'
            }, {
                value: 1,
                zIndex: 5,
                color: '#87978F',
                dashStyle: 'ShortDash'
            }],
        },
        yAxis: {
            title: {
                text: `Peak Intensity (${peak_intensity_name})`,
            },
            crosshair: true,
            startOnTick: false,
            endOnTick: false,
        },
        series: [{
            name: 'Genes',
            type: 'scatter',
            data: coord_data,
            color: '#0d5899',
            turboThreshold: 0,
            // events: {
            //     click: function (e) {
            //         var link = 'gene.html?';
            //         link += 'organism=' + qs('organism') + '&';
            //         link += 'dataset=' + qs('dataset') + '&';
            //         link += 'gene_id=' + e.point.b_num;
            //         window.open(link);
            //     }
            // }
        }],

        tooltip: {
            formatter: function () {
                tooltip = "<br>Peak: " + this.point.peak;
                tooltip += "<br>Gene: " + this.point.gene;
                tooltip += "<br>Relative Position to Gene: " + this.point.x.toFixed(2);
                tooltip += "<br>Peak Intensity: " + this.point.y.toFixed(2);
                return tooltip;
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        exporting: {
           enabled: true,
            menuItemDefinitions: {
                downloadData: {
                    onclick: function() {
                        data_download(csvContent, TF_name+'_position_scatter.csv');
                    },
                    text: 'Download scatter data'
                }
            },
            buttons: {
                contextButton: {
                    menuItems: ['downloadPNG', 'downloadSVG', 'downloadData']
                }
            }
        }
    };

    // make the chart
    var chart = Highcharts.chart(container, chartOptions);
    return;
};