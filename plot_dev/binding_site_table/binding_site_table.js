/**
 * @summary Creates interactive binding site tables for ChIPdb
 * @author Tahani Al Bulushi
 * requires tabulator.info
 */
//write function to container
function genBindingSiteTable(jsonContent, container, target_div, igv_options) {

    // convert rows into objects
    var tabledata = []
    for (let i = 0; i < jsonContent.length; i++) {
        var obj = jsonContent[i];
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
    var columns = [{
        title: "TF-#",
        field: "index",
        sorter: "string",
    },
        {
            title: " Binding Condition",
            field: "condition",
            sorter: "string",
            hozAlign: "left",
            formatter: "money",
            formatterParams: {precision: 4},
            headerContextMenu: headerMenu
        },
        {
            title: "Start Position",
            field: "binding_peak_start",
            sorter: "number",
            hozAlign: "center",
            headerContextMenu: headerMenu
        },
        {
            title: "End Position",
            field: "binding_peak_end",
            sorter: "number",
            hozAlign: "center",
            headerContextMenu: headerMenu
        },
        {
            title: "Peak Intensity",
            field: "binding_peak_strength",
            sorter: "number",
            hozAlign: "center"
        },
        {
            title: "Target genes",
            field: "target_genes",
            sorter: "string",
            hozAlign: "left"
        },
    ]

    var table = new Tabulator("#" + container, {
        maxHeight: "100%",
        data: tabledata,
        columns: columns,
        initialSort: [
            {column: "binding_condition", dir: "desc"}
        ],
        tooltips: true,
        movableColumns: true,

        rowClick: function (e, row) { //link to the page in a database
            var rnd = row.getData().binding_peak_start;
            igv.removeAllBrowsers()
            igv.createBrowser(target_div, igv_options)
                .then(function (browser) {
                    browser.search('gi|49175990|ref|NC_000913.2|:'.concat(numberWithCommas(rnd - 100), '-', numberWithCommas(rnd + 100)));
                    console.log("Created IGV browser 2");
                });
            // document.getElementById('tb').value = rnd;
        },
        tooltips: function (cell) {
            return "Click to view gene dashboard";
        }
    });
    table.redraw();

} 