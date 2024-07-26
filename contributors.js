$(document).ready(function() {
    loadJSON(function(response) {
            var contributors = JSON.parse(response);
            showContributors(contributors);
        },
        "contributors.json");
});

function showContributors(contributors) {
    document.getElementById("contributors").innerHTML = getContributorsPerRepo(contributors);
}

function getContributorsPerRepo(contributors) {
    var all = contributors;
    var line = "";
    for (var i = 0; i < all.length; ++i) {
        var url = all[i].url;
        var contrib_url = url + "/graphs/contributors";
        var num_contributors = all[i].contributors.length;
        personOrPeople = 'person has contributed to';
        if (num_contributors > 1) {
            personOrPeople = 'people have contributed to';
        }
        line += "<p>" + num_contributors + " " + personOrPeople + " " + "<a href=\"" + contrib_url + "\" target=\"_blank\">" + url + "</a>.</p>";
    }
    return line;
}

//Note - this duplicates/overwrites the same function in plots.js when they are both included
// https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(callback, jsonFile) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonFile, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
