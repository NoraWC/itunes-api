
function setSelect() {
    var returnVal = "";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i + 1).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}


function funct(albums) {

    console.log(albums);

    for (var z = 0; z < albums.length-1; z++) {
        if(albums[z] !== undefined) {

            var thisName = albums[z].collectionName;

            console.log('this one:', thisName);
            var bool = false;
            for (var y = 0; y < albums.length-1; y++) {
                if(albums[y] !== undefined && albums[z] !== undefined) {
                    console.log(y);
                    //sometimes albums[z] will be undefined despite the check for it up top

                    //worked for regina spektor, mother mother;
                    // the beatles had 1 duplicate (abbey road, @ end and top of list)
                    //      location doesn't matter; the pogues had rum sodomy and the lash right b4 the end
                    //for some reason dodie always has tons of multiples

                    if (albums[z].collectionName === albums[y].collectionName) {

                        console.log('that one:', albums[y].collectionName);

                        if(!bool) {
                            bool = true;
                        } else {
                            if(y > 0) {
                                var greed = albums.slice(0, y);
                                var geier = albums.slice(y+1, albums.length);
                                albums = geier.concat(greed);
                            } else {
                                albums = albums.slice(1);
                            }
                        }
                        console.log(albums);
                    }
                }

            }
        }
    }

    for(var len = 0; len < albums.length-1; len++) {
        if(albums[len] !== undefined) {
            console.log(albums[len].collectionName);
        }
    }

    return albums;
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
            var tableLength = 0;
            table += '<th>' + document.getElementById('artistName').value + '</th>';

            for (var i = 0; i < result.results.length; i++) {
                if (result.results[i].kind === 'song') {
                    albums.push(result.results[i]);
                }

            }
            for(var z = 0; z < 2; z++) {
                albums = funct(albums);
            }

            
            for (tableLength; tableLength < document.getElementById('numResults').value && tableLength < albums.length; tableLength++) {
                table += '<tr><td>' + albums[tableLength].artistName + '</td><td><image src ="'+albums[tableLength].artworkUrl100+'"></td><td>'+albums[tableLength].collectionName+'</td></tr>';
            }

            table += "</table>";
            document.getElementById("display").innerHTML = table;
        },
        error: function () {
            alert('Failed!');
        }
    });
}
