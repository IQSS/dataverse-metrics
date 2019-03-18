$(document).ready(function() {
    loadJSON(function(response) {
            var config = JSON.parse(response);
            dataversesToMonth();
            dataversesByCategory();
            datasetsToMonth();
            datasetsBySubject(config);
            filesToMonth();
            downloadsToMonth();
            populateInstallations();
        },
        "config.json");
});

function dataversesToMonth() {
    d3.tsv("dataverses-toMonth.tsv", function(error, data) {
        if (error) return console.error(error);
        coerceToNumeric(data);
        var yLabel = "Number of Dataverses";
        var visualization = d3plus.viz()
            .data(data)
            .title("Total Dataverses")
            .container("#dataverses-to-month")
            .type("bar")
            .id("month")
            .x({
                "value": "month",
                "label": "Month"
            })
            .y({
                //"range": yAxisTruncation(data, 500),
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return "#cf3636";
            })
            .format({
                "text": function(text, params) {
                    if (text === "count") {
                        return yLabel;
                    } else {
                        return d3plus.string.title(text, params);
                    }
                }
            })
            .resize(true)
            .draw()
    });
};

function dataversesByCategory() {
    d3.tsv("dataverses-byCategory.tsv", function(error, data) {
        if (error) return console.error(error);
        var tileLabel = "Number of Dataverses";
        var attributes = [{
            "name": "Research Project",
            "hex": "#b22200"
        }, {
            "name": "Researcher",
            "hex": "#b2390c"
        }, {
            "name": "Research Group",
            "hex": "#3f8c8e"
        }, {
            "name": "Organization or Institution",
            "hex": "#3b7c88"
        }, {
            "name": "Journal",
            "hex": "#366881"
        }, {
            "name": "Laboratory",
            "hex": "#32587b",
        }, {
            "name": "Department",
            "hex": "#282f6b"
        }, {
            "name": "Teaching Course",
            "hex": "#282f6b"
        }];
        coerceToNumeric(data);
        var visualization = d3plus.viz()
            .data(data)
            .title("Dataverses by Category")
            .title({
                "total": true
            })
            .container("#dataverses-by-category")
            .type("tree_map")
            .id("name")
            .size("count")
            .attrs(attributes)
            .color("hex")
            .format({
                "text": function(text, params) {
                    if (text === "count") {
                        return tileLabel;
                    } else {
                        return d3plus.string.title(text, params);
                    }
                }
            })
            .legend(false)
            .resize(true)
            .draw()
    });
};

function datasetsToMonth() {
    d3.tsv("datasets-toMonth.tsv", function(error, data) {
        if (error) return console.error(error);
        coerceToNumeric(data);
        var yLabel = "Number of Datasets";
        var visualization = d3plus.viz()
            .data(data)
            .title("Total Datasets")
            .container("#datasets-to-month")
            .type("bar")
            .id("month")
            .x({
                "value": "month",
                "label": "Month"
            })
            .y({
                //"range": yAxisTruncation(data, 10000),
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return "#e58433";
            })
            .format({
                "text": function(text, params) {
                    if (text === "count") {
                        return yLabel;
                    } else {
                        return d3plus.string.title(text, params);
                    }
                }
            })
            .resize(true)
            .draw()
    });
};

function datasetsBySubject(config) {
    subjectBlacklist = config["blacklists"]["datasets/bySubject"];
    d3.tsv("datasets-bySubject.tsv", function(error, data) {
        if (error) return console.error(error);
        var tileLabel = "Number of Datasets";
        var attributes = [{
            "name": "Social Sciences",
            "hex": "#b22200"
        }, {
            "name": "#b2390c not used",
            "hex": "#b2390c"
        }, {
            "name": "Medicine, Health and Life Sciences",
            "hex": "#3f8c8e"
        }, {
            "name": "Agricultural Sciences",
            "hex": "#3b7c88"
        }, {
            "name": "Physics",
            "hex": "#3b7c88"
        }, {
            "name": "Arts and Humanities",
            "hex": "#366881"

        }, {
            "name": "Earth and Environmental Sciences",
            "hex": "#32587b",
        }, {
            "name": "Computer and Information Science",
            "hex": "#282f6b"
        }];
        coerceToNumeric(data);
        var visualization = d3plus.viz()
            .data(data)
            .title("Datasets by Most Common Subject")
            .title({
                "total": true
            })
            .container("#datasets-by-subject")
            .type("tree_map")
            .id("name")
            .id({
                "mute": subjectBlacklist
            })
            .size("count")
            .attrs(attributes)
            .color("hex")
            .format({
                "text": function(text, params) {
                    if (text === "count") {
                        return tileLabel;
                    } else {
                        return d3plus.string.title(text, params);
                    }
                }
            })
            .legend(false)
            .resize(true)
            .draw()
    });
};

function filesToMonth() {
    d3.tsv("files-toMonth.tsv", function(error, data) {
        if (error) return console.error(error);
        coerceToNumeric(data);
        var yLabel = "Number of Files";
        var visualization = d3plus.viz()
            .data(data)
            .title("Total Files")
            .container("#files-to-month")
            .type("bar")
            .id("month")
            .x({
                "value": "month",
                "label": "Month"
            })
            .y({
                //"range": yAxisTruncation(data, 20000),
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return "#006699";
            })
            .format({
                "text": function(text, params) {
                    if (text === "count") {
                        return yLabel;
                    } else {
                        return d3plus.string.title(text, params);
                    }
                }
            })
            .resize(true)
            .draw()
    });
};

function downloadsToMonth() {
    d3.tsv("downloads-toMonth.tsv", function(error, data) {
        if (error) return console.error(error);
        coerceToNumeric(data);
        var yLabel = "Number of File Downloads";
        var visualization = d3plus.viz()
            .data(data)
            .title("Total File Downloads")
            .container("#downloads-to-month")
            .type("bar")
            .id("month")
            .x({
                "value": "month",
                "label": "Month"
            })
            .y({
                //"range": yAxisTruncation(data, 1000000),
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return "#b94617";
            })
            .format({
                "text": function(text, params) {
                    if (text === "count") {
                        return yLabel;
                    } else {
                        return d3plus.string.title(text, params);
                    }
                }
            })
            .resize(true)
            .draw()
    });
};

function coerceToNumeric(data) {
    data.forEach(function(d) {
        d3.keys(d).forEach(function(k) {
            if (k == "count") {
                d[k] = +d[k]
            }
        });
    });
    return data;
};

function yAxisTruncation(metricArray, modNum) {
    var min = metricArray[0].count;
    var max = metricArray[metricArray.length - 1].count;
    if (min < modNum) {
        return [0, max + 10];
    }
    var rangeStart = min - (min % modNum);
    var rangeEnd = max - (max % modNum) + modNum;
    return [rangeStart, rangeEnd];
}

function populateInstallations() {
    loadJSON(function(response) {
            var config = JSON.parse(response);
            document.getElementById("installations").innerHTML = createListOfInstallations(config);
        },
        "config.json");
}

function createListOfInstallations(config) {
    data = config["installations"];
    var list = "<ul>";
    for (var i = 0; i < data.length; ++i) {
        list += "<li>";
        list += "<a href=\"" + data[i] + "\">" + data[i] + "</a>";
        list += "</li>";
    }
    list += "</ul>";
    return list;
}

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
