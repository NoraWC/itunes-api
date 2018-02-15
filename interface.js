
var ALBUMS_LIST = [];

function setSelect() {
    //sets up drop down for results
    var returnVal = "<option>Max Albums to Display:</option>";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}

function begin() {
    //sets up table
    var z = "";
    for (var i = 0; i < 25; i++) {
        z+= "<tr><td class = 'hide' id = 'image"+i+"'></td><td class = 'hide' id = 'td"+i+"'><button class = 'hide' id = 'button"+i+"' onclick = 'detailView("+i+");'></button></td></tr>";
    }
    document.getElementById("displaytable").innerHTML += z;
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


                for (var tableLength = 0; tableLength < document.getElementById('numResults').value; tableLength++) {
                    //edits table to have info

                    $('#td'+tableLength).removeClass("hide");
                    $('#button'+tableLength).addClass("details");
                    $('#button'+tableLength).html(ALBUMS_LIST[tableLength].collectionCensoredName+' by '+ALBUMS_LIST[tableLength].artistName+'<br><br>Click for more info!');

                    $('#image'+tableLength).html('<image src ="'+ALBUMS_LIST[tableLength].artworkUrl100+'">');

                }

            }

        },
        error: function () {
            //this never seems to be called so I added it up top
            alert("iTunes doesn't have any artists that match that name.");
        }
    });
}

function detailView(num) {
    var button = document.getElementById('button'+num);
    var fin = ALBUMS_LIST[num].collectionCensoredName +' by '+ALBUMS_LIST[num].artistName+'<br>Genre: '+ALBUMS_LIST[num].primaryGenreName+'<br>';

    if(ALBUMS_LIST[num].collectionExplicitness !== 'explicit') {
        fin += "Not explicit";
    } else {
        fin += "Explicit";
    }

    fin += '<br>Tracks: '+ALBUMS_LIST[num].trackCount+'<br>Cost: ' + ALBUMS_LIST[num].collectionPrice+' USD<br>Released on ';
    fin += ALBUMS_LIST[num].releaseDate.slice(0,10)+'<br><a href = ';
    var linkBase = 'https://itunes.apple.com/us/album/';
    var songName = ALBUMS_LIST[num].trackName;
    var url = ALBUMS_LIST[num].collectionViewUrl.slice(0,(linkBase.length+songName.length))+"/"+ALBUMS_LIST[num].collectionId;
    fin += url +'>View album in iTunes</a>';

    button.innerHTML = fin;
    button.onclick = function() {hide(num)};
}

function hide(num) {
    var place = document.getElementById('button'+num);
    place.onclick = function() {detailView(num)};
    place.innerHTML = ALBUMS_LIST[num].collectionCensoredName+' by '+ALBUMS_LIST[num].artistName+'<br><br>Click for more info!';
}

$(document).ready(function() {$('button.details').mouseenter(function(){
    var num = $(this).id;
    $(this).parent.css({'background_color': 'yellow'});


})});

/*
$(document).ready(function() {$('td').click(
    function(){//var num = $(this).id;
        //doesn't work after table is updated (because element didn't exist?)

        $('p#revealAll').css({'background-color': 'green'});
        //$(this).css({'background-color': 'green'});
        //$(this).html("ALBUMS_LIST[num].collectionCensoredName+' by '+ALBUMS_LIST[num].artistName");

})});
*/