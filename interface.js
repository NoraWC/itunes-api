
var ALBUMS_LIST = [];

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



function display(artist) {
    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + artist,
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
                ALBUMS_LIST = [];
                //resets array

                for (var i = 0; i < result.results.length; i++) {
                    //adds all songs to array albums (so they can be checked for which album they belong to, etc)
                    if (result.results[i].kind === 'song') {
                        ALBUMS_LIST.push(result.results[i]);
                    }
                }
                //iterates through array to make double, triple, quadruple sure there are no duplicates
                for(var z = 0; z < ALBUMS_LIST.length; z++) {
                    ALBUMS_LIST = funct(ALBUMS_LIST);
                }

                console.log(ALBUMS_LIST);

                layout();

            }

        },
        error: function () {
            //this never seems to be called so I added it up top
            alert("iTunes doesn't have any artists that match that name.");
        }
    });
}
function layout() {

    for (var i = 0; i < 25; i++) {
        //clears table
        $('#td'+i).addClass('hide');
        $('#simple'+i).html("");
        $('#secret'+i).css({'text-align': 'center'});
        $('#image'+i).html("");
    }

    for (var tableLength = 0; tableLength < document.getElementById('numResults').value; tableLength++) {

        //edits table to have info
        $('#td'+tableLength).removeClass("hide");

        $('#simple'+tableLength).html(ALBUMS_LIST[tableLength].collectionCensoredName+' by '+ALBUMS_LIST[tableLength].artistName);
        $('#secret'+tableLength).html(detailView(tableLength));
        $('#stop'+tableLength).addClass('goHere');
        $('#image'+tableLength).html('<image src ="'+ALBUMS_LIST[tableLength].artworkUrl100+'">');
    }
}
function detailView(num) {
    var thisAlbum = ALBUMS_LIST[num];
    var fin = 'Genre: '+thisAlbum.primaryGenreName+'<br>';

    if(thisAlbum.collectionExplicitness !== 'explicit') {
        fin += "Not explicit";
    } else {
        fin += "Explicit";
    }
    fin += '<br>Tracks: '+thisAlbum.trackCount+'<br>Cost: ' + thisAlbum.collectionPrice+' USD<br>Released on ';
    fin += thisAlbum.releaseDate.slice(0,10)+'<br>';
    fin += 'Click image to view album in iTunes';

    var linkBase = 'https://itunes.apple.com/us/album/';
    var songName = thisAlbum.trackName;
    var url = thisAlbum.collectionViewUrl.slice(0,(linkBase.length+songName.length))+"/"+thisAlbum.collectionId;

    $('#image'+num).on('click', function(){
        window.open(url, '_blank');
    });

    $('#song'+num).html('Hear a song from this album: <audio controls src="' + thisAlbum.previewUrl + '" type="audio/m4a">' + thisAlbum.previewUrl + '</audio>');

    return fin;

}

function begin() {
    //sets up table

    var z = "";
    for (var i = 0; i < 25; i++) {
        z+= "<tr><td class = 'hide' id = 'image"+i+"'></td><td class = 'hide' id = 'td"+i+"'>";
        z+= "<button id = 'go"+i+"' onclick = '$(\"#secret"+i+"\").removeClass(\"hide\"); $(\"song"+i+"\").removeClass(\"audioPlayer\"); $(\"#go"+i+"\").addClass(\"ehh\"); $(\"#stop"+i+"\").removeClass(\"ehh\");'></button>";//show deets
        z+= "<br><button class = 'ehh' id = 'stop"+i+"' onclick = '$(\"#secret"+i+"\").addClass(\"hide\");$(\"song"+i+"\").addClass(\"audioPlayer\"); $(\"#go"+i+"\").removeClass(\"ehh\"); $(\"#stop"+i+"\").addClass(\"ehh\");'></button>";//hide deets
        z+= "<div class = 'simple' id = 'simple"+i+"' ></div>";//bare bones info
        z+= "<div id = 'secret"+i+"' class ='hide'></div>";
        z+= "<div id = 'song"+i+"' class = 'audioPlayer'></div></td></tr>";//full info
    }
    document.getElementById("displaytable").innerHTML += z;
}