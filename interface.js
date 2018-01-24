var go;
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
function buttons () {
    document.getElementById('allbuttons').innerHTML = "<button id = 'search' onclick = 'display(go);";
    /*
    document.getElementById('allbuttons').innerHTML +=
        $.ajax({
            url: 'https://itunes.apple.com/search?term=' + document.getElementById('artistName').value,
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
        */
    document.getElementById('allbuttons').innerHTML += "'></button>";
}

function setSelect() {
    var returnVal = "";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i + 1).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}

function display(obj) {

    var table = "<table id = 'displaytable'>";
    var mani = obj.results;
    table += '<th>'+ mani.artistName + '</th>';
    for (var i = 0; i < document.getElementById("numResults").value; i++) {
        table += '<tr><td>'+mani[i].collectionCensoredName + '</td><td>' +  mani[i].trackName+'</td></tr>';
    }
    table += "</table>";
    document.getElementById("display").innerHTML = table;
}