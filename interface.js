function setSelect() {
    var returnVal = "";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i + 1).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}

function display(rows, artist) {
    //rows = number of results the user selected from dropdown
    //artist = validateName(NAME);
    var table = "<table id = 'displaytable" + artist + "'>";
    for (var i = 0; i < rows; i++) {
        //iterate thru artists' itunes library
    }
    table += "</table>";
    document.getElementById("display").innerHTML += table;
}