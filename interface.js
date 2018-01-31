
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
            var albums = [];
            var titles = "";
            table += '<th>'+ document.getElementById('artistName').value + '</th>';

            for (var i = 0; (i < document.getElementById("numResults").value && i < result.results.length); i++) {
                if(result.results[i].kind === 'song') {
                    albums.push(result.results[i]);
                }
            }
            for (var x = 0; x < document.getElementById('numResults').value && x < albums.length ; x++) {
                titles = albums[x].collectionName;
                console.log(albums);
                for (var z = 0; z <= document.getElementById('numResults').value && z < albums.length && albums.length >=1; z ++) {
                    var thisOne = albums[z].collectionName;
                    if(titles === thisOne){
                        //need to add album to table just once
                        albums = albums.slice(z+1);
                        console.log(albums);
                    }
                    console.log(thisOne);
                    console.log(albums[x]);
                }
                if(albums[x] !== undefined) {
                    table += '<tr><td>' + albums[x].artistName + '</td><td><image src ="'+albums[x].artworkUrl100+'"></td><td>'+albums[x].collectionName+'</td></tr>';
                }
            }

            table += "</table>";
            document.getElementById("display").innerHTML = table;


        },
        error: function() { alert('Failed!');
        }
    });


}