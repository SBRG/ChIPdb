/**
 * @summary Creates IGV + interactive table for proChIPdb
 * @authors Katherine Decker and Tahani Al Bulushi
 * requires Tabulator and igv.js
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


function generateIGVandTable(TF_name, row, fileName) {
    // Update this to take in a fileName parameter as the third value

//trigger download of big wig files
    document.getElementById("download-bw").setAttribute("href",
        '/data/' + organism + '/' + genome + "/bw/compressed/" + TF_name + "_bw.zip");

    // IGV
    var igvDiv = document.getElementById("igv-div");
    var options =
        {
            reference:
                {
                    "id": "genome",
                    "name": genome,
                    "fastaURL": "/data/" + organism + "/" + genome + "/sequence/sequence.fasta",
                    "indexURL": "/data/" + organism + "/" + genome + "/sequence/sequence.fasta.fai",
                    "tracks": [
                        {
                            "type": "annotation",
                            "format": "gff",
                            "url": "/data/" + organism + "/" + genome + "/annotation/genes.gff",
                            "name": "Genes",
                            "gffTags": "on",
                            "color": "#0D5899",
                            "nameField": "gene",
                            "searchable": true
                        }
                    ]
                }
        };
    igv.removeAllBrowsers()
    igv.createBrowser(igvDiv, options)
        .then(async function (browser) {
            console.log("Created IGV browser");
            var i = row.length - 15;
            var color_iter = 0;
            const colors = ['#464746', '#464746', '#9BABA4', '#9BABA4', '#417f5d', '#417f5d', '#817198', '#817198']; // maybe make better someday
            if (genome == 'NC_000913.3') {
                await browser.loadTrack(
                    {
                        "type": "annotation",
                        "format": "gff",
                        "url": "/data/" + organism + "/" + genome + "/annotation/tu.gff",
                        "name": "Published TUs",
                        "color": "#5386E4",
                        "gffTags": "on",
                        "nameField": "genes"
                    })
                await browser.loadTrack(
                    {
                        "type": "annotation",
                        "format": "gff",
                        "url": "/data/" + organism + "/" + genome + "/annotation/tss.gff",
                        "name": "Published TSS",
                        "color": "#8E908E",
                        "gffTags": "on",
                        "nameField": "tss_name"
                    })
                await browser.loadTrack(
                    {
                        "type": "annotation",
                        "format": "gff",
                        "url": "/data/" + organism + "/" + genome + "/annotation/tfbs.gff",
                        "name": "Published TFBS",
                        "color": "#F5CB5C",
                        "gffTags": "on",
                        "nameField": "TF"
                    })
            }
            ;
            while (i < row.length) {
                if (row[i] != null) {
                    await browser.loadTrack({
                        "name": row[i - 1],
                        "type": "wig",
                        "url": "/data/" + organism + "/" + genome + "/bw/" + row[i],
                        "color": colors[color_iter]
                    })
                }
                i += 2
                color_iter += 1
            }
        })

    // Table
    // update this so that instead of using TF_name.substr(0,4), it will use the new fileName param from func call
    $.getJSON('/data/' + organism + '/' + genome + '/table/' + fileName, function (data) {
        // convert rows into objects
        const container = 'binding_site_table'
        var tabledata = []
        for (let i = 0; i < data.length; i++) {
            var obj = data[i];
            tabledata.push(obj) //adds items to an object
        }

        for (let i = 0; i < tabledata.length; i++) {
            const index = tabledata[i].index;
            const bindCond = tabledata[i].condition;
            const bindStart = tabledata[i].binding_peak_start;
            const bindEnd = tabledata[i].binding_peak_end;
            const peakStrength = tabledata[i].binding_peak_strength;
            const genes = tabledata[i].target_genes;
        }

        //make a header object for the columns
        var headerMenu = [
            {
                label: "<i class='fas fa-arrow-right'></i> Move Column to End",
                action: function (e, column) {
                    column.move("end");
                }
            }, {
                label: "<i class='fas fa-trash'></i> Hide Column",
                action: function (e, column) {
                    column.hide();
                }
            }
        ]

        // columns object: basic info
        const peak_intensity_name = row[16];
        var columns = [
            {
                title: "TF-Condition-#",
                field: "index",
                sorter: "string",
                headerContextMenu: headerMenu
            },
            {
                title: "Start Position",
                field: "binding_peak_start",
                sorter: "number",
                hozAlign: "left",
                formatter: "money",
                formatterParams: {precision: 0},
                headerContextMenu: headerMenu
            },
            {
                title: "End Position",
                field: "binding_peak_end",
                sorter: "number",
                hozAlign: "left",
                formatter: "money",
                formatterParams: {precision: 0},
                headerContextMenu: headerMenu
            }
        ]
        if(row[16]){
            columns.push({
                title: peak_intensity_name,
                field: "binding_peak_strength",
                sorter: "number",
                hozAlign: "left",
                formatter: "money",
                formatterParams: {precision: 2},
                headerContextMenu: headerMenu
            })
        }

        columns.push({
                title: "Closest gene",
                field: "closest_gene",
                sorter: "string",
                hozAlign: "left",
                headerContextMenu: headerMenu
            })

        if (genome == 'NC_000913.3') {
           columns.push({
                title: "TU Target genes",
                field: "target_genes_html",
                sorter: "string",
                hozAlign: "left",
                headerContextMenu: headerMenu,
                formatter: "html"
            })
        }

        var table = new Tabulator("#" + container, {
            maxHeight: "100%",
            data: tabledata,
            columns: columns,
            layout: "fitDataFill",
            tooltips: true,
            movableColumns: true,
            rowClick: function (e, clicked_row) { //link to the page in a database
                var start = clicked_row.getData().binding_peak_start;
                var end = clicked_row.getData().binding_peak_end;
                igv.removeAllBrowsers()
                igv.createBrowser(igvDiv, options)
                    .then(async function (browser) {
                        var i = row.length - 15;
                        var color_iter = 0;
                        const colors = ['#464746', '#464746', '#9BABA4', '#9BABA4', '#417f5d', '#417f5d', '#817198', '#817198']; // maybe make better someday
                        if (genome == 'NC_000913.3') {
                            await browser.loadTrack(
                                {
                                    "type": "annotation",
                                    "format": "gff",
                                    "url": "/data/" + organism + "/" + genome + "/annotation/tu.gff",
                                    "name": "Published TUs",
                                    "color": "#5386E4",
                                    "gffTags": "on",
                                    "nameField": "genes"
                                })
                            await browser.loadTrack(
                                {
                                    "type": "annotation",
                                    "format": "gff",
                                    "url": "/data/" + organism + "/" + genome + "/annotation/tss.gff",
                                    "name": "Published TSS",
                                    "color": "#8E908E",
                                    "gffTags": "on",
                                    "nameField": "tss_name"
                                })
                            await browser.loadTrack(
                                {
                                    "type": "annotation",
                                    "format": "gff",
                                    "url": "/data/" + organism + "/" + genome + "/annotation/tfbs.gff",
                                    "name": "Published TFBS",
                                    "color": "#F5CB5C",
                                    "gffTags": "on",
                                    "nameField": "TF"
                                })
                        }
                        ;
                        while (i < row.length) {
                            if (row[i] != null) {
                                await browser.loadTrack({
                                    "name": row[i - 1],
                                    "type": "wig",
                                    "url": "/data/" + organism + "/" + genome + "/bw/" + row[i],
                                    "color": colors[color_iter]
                                })
                            }
                            i += 2
                            color_iter += 1
                        }
                        // TODO: use Math.min() to prevent +1000 from exceeding genome length
                        browser.search(genome.concat(':',numberWithCommas(Math.max(start - 1000, 0)), '-',
                            numberWithCommas(end + 1000)));
                    });
            },
            tooltips: function (cell) {
                return "Click to jump to peak in genome viewer below";
            }
        });
        table.redraw();

        //trigger download of binding site table .csv file
        document.getElementById("download-table").addEventListener("click", function () {
            table.download("csv", TF_name + "_binding_site_table.csv");
        });

    }).catch(() => {
        document.getElementById('binding_site_table').innerText = 'Peak binding data table not available.'
        document.getElementById("binding_site_table").classList.add('NA_text')
    });
    ;
}

// Formatting commas into numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}