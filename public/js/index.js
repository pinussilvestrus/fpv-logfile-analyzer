const nextPage = function(href) {
    if (href) {
        window.location.href = href;
    } else {
        window.location.reload();
    }
};

function showAJAXError(req, textStatus, errorThrown) {
    if (textStatus === "timeout") {
        $.notify({
            // options
            message: 'Zeitüberschreitung der Anfrage'
        }, {
            // settings
            type: 'danger'
        });
    } else {
        $.notify({
            // options
            message: errorThrown
        }, {
            // settings
            type: 'danger'
        });
    }
}

$('a[data-method="delete-material"]').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    let $buttonContext = $(this);
    $.ajax({
        url: $buttonContext.attr('href') + '?logFile=' + $buttonContext.attr('logfile'),
        type: 'DELETE',
        error: showAJAXError,
        success: function(result) {
            nextPage($buttonContext.attr('redirect'));
        },
    });
});

const loadBarChart = function() {
    let $barChart = $('.bar-chart');

    let data = {
        labels: ['vorher', 'nachher'],
        series: [
            [$barChart.data('vorher'), $barChart.data('nachher')]
        ]
    };

    let options = {
        width: 800,
        height: 800,
        chartPadding: {
            top: 20,
            right: 50,
            bottom: 30,
            left: 50
        },
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisY: {
                    axisTitle: 'Energie in kWh',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: -20
                    },
                    textAnchor: 'middle',
                    flipTitle: false
                }
            })
        ]
    };

    new Chartist.Bar('.bar-chart', data, options);
};

const loadPieChart = function() {
    let $pieChart = $('.pie-chart');

    let data = {
        labels: ['Server', 'Zero-Clients'],
        series: [$pieChart.data('serverraum'), $pieChart.data('zeroclients')]
    };

    let options = {
        width: 300,
        height: 400
    };

    let responsiveOptions = [
        ['screen and (min-width: 640px)', {
            chartPadding: 30,
            labelOffset: 120,
            labelDirection: 'explode',
            labelInterpolationFnc: function(value) {
                return value;
            }
        }],
        ['screen and (min-width: 1024px)', {
            labelOffset: 80,
            chartPadding: 20
        }]
    ];

    new Chartist.Pie('.pie-chart', data, options);
};

$('.pie-chart').ready(function(e) {
    if( $('.pie-chart').length )   {
        loadPieChart();
        loadBarChart();
    }
});