function setSelect() {
    var returnVal = "";
    for (var i = 0; i < 25; i++) {
        returnVal += "<option id = '" + (i + 1).toString() + "'>" + (i + 1).toString() + "</option>";
    }
    document.getElementById("numResults").innerHTML += returnVal;
}

function display(obj) {

    var table = "<table id = 'displaytable'>";
    var mani = obj.results;
    table += '<th>'+ mani.artistName + '</th>';
    for (var i = 0; i < document.getElementById("numResults").value; i++) {
        table += '<tr><td>'+mani[i].collectionCensoredName + '</td><td>' +  mani[i].trackName+'</td></tr>';
    }
    table += "</table>";
    document.getElementById("display").innerHTML = table;
}