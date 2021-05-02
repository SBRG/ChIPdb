/**
 * @summary Creates interactive binding site tables for ChIPdb
 * @author INSERT NAME
 * requires highcharts, papa parse
 */
 
 // edit function below
 // Write plot to container
 function generateVenn(jsconContent, container) {  

    var vennData = []
    for (let i = 0; i < jsconContent.length; i++) {
        var obj = jsconContent[i];
        vennData.push(obj) //adds items to an object
    }
    
    for (let i = 0; i < vennData.length; i++) {
        const value = vennData[i].value;
        const gene_list = vennData[i].list;
    }
    
    // gene lists
    var reg_list = vennData[1].list
    var reg_only_list = vennData[2].list
    var chip_list = vennData[3].list
    var chip_only_list = vennData[4].list
    var shared_list = vennData[5].list
    var all_list = vennData[5].list

    // gene val
    var reg_val = vennData[1].value
    var reg_only_val = vennData[2].value
    var chip_val = vennData[3].value
    var chip_only_val = vennData[4].value
    var shared_val = vennData[5].value
    var all_val = vennData[5].value
    

    console.log(reg_list);
    
    if (chip_only_list.length > 20) {
        chip_only_list = chip_only_list.slice(0, 10) + "<br>"
                    chip_only_list.slice(10,20)  +"<br>"
                    chip_only_list.slice(20,30) + "<br>"
                    chip_only_list.slice(30,40) + '...';
    }

    // set up plot
    var myChart = Highcharts.chart(container, {
        accessibility: {
            point: {
            descriptionFormatter: function (point) {
                var intersection = point.sets.join(', '),
                name = point.name,
                ix = point.index + 1,
                val = point.value;
                return ix + '. Intersection: ' + intersection + '. ' +
                (point.sets.length > 1 ? name + '. ' : '') + 'Value ' + val + '.';
            }
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        type: 'venn',
        name: 'Venn Diagram',
        data: [{
                name: 'Genes in Chip-seq Data',
                sets: ['Chip-seq Genes'],
                color: '#bcf28f',
                opacity: 0.7,
                value: chip_only_val,
                gene_list: chip_only_list
        }, {
                name: 'Genes in Regulon',
                sets: ['Regulon Genes'],
                color: '#80f2f0',
                opacity: 0.7,
                value: reg_only_val,
                gene_list: reg_only_list
        }, {
                sets: ['Chip-seq Genes','Regulon Genes'],
                color: '#b78ff2',
                opacity: 0.7,
                name: 'Genes in Chip-seq Data and Regulon',
                value:shared_val,
                gene_list: shared_list
        }, {
                sets: ['chipseq all contained in Regulon'],
                value: 0,
                color: '#3de3e0',
                opacity: 0.7,
                name: 'Genes in Regulon and i-Modulon',
                gene_list: shared_list
                }, {
                sets: ['Regulon Genes', 'chipseq all contained in Regulon'],
                value: 0,
                color: '#3de3e0',
                opacity: 0.7,
                name: 'Genes in Regulon and i-Modulon',
                gene_list: shared_list
                }, {
                sets: ['Regulon all contained in Chipseq'],
                value: 0,
                color: '#37d7b4',
                opacity: 0.7,
                name: 'Genes in Regulon and i-Modulon',
                gene_list: shared_list
                }, {
                sets: ['Chip-seq Genes', 'Regulon all contained in Chipseq'],
                value: 0,
                color: '#37d7b4',
                opacity: 0.7,
                name: 'Genes in Regulon and Chipseq',
                geme_list: shared_list
                }, {
                sets: ['Regulon == Chipseq'],
                value: 0,
                color: '#37d7b4',
                opacity: 0.7,
                name: 'Genes in Regulon and i-Modulon',
                gene_list: shared_list
                }]
            }],
    title: {
        text: 'Chip-seq & Regulon Venn Diagram for: MetJ'
    },
    tooltip: {
        width:'400px',
        formatter: function() {
            var tooltip = this.point.name + ": <b>" + this.point.value + "</b>";
            tooltip += "<br>" + this.point.gene_list
            
            return tooltip;
        }
    },
    exporting: {
        enabled: false
    }
    }); //end var highcharts 

}; //end of dataVenn