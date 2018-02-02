
function setSelect() {
    var returnVal = "";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i + 1).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}



var MIN;

function display() {
    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + document.getElementById('artistName').value,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function (result) {
            console.log(result);
            MIN = result.results;
        },
        error: function () {
            alert('Failed!');
        }
    });
    var albums = [];
    var table = "<table id = 'displaytable'>";
    var finalArray = [];
    var titles = "";
    table += '<th>' + document.getElementById('artistName').value + '</th>';

    for (var i = 0; i < MIN.length; i++) {
        if (MIN[i].kind === 'song') {
            albums.push(MIN[i]);
        }
    }
    console.log(albums);

    for (var x = 0; x < albums.length; x++) {

        if (finalArray[x] === undefined || finalArray[x].collectionName !== albums[x].collectionName) {
            finalArray.push(albums[x]);
            console.log(finalArray[x].collectionName);
        }

    }

    for (var z = 0; z < finalArray.length-1; z++) {

        var thisName = finalArray[z].collectionName;
        var g = false;

        console.log('this one:', thisName);

        for (var y = 0; y < finalArray.length-1; y++) {

            if (thisName === finalArray[y].collectionName) {

                console.log('that one:', finalArray[y+1].collectionName);

                if(!g) {
                    table += '<tr><td>' + finalArray[y].artistName + '</td><td><image src ="'+finalArray[y].artworkUrl100+'"></td><td>'+finalArray[y].collectionName+'</td></tr>';
                    g = true;
                }

                finalArray = finalArray.slice(y+1);
            }
        }

        console.log(finalArray);
    }

    for (var f = 0; f < document.getElementById('numResults').value && f < finalArray.length; f++) {
        table += '<tr><td>' + finalArray[f].artistName + '</td><td><image src ="'+finalArray[f].artworkUrl100+'"></td><td>'+finalArray[f].collectionName+'</td></tr>';
    }

    table += "</table>";
    document.getElementById("display").innerHTML = table;
}
/*

        titles = albums[x].collectionName;
        var thisOne = "";

        for (var z = 0; z < albums.length; z ++) {

            console.log(finalArray);

            if (finalArray[x] !== undefined) {
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

                for(var y = 0; y < 1; y ++) {

                    if(finalArray[y] === undefined || finalArray[y].collectionName !== titles) {
                        finalArray.push(albums[z]);
                        console.log(titles, thisOne);
                        console.log(finalArray);

                    }
                }
            }
        }
    }
}
*/