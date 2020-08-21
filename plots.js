var alias;
$(document).ready(function() {
var urlParams = new URLSearchParams(window.location.search);
        alias=(urlParams.get('parentAlias'));
	$.getJSON(
    '/api/info/metrics/tree' + addAlias(),
    function(data) {
	    var nodes = data.data;
	if(typeof nodes.children !== 'undefined') {
	    nodes.children.forEach((node)=> {
		    updateNames(node);
	    });
	}
	
        $('#dvtree').tree({
            data: [nodes],
		autoEscape:false
        });
    }
);

    loadJSON(function(response) {
	    var config = JSON.parse(response);
            dataverses(config);
            datasets(config);
            dataversesToMonth(config);
            dataversesByCategory(config);
            datasetsToMonth(config);
            datasetsBySubject(config);
            filesToMonth(config);
            downloadsToMonth(config);
	        versions(config);
	        versionsBar(config);
            populateInstallations(config);
        },
        "config.json");

});

function updateNames(node) {
	 node.name= "<a href='" + window.location + "?parentAlias=" + node.alias + "'>" + node.alias + "</a>";
	if(typeof node.children !== 'undefined') {
	 node.children.forEach((childnode)=> {
		 updateNames(childnode);
	 });
	}
}

function dataverses(config) {
    var color = config["colors"]["dataverses/toMonth"];
    var month_filter_enabled = config["month_filter_enabled"];
    myloadJSON(function(data) {
	    alert(data);

	    data = JSON.parse(data).data;
//	    data = expandAndAggregateTimeSeries(JSON.parse(data).data);
//        if (month_filter_enabled) {
//            data = data.filter(function(d) {
//                return parseInt(d.month.split('-')[1]) % 2 == 0;
//            })
//        }
//        coerceToNumeric(data);
        var yLabel = "Number of Dataverses";
        var visualization = d3plus.viz()
            .data(data)
            .title("Dataverses")
            .container("#dataverses")
            .type("bar")
            .id("date")
            .x({
                "value": "date",
                "label": "Month"
            })
            .y({
                //"range": yAxisTruncation(data, 500),
                "range": [0, data[data.length - 1].count * 1.3],
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return color;
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
            .draw();
    }, "/api/info/metrics/dataverses/monthly" + addAlias());
	$("#dataverses").append($("<a/>").addClass("button").attr("href", "/api/info/metrics/dataverses/monthly").attr("type", "text/csv").attr("download","dataverses.timeseries.csv").text("CSV"));
}

function datasets(config) {
    var color = config["colors"]["datasets/toMonth"];
    var month_filter_enabled = config["month_filter_enabled"];
    myloadJSON(function(data) {
data = JSON.parse(data).data;
//data = expandAndAggregateTimeSeries(JSON.parse(data).data);
//        if (month_filter_enabled) {
//            data = data.filter(function(d) {
//                return parseInt(d.month.split('-')[1]) % 2 == 0;
//            })
//        }
//        coerceToNumeric(data);
        var yLabel = "Number of Datasets";
        var visualization = d3plus.viz()
            .data(data)
            .title("Datasets")
            .container("#datasets")
            .type("bar")
            .id("date")
            .x({
                "value": "date",
                "label": "Month"
            })
            .y({
                //"range": yAxisTruncation(data, 500),
                "range": [0, data[data.length - 1].count * 1.3],
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return color;
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
            .draw();
    }, "/api/info/metrics/datasets/monthly" + addAlias());
	        $("#datasets").append($("<a/>").addClass("button").attr("href", "/api/info/metrics/datasets/monthly").attr("type", "text/csv").attr("download","datasets.timeseries.csv").text("CSV"));
}

function dataversesToMonth(config) {
    var color = config["colors"]["dataverses/toMonth"];
    var month_filter_enabled = config["month_filter_enabled"];
    d3.tsv("dataverses-toMonth.tsv", function(error, data) {
        if (error) return console.error(error);
        if (month_filter_enabled) {
            data = data.filter(function(d) {
                return parseInt(d.month.split('-')[1]) % 2 == 0;
            })
        }
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
                "range": [0, data[data.length - 1].count * 1.3],
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return color;
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
            .draw();
    });
}

function dataversesByCategory(config) {
    var colors = config["colors"]["dataverses/byCategory"];
    d3.tsv("dataverses-byCategory.tsv", function(error, data) {
        if (error) return console.error(error);
        var tileLabel = "Number of Dataverses";
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
            .color({
                value: "count",
                heatmap: colors.reverse()
            })
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
            .draw();
    });
}

function datasetsToMonth(config) {
    var color = config["colors"]["datasets/toMonth"];
    var month_filter_enabled = config["month_filter_enabled"];
    d3.tsv("datasets-toMonth.tsv", function(error, data) {
        if (error) return console.error(error);
        if (month_filter_enabled) {
            data = data.filter(function(d) {
                return parseInt(d.month.split('-')[1]) % 2 == 0;
            })
        }
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
                "range": [0, data[data.length - 1].count * 1.3],
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return color;
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
            .draw();
    });
}

function datasetsBySubject(config) {
    var subjectBlacklist = config["blacklists"]["datasets/bySubject"];
    var colors = config["colors"]["datasets/bySubject"];
    d3.tsv("datasets-bySubject.tsv", function(error, data) {
        if (error) return console.error(error);
        var tileLabel = "Number of Datasets";
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
            .color({
                value: "count",
                heatmap: colors.reverse()
            })
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
            .draw();
    });
}

function filesToMonth(config) {
    var color = config["colors"]["files/toMonth"];
    var month_filter_enabled = config["month_filter_enabled"];
    d3.tsv("files-toMonth.tsv", function(error, data) {
        if (error) return console.error(error);
        if (month_filter_enabled) {
            data = data.filter(function(d) {
                return parseInt(d.month.split('-')[1]) % 2 == 0;
            })
        }
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
                "range": [0, data[data.length - 1].count * 1.3],
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return color;
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
            .draw();
    });
}

function downloadsToMonth(config) {
    var color = config["colors"]["downloads/toMonth"];
    var month_filter_enabled = config["month_filter_enabled"];
    d3.tsv("downloads-toMonth.tsv", function(error, data) {
        if (error) return console.error(error);
        if (month_filter_enabled) {
            data = data.filter(function(d) {
                return parseInt(d.month.split('-')[1]) % 2 == 0;
            })
        }
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
                "range": [0, data[data.length - 1].count * 1.3],
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return color;
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
            .draw();
    });
}

function versions(config) {
    var colors = config["colors"]["versions"];
    d3.tsv("version.tsv", function(error, data) {
        if (error) return console.error(error);
        var tileLabel = "Number of Instances";
        coerceToNumeric(data);
        var visualization = d3plus.viz()
            .data(data)
            .title("Instances by Version")
            .title({
                "total": true
            })
            .container("#versions")
            .type("tree_map")
            .id("name")
            .size("count")
            .color({
                value: "count",
                heatmap: colors.reverse()
            })
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
            .draw();
    });
}

function versionsBar(config) {
    var color = config["colors"]["versionsBar"];
    d3.tsv("version.tsv", function(error, data) {
        if (error) return console.error(error);
        var yLabel = "Number of Instances";
        coerceToNumeric(data);
        var visualization = d3plus.viz()
            .data(data)
            .title("Instances by Version")
            .container("#versionsBar")
            .type("bar")
            .id("name")
	    .x({
                "value": "name",
                "label": "Version"
            })
            .order(function(d) {
		    var ind=d.name.indexOf("-");
		    var name=d.name;
		    if(ind>0) {
//			    name = d.name.substring(0,ind);
		    }
		    if(d.name.startsWith("V")) {
			    name = name.substring(1);
		    }

    return 15-["4.6", "4.6.1", "4.8.5", "4.9.2", "4.9.4", "4.10.1","4.13", "4.14", "4.15.1", "4.16","4.17", "4.18.1", "4.19", "4.19.3", "4.20"].indexOf(name);
})
	   .y({
                "range": yAxisTruncation(data, 10),
                //"range": [0, data[data.length - 1].count * 1.3],
                "value": "count",
                "label": yLabel
            })
            .color(function(d) {
                return color;
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
            .draw();
    });
}

function addAlias() {
	return ((alias === null) ? '' : '?parentAlias=' + alias);
}

function coerceToNumeric(data) {
    data.forEach(function(d) {
        d3.keys(d).forEach(function(k) {
            if (k == "count") {
                d[k] = +d[k];
            }
        });
    });
    return data;
}

function expandAndAggregateTimeSeries(data) {
var startDate = data[0].date;
console.log(startDate);
var now  = new Date().toISOString().slice(0,7);
console.log(now);
var timeseries = [];

var curDate = new Date(startDate + '-02');
var i=0;
var totalCount=data[0].count;
	var curDateString= curDate.toISOString().slice(0,7);
timeseries[i]={"date":curDateString,"count":totalCount};
do{
curDate=nextMonth(curDate);
curDateString=curDate.toISOString().slice(0,7);
i+=1;
const entry = data.find(obj => obj.date == curDateString);
if( typeof entry !== 'undefined' ) {
  totalCount = totalCount + entry.count;
}

timeseries[i]={"date":curDateString,"count":totalCount};
} while(curDateString != now);
    return timeseries;
}

function nextMonth(date) {
  if (date.getMonth() == 11) {
    var current = new Date(date.getFullYear() + 1, 0, 1);
  } else {
    var current = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }
  return current;
}


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

function populateInstallations(config) {
    loadJSON(function(response) {
	    var allInstallations= JSON.parse(response);
            if (config.installations.length === 1) {
                document.getElementById("discrepancies").hidden = true;
            }
            document.getElementById("installations").innerHTML = createListOfInstallations(config, allInstallations);
        },
        "all-dataverse-installations.json");
}

function createListOfInstallations(config, allInstallations) {
    var all = allInstallations.installations;
    var polled = config.installations;
    var polledHostnames = [];
    for (var i = 0; i < polled.length; ++i) {
        var url = new URL(polled[i]);
        var hostname = url.hostname;
        polledHostnames.push(hostname);
    }
    var list = "<ul>";
    for (var i = 0; i < all.length; ++i) {
        var hostname = all[i].hostname;
        var name = all[i].name;
        if (polledHostnames.includes(hostname)) {
            list += "<li>";
            list += "<a href=\"http://" + hostname + "\" target=\"_blank\">" + name + "</a>";
            list += "</li>";
        }
    }
    list += "</ul>";
    return list;
}

// https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function myloadJSON(callback, jsonFile) {
    var xobj = new XMLHttpRequest();
//    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonFile, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.setRequestHeader('accept','application/json');
    xobj.send();
}
