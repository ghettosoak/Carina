function map_range(value, low1, high1, low2, high2) {
    return (low2 + (high2 - low2) * (value - low1) / (high1 - low1)).toFixed(2);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var mustacheCache = {};
/**
 * This wraps the mustache rendering in a single function.
 * It will ajax and compile the template (or use locally if available)
 * @param template string template name to load or get from cache
 * @param data render data to use
 * @param callback callback gives output string
 */
var render = function (template, data, callback) {
    // template is in cache
    if (mustacheCache[template] !== undefined) {
        callback(mustacheCache[template](data));
    }
    // We have to load and compile the template first
    else {
        $.ajax({
            url: 'inc/'+template+'.mustache',
            success: function(rawTemplate) {
                // cache the template for later use
                mustacheCache[template] = Mustache.compile(rawTemplate);
                // Then render it can callback
                callback(mustacheCache[template](data));
            },
            error: function ( jqXHR, textStatus, errorThrown) {
                throw new Error(errorThrown);
            },
            dataType: 'text'
        });
    }
};