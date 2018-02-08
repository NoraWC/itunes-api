
function setSelect() {
    //sets up drop down for results
    var returnVal = "<option>Albums to Display:</option>";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}


function funct(albums) {
    for (var z = 0; z < albums.length-1; z++) {

        if(albums[z] !== undefined) {
            //lets each item pass through the for loop below exactly once
            var bool = false;
            for (var y = 0; y < albums.length-1; y++) {
                if(albums[y] !== undefined && albums[z].collectionName === albums[y].collectionName) {
                    //double check that this is an item; also if it pops up once in each array
                    if(!bool) {
                        //if it hasn't come through before it gets ignored
                        bool = true;
                        //and sets bool to true to stop other items from doing the same thing
                    } else {
                        //if it has come through before (ie if there are more than one of the item)
                        if(y > 0) {
                            //if it's not 0
                            //remove it
                            var firstHalf = albums.slice(0, y);
                            var secondHalf = albums.slice(y+1, albums.length);
                            //reconnect the two parts
                            albums = firstHalf.concat(secondHalf);
                        } else {
                            //if it is index 0
                            albums = albums.slice(1);
                        }
                    }
                }
            }
        }
    }
    //final sweep for duplicates
    for(var len = 0; len < albums.length-1; len++) {
        //weeds out errors
        if(albums[len] !== undefined) {
            //iterates through array to find duplicates next to each other
            if(len > 0 && albums[len].collectionName === albums[len-1].collectionName) {
                albums = albums.slice(0, len-1).concat(albums.slice(len, albums.length));
                len = 0;
            }
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

            if(result.results.length === 0) {
                //if no results come up
                alert("iTunes doesn't have any artists that match that name.");
            } else if (document.getElementById('numResults').value === 'Albums to Display:') {
                alert("Please choose how many albums to display.");
            } else {
                var albums = [];
                var table = "";
                var tableLength = 0;


                //adds all songs to array albums (so they can be checked for which album they belong to, etc)
                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i].kind === 'song') {
                        albums.push(result.results[i]);
                    }
                }
                //iterates through array to make double, triple, quadruple sure there are no duplicates
                for(var z = 0; z < albums.length; z++) {
                    albums = funct(albums);
                }

                //creates table w/ cleaned-up array
                for (tableLength; tableLength < document.getElementById('numResults').value && tableLength < albums.length; tableLength++) {
                    //table can't be longer than desired results; also can't be longer than available info!
                    table += '<tr><td class = "hide"><image src ="'+albums[tableLength].artworkUrl100+'"></td><td>';
                    table+=albums[tableLength].collectionName+' by ' + albums[tableLength].artistName+'</td></tr>';
                }
                //prettify table header!
                document.getElementById("displaytable").innerHTML = '<tr><td class = "title">You searched for ' + document.getElementById('artistName').value + '</td><td class = "title">Results: ' + tableLength+'</td></tr>';
                document.getElementById("displaytable").innerHTML += table;
            }

        },
        error: function () {
            //this never seems to be called so I added it up top
            alert("iTunes doesn't have any artists that match that name.");
        }
    });
}
