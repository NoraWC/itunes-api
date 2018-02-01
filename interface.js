
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
            var finalArray = [];
            var titles = "";
            table += '<th>'+ document.getElementById('artistName').value + '</th>';

            for (var i = 0; i < result.results.length; i++) {
                if(result.results[i].kind === 'song') {
                    albums.push(result.results[i]);
                }
            }
            console.log(albums);
            for (var x = 0; x < document.getElementById("numResults").value; x++) {
                titles = albums[x].collectionName;
                var thisOne = "";
                for (var z = 0; z < albums.length; z ++) {
                    console.log(finalArray);
                    if (finalArray.length !==0 && finalArray[x].collectionName !== undefined) {
                        thisOne = finalArray[x].collectionName;
                    } else {
                        thisOne = titles;
                    }
                    if(thisOne !== titles && finalArray.length < albums.length){
                        if(albums[z] !== undefined) {
                            finalArray.push(albums[z]);
                            albums = albums.slice(z+1);
                            console.log(titles, thisOne);
                            console.log(finalArray);
                        }
                    } else {
                        for(var y = 0; y < finalArray.length; y ++) {
                            if(finalArray[y].collectionName !== titles) {
                                finalArray.push(albums[z]);
                                console.log(titles, thisOne);
                                console.log(finalArray);
                            }
                        }
                    }
                }
            }
            for (var f = 0; f < document.getElementById('numResults').value; f++) {
                table += '<tr><td>' + finalArray[f].artistName + '</td><td><image src ="'+finalArray[f].artworkUrl100+'"></td><td>'+finalArray[f].collectionName+'</td></tr>';
            }

            table += "</table>";
            document.getElementById("display").innerHTML = table;


        },
        error: function() { alert('Failed!');
        }
    });


}