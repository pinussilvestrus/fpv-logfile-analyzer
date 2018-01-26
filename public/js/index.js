const nextPage = function(href) {
    console.log(href);
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
            console.log(result);
            nextPage($buttonContext.attr('redirect'));
        },
    });
});

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

    new Chartist.Pie('.ct-chart', data, options);
}

$(document).ready(function(e) {
    loadPieChart();
});