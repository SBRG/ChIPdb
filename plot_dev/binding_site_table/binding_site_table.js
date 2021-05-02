/**
 * @summary Creates interactive binding site tables for ChIPdb
 * @author Tahani Al Bulushi 
 * requires tabulator.info
 */
 //write function to container
 function genBindingSiteTable(jsonContent,container) {
    // const response = await fetch(jsonContent);
    // const data = await response.json();

    // for tabulator, convert rows into objects
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
        const peakStrength =tabledata[i].binding_peak_strength;
        const genes = tabledata[i].target_genes;

        console.log(index,bindCond,bindStart,bindEnd,peakStrength,genes);
    }
    
    //make a header object for the columns 
    var headerMenu = [
        {
            label:"<i class='fas fa-arrow-right'></i> Move Column to End",
            action:function(e, column){
                column.move("end");
            }
        }, {
            label:"<i class='fas fa-trash'></i> Hide Column",
            action:function(e, column){
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
                        formatter:"money",
                        formatterParams:{precision:4},
                        headerContextMenu:headerMenu
                    },
                    {
                        title: "Peak Location",
                        field: "binding_peak_start",
                        sorter: "number",
                        hozAlign: "center",
                        headerContextMenu:headerMenu
                    },
                    {
                        title: "Peak Location",
                        field: "binding_peak_end",
                        sorter: "number",
                        hozAlign: "center",
                        headerContextMenu:headerMenu
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
    
    var table = new Tabulator("#"+container, {
        maxHeight: "100%",
        data: tabledata,
        columns:columns,
        initialSort: [
            {column: "binding_condition", dir: "desc"}
        ],
        tooltips: true,
        movableColumns:true,
    }); 

} 