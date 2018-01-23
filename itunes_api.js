

/*
$.ajax({
   url: “https://itunes.apple.com/search?term=jack+johnson”,
   type: 'GET',
   crossDomain: true,
   dataType: 'jsonp',
   success: function(result) {
console.log(result);
myFunction(result) },
});

 */

var NAME = '';

function validateName() {
    NAME = document.getElementById("artistName").value;
    var length = NAME.length;
    for(var i = 0; i < length; i++) {
        if(NAME[i] === " ") {
            NAME = NAME.split(0,i) + "+" + NAME.split(i+1, NAME.length);
        }
    }
    console.log(NAME);
}

function search() {
    //jquery
}