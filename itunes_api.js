
var band = "The Civil Wars";
var go;

$.ajax({
    url: 'https://itunes.apple.com/search?term=' + band,
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    success: function(result) {
        console.log(result);
        go = result;
    },
    error: function() { alert('Failed!');
    }
});


/*
function validateName(x) {
    var length = x.length;
    for(var i = 0; i < length; i++) {
        if(x[i] === " ") {
            var y = x.substring(0,i);
            y = y + "+";
            x = y + x.substring(i+1, x.length);
        }
    }
}
*/