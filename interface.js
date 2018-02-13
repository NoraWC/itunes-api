
var ALBUMS_LIST;

function setSelect() {
    //sets up drop down for results
    var returnVal = "<option>Max Albums to Display:</option>";
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
                if(albums[y] !== undefined && albums[z].collectionId === albums[y].collectionId) {
                    //double check that this is an item; also if it pops up once in each array
                    if(!bool) {
                        //if it hasn't come through before it gets ignored
                        bool = true;
                        //and sets bool to true to stop other items from doing the same thing
                    } else {
                        //if it has come through before (if there are more than one of the item)
                        if(y > 0) {
                            //if index is not 0
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
    for(var length = 0; length < albums.length-1; length++) {
        //weeds out errors
        if(albums[length] !== undefined) {
            //iterates through array to find duplicates next to each other
            if(length > 0 && albums[length].collectionId === albums[length-1].collectionId) {
                albums = albums.slice(0, length-1).concat(albums.slice(length, albums.length));
                length = 0;
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

            var htmlTable = document.getElementById("displaytable");
            if(result.results.length === 0) {
                //if no results come up
                alert("iTunes doesn't have any artists that match that name.");

            } else if (document.getElementById('numResults').value === 'Albums to Display:') {

                alert("Please choose how many albums to display.");

            } else {
                var albums = [];
                var table = "";

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

                console.log(albums);
                ALBUMS_LIST = albums;

                //creates table w/ cleaned-up array
                for (var tableLength = 0; tableLength < document.getElementById('numResults').value && tableLength < albums.length; tableLength++) {
                    //table can't be longer than desired results; also can't be longer than available info!
                    table += '<tr><td class = "hide"><image src ="'+albums[tableLength].artworkUrl100+'"></td>';
                    table += '<td id = "'+albums[tableLength].collectionId+'"><button class = "details"  onclick = "detailView('+tableLength+');">';
                    table += albums[tableLength].collectionCensoredName+' by '+albums[tableLength].artistName+'</button></td></tr>';
                }

                htmlTable.innerHTML = '<tr><td class = "title"></td><td class = "title">You searched for ' + document.getElementById('artistName').value + '. Results: ' + tableLength+'</td></tr>';
                htmlTable.innerHTML += table;
            }

        },
        error: function () {
            //this never seems to be called so I added it up top
            alert("iTunes doesn't have any artists that match that name.");
        }
    });
}

function detailView(num) {
    var td = document.getElementById(ALBUMS_LIST[num].collectionId);
    var albumName = ALBUMS_LIST[num].collectionCensoredName;
    var fin = '<button class = "details"  onclick = "hide('+num+');">';
    fin += albumName +' by '+ALBUMS_LIST[num].artistName+'<br>Genre: '+ALBUMS_LIST[num].primaryGenreName+'<br>';

    if(ALBUMS_LIST[num].collectionExplicitness !== 'explicit') {
        fin += "Not explicit";
    } else {
        fin += "Explicit";
    }

    var linkBase = 'https://itunes.apple.com/us/album/';
    fin += '<br>Tracks: '+ALBUMS_LIST[num].trackCount+'<br>Cost: ' + ALBUMS_LIST[num].collectionPrice+' USD<br>Released on '+ALBUMS_LIST[num].releaseDate.slice(0,10);
    fin += '<br><a href = '+ALBUMS_LIST[num].collectionViewUrl.slice(0,(linkBase.length+albumName.length))+'>View album in iTunes</a>';
    //https://itunes.apple.com/us/album/would-you-be-so-kind/1255318399?i=1255319038&uo=4
    //would-you-be-so-kind/1255318399
    fin += '</button>';
    td.innerHTML = fin;
    td.onclick = 'hide('+num+');';
}

function hide(num) {
    var place = document.getElementById(ALBUMS_LIST[num].collectionId);
    place.innerHTML = '<button class = "details"  onclick = "detailView('+num+');">'+ALBUMS_LIST[num].collectionCensoredName+' by '+ALBUMS_LIST[num].artistName+'</button>';
}
//$('td.title').click($('this').animate({left: '80px'}));