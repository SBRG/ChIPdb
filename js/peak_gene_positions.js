/**
 * @summary Creates position relative to gene scatterplot for ChIPdb
 * @author Katherine Decker
 * requires Highcharts, PapaParse
 */
//write chart to container


// Write Highcharts plot to container
function generatePeakScatter(csvContent, container) {
    var data = Papa.parse(csvContent, {dynamicTyping: true}).data;

    // coordinates
    var coord_data = [];
    for (i = 2; i < data.length; i++) {
        coord_data.push({
            peak: data[i][1],
            gene: data[i][8],
            x: data[i][9],
            y: data[i][5],
        });
    }

    // set up the plot
    var chartOptions = {
        title: {
            text: ''
        },
        xAxis: {
            title: {
                text: 'Relative Position to Gene (Normalized to Gene Length)'
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
                text: 'Peak Intensity (S/N ratio)',
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