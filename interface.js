
function setSelect() {
    var returnVal = "";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i + 1).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}




function display() {
    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + document.getElementById('artistName').value,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function (result) {
            console.log(result);
            var albums = [];
            var table = "<table id = 'displaytable'>";
            table += '<th>' + document.getElementById('artistName').value + '</th>';

            for (var i = 0; i < result.results.length; i++) {
                if (result.results[i].kind === 'song') {
                    albums.push(result.results[i]);
                }

            }
            console.log(albums);

            for (var z = 0; z < albums.length; z++) {
                if(albums[z] !== undefined) {
                    console.log(albums);
                    var thisName = albums[z].collectionName;

                    console.log('this one:', thisName);

                    var bool = false;

                    for (var y = 0; y < albums.length; y++) {

                        if (albums[z].collectionId === albums[y].collectionId) {

                            console.log('that one:', albums[y].collectionName);
                            if(!bool) {
                                table += '<tr><td>' + albums[z].artistName + '</td><td><image src ="'+albums[z].artworkUrl100+'"></td><td>'+albums[z].collectionName+'</td></tr>';
                                bool = true;
                            }
                            albums = albums.slice(y);
                            console.log(albums);
                        }
                    }
                }


                console.log(albums);
            }


            for (var f = 0; f < document.getElementById('numResults').value && f < albums.length; f++) {
                table += '<tr><td>' + albums[f].artistName + '</td><td><image src ="'+albums[f].artworkUrl100+'"></td><td>'+albums[f].collectionName+'</td></tr>';
            }

            table += "</table>";
            document.getElementById("display").innerHTML = table;
        },
        error: function () {
            alert('Failed!');
        }
    });
}
