/**
 * @summary Creates interactive venn diagrams between regulon and chip-seq data for ChIPdb
 * @author Tahani Al Bulushi
 * requires highcharts
 */

 // data download helper function
function data_download(json_data, file_name) {
    var a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // convert json data into json format
    var json = JSON.stringify(json_data);
    blob = new Blob([json], {type: "octet/stream"});

    // Set the HREF to a Blob representation of the data to be downloaded
    a.href = window.URL.createObjectURL(blob);

    // Use download attribute to set set desired file name
    a.setAttribute("download", file_name);

    // Trigger the download by simulating click
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
    }

// Write plot to container
function generateVenn(jsconContent, container) {
    var vennData = []
    for (let i = 0; i < jsconContent.length; i++) {
        var obj = jsconContent[i];
        vennData.push(obj)
    }
     console.log(vennData)
    for (let i = 0; i < vennData.length; i++) {
        const value = vennData[i].value;
        const gene_list = vennData[i].list;
    }

    // TF_name
    var tfName = vennData[0].value

    // Data Source
    var data_source = vennData[0].list
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
                name: 'Genes in ChIP Data',
                sets: ['Chip-seq Genes'],
                color: '#F5CB5C',
                opacity: 0.7,
                value: chip_only_val,
                gene_list: chip_only_list
            }, {
                name: 'Genes in ChIP and Regulon Data',
                sets: ['Chip-seq Genes', 'Regulon Genes'],
                color: '#04724D',
                opacity: 0.7,
                value: shared_val,
                gene_list: shared_list
            }, {
                name: 'Genes in Regulon Data*',
                sets: ['Regulon Genes'],
                color: '#306FBF',
                opacity: 0.7,
                value: reg_only_val,
                gene_list: reg_only_list
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
            text: null
        },
        credits: {
        text: '*Regulon data is from: ' + data_source,
        href: 'https://www.pnas.org/content/118/2/e2021171118.short?casa_token=j6iYmpSar'+
              'iUAAAAA:jm2p2N_4kt5nojgedZDesurBz-elvG6K1BIipb6hcpBJqKU6nRFuqnEkM9Jt3Z_VOSJG9B-3JR5mLw',
	 	},
        tooltip: {
            width: '400px',
            formatter: function () {
                var tooltip = this.point.name + ": <b>" + this.point.value + "</b>";
                if (this.point.gene_list.length > 10 && this.point.gene_list.length < 20) {
                    tooltip += "<br>" + this.point.gene_list.slice(0, 10) + "<br>" +
                        this.point.gene_list.slice(10, this.point.gene_list.length - 1);
                } else if (this.point.gene_list.length > 20 && this.point.gene_list.length < 30) {
                    tooltip += "<br>" + this.point.gene_list.slice(0, 10) + "<br>" +
                        this.point.gene_list.slice(10, 20) + "<br>" +
                        this.point.gene_list.slice(20, this.point.gene_list.length - 1);
                } else if (this.point.gene_list.length > 30 && this.point.gene_list.length < 40) {
                    tooltip += "<br>" + this.point.gene_list.slice(0, 10) + "<br>" +
                        this.point.gene_list.slice(10, 20) + "<br>" +
                        this.point.gene_list.slice(20, 30) + "<br>" +
                        this.point.gene_list.slice(30, this.point.gene_list.length - 1);
                } else if (this.point.gene_list.length > 40) {
                    tooltip += "<br>" + this.point.gene_list.slice(0, 10) + "<br>" +
                        this.point.gene_list.slice(10, 20) + "<br>" +
                        this.point.gene_list.slice(20, 30) + "<br>" +
                        this.point.gene_list.slice(30, 40) + '...';
                } else {
                    tooltip += "<br>" + this.point.gene_list;
                }
                return tooltip;
            }
        }, //end of tooltip
      exporting: {
            menuItemDefinitions: {
                downloadData: {
                    onclick: function() {
                        data_download(jsconContent, tfName+'_venn_data.json');
                    },
                    text: 'Download venn data'
                }
            },
            buttons: {
                contextButton: {
                    menuItems: ['viewFullscreen', 'downloadPNG', 'downloadSVG', 'downloadData']
                }
            }
        }
    }); //end highcharts
}; //end dataVenn
