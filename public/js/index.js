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