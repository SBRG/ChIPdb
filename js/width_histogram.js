/**
 * @summary Creates histogram of binding widths
 * @author Katherine Decker
 * requires Highcharts, PapaParse
 */

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

//write chart to container
function generateWidthHistogram(csvContent, container) {
    var csv_data = Papa.parse(csvContent, {dynamicTyping: true}).data;
    var data = [];
    for (i = 2; i < csv_data.length; i++) {
        data.push(csv_data[i][1]);
    }

    var chart = Highcharts.chart(container, {
        title: {
            text: TF_name + ' Peak Binding Width Histogram'
        },
        xAxis: [{
            title: {
                text: ''
            },
            alignTicks: false,
            opposite: false
        }, {
            title: {
                text: 'Binding Width'
            },
            alignTicks: false,
            opposite: false,
        }],

        yAxis: [{
            title: {
                text: ''
            }
        }, {
            title: {
                text: 'Frequency'
            },
            opposite: false,
        }],
        series: [{
            name: 'Histogram',
            type: 'histogram',
            xAxis: 1,
            yAxis: 1,
            baseSeries: 's1',
            zIndex: -1,
            color: "#f5cb5c"
        }, {
            name: '',
            type: 'scatter',
            data: data,
            visible: false,
            id: 's1',
            marker: {
                radius: 1.5
            }
        }],
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        exporting: {
           enabled: true,
            menuItemDefinitions: {
                downloadData: {
                    onclick: function() {
                        data_download(csvContent, TF_name+'_position_scatter.csv');
                    },
                    text: 'Download histogram data'
                }
            },
            buttons: {
                contextButton: {
                    menuItems: ['downloadPNG', 'downloadSVG', 'downloadData']
                }
            }
        }
    });
    return;
}
