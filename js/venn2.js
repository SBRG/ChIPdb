/**
 * @summary Creates venn diagram for ChIP-pro
 * @author Katherine Decker
 * requires Papa parse, Highcharts, and Highcharts data module
 */

function generateVenn2(csvContent, container) {

    // get the data
    var data = Papa.parse(csvContent).data;

    // gene counts (leaving out operons for now)
    var tfName = data[1][1];
    var data_source = data[1][2];
    var regulon = parseFloat(data[2][1]);
    var chip = parseFloat(data[3][1]);
    var overlap = parseFloat(data[4][1]);
    var regulon2 = parseFloat(data[5][1]);
    var chip2 = parseFloat(data[6][1]);
    var overlap2 = parseFloat(data[7][1]);

    // gene lists
    var reg_list = data[2][2].slice(2, -2).replace(/(?:\r\n|\r|\n)/gi, "").replace(/' '/gi, ", ");
    var comp_list = data[3][2].slice(2, -2).replace(/(?:\r\n|\r|\n)/gi, "").replace(/' '/gi, ", ");
    var both_list = data[4][2].slice(2, -2).replace(/(?:\r\n|\r|\n)/gi, "").replace(/' '/gi, ", ");

    if (reg_list.length > 1000) {
        reg_list = reg_list.slice(0, 1000) + '...';
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
                sets: ['ChIP Genes'],
                color: '#F5CB5C',
                opacity: 0.8,
                value: chip,
                gene_list: comp_list
            }, {
                sets: ['Literature Genes'],
                color: '#306FBF',
                opacity: 0.8,
                value: regulon,
                gene_list: reg_list
            }, {
                sets: ['Literature Genes', 'ChIP Genes'],
                value: overlap,
                color: '#04724D',
                opacity: 0.7,
                name: 'Genes in ChIP and Literature Data',
                gene_list: both_list
            }, {
                sets: ['ChIP all contained in Literature'],
                value: chip2,
                color: '#04724D',
                opacity: 0.7,
                name: 'Genes in ChIP and Literature Data',
                gene_list: both_list
            }, {
                sets: ['Literature Genes', 'ChIP all contained in Literature'],
                value: chip2,
                color: '#04724D',
                opacity: 0.7,
                name: 'Genes in ChIP and Literature Data',
                gene_list: both_list
            }, {
                sets: ['Literature all contained in ChIP'],
                value: regulon2,
                color: '#04724D',
                opacity: 0.7,
                name: 'Genes in ChIP and Literature Data',
                gene_list: both_list
            }, {
                sets: ['ChIP Genes', 'Literature all contained in ChIP'],
                value: regulon2,
                color: '#04724D',
                opacity: 0.7,
                name: 'Genes in ChIP and Literature Data',
                gene_list: both_list
            }, {
                sets: ['Literature == ChIP'],
                value: overlap2,
                color: '#04724D',
                opacity: 0.7,
                name: 'Genes in ChIP and Literature Data',
                gene_list: both_list
            }]
        }],
        title: {
            text: tfName+" ChIP-pro Genes versus Literature Genes"
        },
        caption: {
            text: "* Literature data from: " + data_source,
            align: "right"
        },
        tooltip: {
            formatter: function () {
                // display totals
                var tooltip = this.point.name + ": <b>" + this.point.value + "</b>";
                if (this.point.name == "Literature Genes" | this.point.name == "ChIP Genes") {
                    tooltip += "<br>Genes in " + this.point.name.substring(0, this.point.name.length - 6);
                    tooltip += " only: <b>" + (this.point.gene_list.split(', ').length) + "</b>";
                }

                // remove genes if there are too many to display
                var print_genes = this.point.gene_list;
                if (print_genes.length > 500) {
                    var gene_vector = print_genes.split(', ');
                    print_genes = '';
                    var i = 0;
                    while (print_genes.length < 500) {
                        print_genes += gene_vector[i] + ', ';
                        i += 1;
                    }
                    print_genes = print_genes.slice(0, print_genes.length - 2);
                    print_genes += ' +' + (gene_vector.length - i);
                }
                tooltip += "<br>" + print_genes;

                return tooltip;
            }
        },
        exporting: {
            enabled: true,
            menuItemDefinitions: {
                downloadData: {
                    onclick: function () {
                        data_download(csvContent, tfName + '_venn_data.csv');
                    },
                    text: 'Download venn data'
                }
            },
            buttons: {
                contextButton: {
                    menuItems: ['downloadPNG', 'downloadSVG', 'downloadData']
                }
            }
        }
    });

};