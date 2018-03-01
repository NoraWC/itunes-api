
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
                    //double check that this is an item; also if it pops up at least once in each array
                    if(!bool) {
                        //if it hasn't come through before it gets ignored
                        bool = true;
                        //and sets bool to true to stop other items from doing the same thing
                    } else {
                        //if it has come through before (i.e. if there are more than one of the item)
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

            if(result.results.length === 0 || document.getElementById('numResults').value === 'Albums to Display:') {
                //if no results come up
                alert("Make sure you've selected an artist and a number of albums to display.");

            } else {
                ALBUMS_LIST = [];
                //resets array from previous artists, if any

                for (var i = 0; i < result.results.length; i++) {
                    //adds all songs to array albums (so they can be checked for which album they belong to, etc)
                    if (result.results[i].kind === 'song') {
                        ALBUMS_LIST.push(result.results[i]);
                    }
                }
                //iterates through array to make extra sure there are no duplicates
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

        //edits table to display basic info
        $('#td'+tableLength).removeClass("hide");

        $('#simple'+tableLength).html('<a href = "#" id = "link'+tableLength+'">'+ALBUMS_LIST[tableLength].collectionCensoredName+' by '+ALBUMS_LIST[tableLength].artistName+'<br>Click and hold for more info!</a>');

        //places info in table (still hidden)
        $('#secret'+tableLength).html(detailView(tableLength));

        //shows album art
        var imgurl = ALBUMS_LIST[tableLength].artworkUrl100.slice(0, ALBUMS_LIST[tableLength].artworkUrl100.length-3)+'png';
        $('#image'+tableLength).html('<image class = "image-thumbnail img-responsive" src ="'+imgurl+'">');

        //when the album title/artist name is clicked, the rest of the info appears...
        $('#link'+tableLength).on('mousedown', function(){
            $('#secret'+this.id.slice(4,5)).removeClass('hide');
        });
        //and disappears when the mouse is removed
        $('#link'+tableLength).on('mouseup', function() {
            $('#secret'+this.id.slice(4,5)).addClass('hide');
        });
    }
}
function detailView(num) {
    //sets up detail view
    var thisAlbum = ALBUMS_LIST[num];
    var fin = 'Genre: '+thisAlbum.primaryGenreName+'<br>';

    //checks explicitness
    if(thisAlbum.collectionExplicitness !== 'explicit') {
        fin += "Not explicit";
    } else {
        fin += "Explicit";
    }

    fin += '<br>Tracks: '+thisAlbum.trackCount+'<br>Cost: ' + thisAlbum.collectionPrice+' USD<br>Released on ';
    fin += thisAlbum.releaseDate.slice(0,10)+'<br>';
    fin += 'Click the image to view this album in iTunes!';

    //sets up link to album in iTunes (browser)
    var linkBase = 'https://itunes.apple.com/us/album/';
    var songName = thisAlbum.trackName;
    var url = thisAlbum.collectionViewUrl.slice(0,(linkBase.length+songName.length))+"/"+thisAlbum.collectionId;

    //when the image is clicked, a new tab will open to iTunes
    $('#image'+num).on('click', function(){
        window.open(url, '_blank');
    });

    //preview of a song (the song from the album that was found by the AJAX block)
    $('#song'+num).html('Hear a song from this album: <audio controls src="' + thisAlbum.previewUrl + '" type="audio/m4a">' + thisAlbum.previewUrl + '</audio>');
    return fin;

}

function begin() {
    //sets up table
    var table = "";
    for (var i = 0; i < 25; i++) {
        table+= "<tr><td class = 'hide' id = 'td"+i+"'><div class = 'col-xs-3' id = 'image"+i+"'></div>"; //sets up image area
        table+= "<div class = 'col-md-6'><span class ='simple' id = 'simple"+i+"'></span>"; //basic info area
        table+= "<br><span id = 'secret"+i+"' class ='hide'></span>";//detail view
        table+= "<br><span id = 'song"+i+"' class = 'audioPlayer'></span></div></td></tr>";//song preview and closing tags
    }
    document.getElementById("displaytable").innerHTML += table;
}