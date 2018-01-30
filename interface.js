
function setSelect() {
    var returnVal = "";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i + 1).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}

/*
$(document).ready(
    $('#artistName').keyup(function(event) {
        if(event.which === 'enter') {
            display();
        }
    })
);
*/

function display() {

    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + document.getElementById('artistName').value,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(result) {
            if(result.results.length < 1) {
                alert('failed');
                return 0;
            }
            console.log(result);
            var table = "<table id = 'displaytable'>";
            var mani = result.results;
            var ret = [];
            var usedRet = [];
            table += '<th>'+ document.getElementById('artistName').value + '</th>';

            for (var i = 0; (i < document.getElementById("numResults").value && i < mani.length); i++) {
                if(mani[i].kind === 'song') {
                    ret.push(mani[i]);
                }
            }
            for (var x = 0; x < document.getElementById('numResults').value; x++) {

                for (var z = 0; z < ret.length; z ++) {
                    if(z>x) {
                        x=z;
                    }
                    if(ret[z] === ret[x]){
                        ret = ret.slice(z);
                    }
                }
                console.log(ret[x]);
                table += '<tr><td>' + ret[x].artistName + '</td><td><image src ="'+ret[x].artworkUrl100 +'"></td><td>'+ret[x].collectionName + '</td></tr>';

            }

            table += "</table>";
            document.getElementById("display").innerHTML = table;
        },
        error: function() { alert('Failed!');
        }
    });


}