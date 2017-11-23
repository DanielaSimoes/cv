function parseTXTfile(url){
    var result = null;

    $.ajax({
        url: url,
        type: 'get',
        dataType: 'text',
        async: false,
        success: function(data) {
            result = data;
        }
    });

    // Entire file read as a string
    // The tokens/values in the file
    // Separation between values is 1 or mode whitespaces
    var tokens = result.split(/\s\s*/);

    // Array of values; each value is a string
    var numVertices = parseInt(tokens[0]);

    // For every vertex we have 6 floating point values
    var i, j;
    var aux = 1;
    var newVertices = [];
    var newColors = [];

    for(i = 0; i < numVertices; i++){
        for(j = 0; j < 3; j++){
            newVertices[3 * i + j] = parseFloat(tokens[aux++]);
        }

        for(j = 0; j < 3; j++){
            newColors[3 * i + j] = parseFloat(tokens[aux++]);
        }
    }

    return {"vertices": newVertices.slice(), "colors": newColors.slice()};
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return decodeURI(results[1]) || 0;
    }
}