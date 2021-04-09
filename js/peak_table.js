//helper for querystring params
function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

// Write table to container
function generateGeneTable(csvContent, container) {
    // get the data
    var data = Papa.parse(csvContent, {dynamicTyping: true}).data;

    // for tabulator, convert rows into objects
    var tabledata = []
    for (i = 1; i < data.length - 1; i++) { //rows, excluding header
        var obj = {id: i};
        for (j = 0; j < data[0].length - 1; j++) { //cols, excluding link
            obj[data[0][j]] = data[i][j];
        }
        tabledata.push(obj)
    }

    // make a header menu object for the columns
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
    var columns = [
        {title: "", field: "locus", width: 50},
        {
            title: "M<sub>i</sub>", field: "gene_weight",
            formatter: "money", formatterParams: {precision: 4},
            headerContextMenu: headerMenu
        },
        {title: "Name", field: "gene_name", headerContextMenu: headerMenu}
    ]
    // add TF columns
    for (j = 6; j < data[0].length - 1; j++) {
        columns.push({
            title: data[0][j], field: data[0][j],
            formatter: "tickCross", headerContextMenu: headerMenu
        });
    }
    // add additional columns
    columns = columns.concat([
        {title: "start", field: "start", headerContextMenu: headerMenu},
        {title: "stop", field: "stop", headerContextMenu: headerMenu},
        {title: "Operon", field: "operon", headerContextMenu: headerMenu},
        {title: "TF", field: "regulator", headerContextMenu: headerMenu},
        {field: "end", visible: false} // facilitates moving to end
    ]);

    // generate the table
    var table = new Tabulator('#' + container, {

        maxHeight: "100%",
        data: tabledata,
        columns: columns,
        initialSort: [
            {column: "gene_weight", dir: "desc"}
        ],

        rowClick: function (e, row) { //link to the page in a database
            var rnd = row.getData().start;
            igv.removeAllBrowsers()
            igv.createBrowser(igvDiv, options)
                .then(function (browser) {
                    browser.search('gi|49175990|ref|NC_000913.2|:'.concat(numberWithCommas(rnd - 100), '-', numberWithCommas(rnd + 100)));
                    console.log("Created IGV browser 2");
                });
            document.getElementById('tb').value = rnd;
        },
        tooltips: function (cell) {
            return "Click to view gene dashboard";
        }

    });

    // hide unwanted columns
    if (!data[0].includes("operon")) {
        table.hideColumn("operon");
    }
};