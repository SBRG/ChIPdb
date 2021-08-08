function method_pie(method_counts, container) {
    Highcharts.chart(container, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Sample count breakout by method type',
            style:{
                "font-size": "12px",
                "color": "#242423"
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: false
      },
      showInLegend: true
    }
  },
        series: [{
            name: 'Number of Samples',
            colorByPoint: true,
            data: [{
                name: `ChIP-exo (n=${method_counts['ChIP-exo']})`,
                y: method_counts['ChIP-exo'],
                sliced: true,
                selected: true,
                color: '#F5CB5C'
            }, {
                name: `ChIP-seq (n=${method_counts['ChIP-seq']})`,
                y: method_counts['ChIP-seq'],
                color: '#5A5E5A'
            }]
        },
        ],
        credits: {
            enabled: false
        }
    });
};