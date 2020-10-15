//The alias of the published dataverse to show statistics for (stats are for this dataverse and all published children)
var alias;
//The Dataverse server address - can be "" if this app is deployed on the same server.
var dvserver = "";

$(document).ready(function() {

  //Determine which dataverse/sub-dataverse is the focus for the metrics
  // (Metrics are for the specified public/published dataverse and all it's public/published children)
  var urlParams = new URLSearchParams(window.location.search);
  alias = (urlParams.get('parentAlias'));

  //Retrieve the configuration,  complete the header, and start creating graphs
  $.getJSON('config.local.json', function(config) {

    // Set the Dataverse server to use
    if (config.hasOwnProperty("installationURL")) {
      dvserver = config.installationURL;
    }

    // Retrieve the tree of child dataverses and add them to the tree we use as a selector
    // getJSON could be used throughout (it wasn't previously due to bugs in the API endpoints in determining when to send json versus text/csv)
    $.getJSON(
      dvserver + '/api/info/metrics/tree' + addAlias(),
      function(data) {
        var nodes = data.data;
        if (typeof nodes.children !== 'undefined') {
          nodes.children.forEach((node) => {
            //Make each element in the tree (below the root) a link to get the metrics for that sub-dataverse
            updateNames(node);
          });
        }
        //Populate the tree widget
        $('#dvtree').tree({
          data: [nodes],
          autoEscape: false
        });
      }
    );

    //Header Information
    $('#title').html("<H1>Metrics from the " + config.installationName + "</H1>");
    if (alias == null) {
      $('#subtitle').html("<h2>Showing Metrics from the whole repository</h2>");
      $('#selectString').html('<div>Click a sub-' + config.dataverseTerm + ' name to see its metrics</div>');
    } else {
      $('#subtitle').html("<h2>Showing Metrics from the " + alias + " " + config.dataverseTerm + "</h2>");
      $('#selectString').html('<div><a href="/dataverse-metrics">Show Metrics for the whole repository</a></div><div>Click a sub-' + config.dataverseTerm + ' name to see its metrics</div>');
    }
    
    //Panels
    if(config.hasOwnProperty("downloadsHeader")) {
      $("#downloadSection").find("a").text(config.downloadsHeader);
    }
    if(config.hasOwnProperty("makeDataCountHeader")) {
      $("#mdcSection").find("a").text(config.makeDataCountHeader);
    }
    if(config.hasOwnProperty("holdingsHeader")) {
      $("#holdingsSection").find("a").text(config.holdingsHeader);
    }
    
    //Footer
    if (config.hasOwnProperty("globalConfigured")) {
      if(config.globalConfigured === "true") {
        $("#global").html('<a href="/dataverse-metrics/global">View Aggregate Metrics from the Dataverse Community</a>'); 
      }
    }

    //Individual graphs
    //Row 1
    timeseries("Dataverses", config);
    timeseries("Datasets", config);
    //Row 2
    dataversesByCategory(config);
    dataversesBySubject(config);
    //Row 3
    datasetsBySubject(config);
    timeseries("Files", config);
    //Row 4
    timeseries("Downloads", config);
    uniqueDownloads(config);
    //Row 5
    fileDownloads(config);
    //Row 6
    multitimeseries("UniqueDownloads", config, "pid");
    //Row 7 - by Count and by Size graphs
    filesByType(config);
    //Row 8
    makeDataCount("viewsTotal", config);
    makeDataCount("downloadsTotal", config);
    //Row 9
    makeDataCount("viewsUnique", config);
    makeDataCount("downloadsUnique", config);

  });
});

//Generic graph of time series - date versus count
function timeseries(name, config) {
  var lcname = name.toLowerCase();
  var nameLabel = name;
  var singular = lcname.substring(0, lcname.length -1);
  if(config.hasOwnProperty(singular + "Term")) {
    nameLabel = config[singular + "Term"] + "s";
  }
  var color = config["colors"][lcname + "/monthly"];
  $.ajax({
    url: dvserver + '/api/info/metrics/' + lcname + '/monthly' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {

      data = data.data;
      var yLabel = "Number of " + nameLabel;
      var visualization = d3plus.viz()
        .data(data)
        .title(nameLabel)
        .container("#" + lcname)
        .type("bar")
        .id("date")
        .x({
          "value": "date",
          "label": "Month"
        })
        .y({
          "range": [0, data[data.length - 1].count * 1.3],
          "value": "count",
          "label": yLabel
        })
        .color(function(d) {
          return color;
        })
        .resize(true)
        .draw()
    }
  });
  $("#" + lcname).append($("<a/>").addClass("button").attr("href", "/api/info/metrics/" + lcname + "/monthly" + addAlias()).attr("type", "text/csv").text("CSV"));
}


function dataversesByCategory(config) {
  var colors = config["colors"]["dataverses/byCategory"];
  $.ajax({
    url: dvserver + '/api/info/metrics/dataverses/byCategory' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {
      data = data.data;
      var tileLabel = "Number of " + config.dataverseTerm + "s";
      var visualization = d3plus.viz()
        .data(data)
        .title(config.dataverseTerm + "s by Category")
        .title({
          "total": true
        })
        .container("#dataverses-by-category")
        .type("tree_map")
        .id("category")
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
    }
  });
  $("#dataverses-by-category").append($("<a/>").addClass("button").attr("href", "/api/info/metrics/dataverses/byCategory" + addAlias()).attr("type", "text/csv").text("CSV"));
}

function dataversesBySubject(config) {
  var colors = config["colors"]["dataverses/bySubject"];
  $.ajax({
    url: dvserver + '/api/info/metrics/dataverses/bySubject' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {
      data = data.data;

      var tileLabel = "Number of " + config.dataverseTerm + "s";
      var visualization = d3plus.viz()
        .data(data)
        .title(config.dataverseTerm + "s by Subject")
        .title({
          "total": true
        })
        .container("#dataverses-by-subject")
        .type("tree_map")
        .id("subject")
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
    }
  });
  $("#dataverses-by-subject").append($("<a/>").addClass("button").attr("href", "/api/info/metrics/dataverses/bySubject" + addAlias()).attr("type", "text/csv").text("CSV"));
}

function datasetsBySubject(config) {
  var colors = config["colors"]["datasets/bySubject"];
  $.ajax({
    url: dvserver + '/api/info/metrics/datasets/bySubject' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {
      data = data.data;

      var tileLabel = "Number of " + config.Term;
      var visualization = d3plus.viz()
        .data(data)
        .title(config.Term + " by Subject")
        .title({
          "total": true
        })
        .container("#datasets-by-subject")
        .type("tree_map")
        .id("subject")
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
    }
  });
  $("#datasets-by-subject").append($("<a/>").addClass("button").attr("href", "/api/info/metrics/datasets/bySubject" + addAlias()).attr("type", "text/csv").text("CSV"));
}

//Retrieves any of the defined Make Data Count metrics
// (the graph itself is the same as other timeseries())
function makeDataCount(metric, config) {
  var color = config["colors"]["makeDataCount/" + metric + "/monthly"];
  $.ajax({
    url: dvserver + '/api/info/metrics/makeDataCount/' + metric + '/monthly' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {

      data = data.data;
      var yLabel = "Number of " + metric;
      var visualization = d3plus.viz()
        .data(data)
        .title("Make Data Count Metrics-" + metric)
        .container("#makedatacount-" + metric)
        .type("bar")
        .id("date")
        .x({
          "value": "date",
          "label": "Month"
        })
        .y({
          "range": [0, data[data.length - 1].count * 1.3],
          "value": "count",
          "label": yLabel
        })
        .color(function(d) {
          return color;
        })
        .resize(true)
        .draw();
    }
  });
  $("#makedatacount-" + metric).append($("<a/>").addClass("button").attr("href", "/api/info/metrics/makeDataCount/" + metric + "/monthly" + addAlias()).attr("type", "text/csv").text("CSV"));
}

//Multitimeseries - an array of objects with an additional key that we groupby
//Used for uniquedownloads
function multitimeseries(name, config, groupby) {
  var lcname = name.toLowerCase();
  var color = config["colors"][lcname + "/monthly"];
  $.ajax({
    url: dvserver + '/api/info/metrics/' + lcname + '/monthly' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {

      data = data.data;
      var yLabel = "Number of " + name;
      var visualization = d3plus.viz()
        .data(data)
        .title(name)
        .container("#" + lcname)
        .type("stacked")
        .id(groupby)
        .x({
          "value": "date",
          "label": "Month"
        })
        .y({
          "value": "count",
          "label": yLabel
        })
        .format(function(text){if((typeof text) == 'string') {text = text.replace(/["]+/g,'');} return text;})
        .mouse({
          "click": function(d) {
            window.open(dvserver + "/dataset.xhtml?persistentId=" + JSON.stringify(d.d3plus_data[groupby]).replace(/["]+/g,''), target="_blank");
          }
        })
        .resize(true)
        .draw();
    }
  });
  $("#" + lcname).append($("<a/>").addClass("button").attr("href", "/api/info/metrics/" + lcname + "/monthly" + addAlias()).attr("type", "text/csv").text("CSV"));
}


function filesByType(config) {
  var color = config["colors"]["files/byType"];
  $.ajax({
    url: dvserver + '/api/info/metrics/files/byType' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {
      data = data.data;
      var countVisualization = d3plus.viz()
        .data(data).dev(true)
        .title("File Count By Type")
        .container("#files-by-type-count")
        .type("bar")
        .id("contenttype")

        .x({
          "value": "contenttype",
          "label": "Content Type"
        })
        .y({
          "value": "count",
          "label": "File Count",
          "scale": "linear"
        })
        .order("count")
        .text("contenttype")
        .resize(true)
        .draw();
      var sizeVisualization = d3plus.viz()
        .data(data).dev(true)
        .title("File Size By Type")
        .container("#files-by-type-size")
        .type("bar")
        .id("contenttype")
        .x({
          "value": "contenttype",
          "label": "Content Type"
        })
        .y({
          "value": "size",
          "label": "Total Size By File Type",
          "scale": "log"
        })
        .order("size")
        .text("contenttype")
        .resize(true)
        .draw();
    }
  });
  $("#files-by-type-count").append($("<a/>").addClass("button").attr("href", "/api/info/metrics/files/byType" + addAlias()).attr("type", "text/csv").text("CSV"));
  $("#files-by-type-size").append($("<span/>").addClass("button").attr("title", "These metrics are included in the CSV for the 'File Count By Type'").text("CSV"));
}

//Shows the unique download count per PID
//The max number of elements (e.g. PIDs) to include can be controlled with the config.maxBars parameter
function uniqueDownloads(config) {
  var color = config["colors"]["downloads/unique"];
  $.ajax({
    url: dvserver + '/api/info/metrics/uniquedownloads' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {
      data = data.data;
      var title = "Unique Downloads per " + config.datasetTerm;
      var maxBars = config["maxBars"];
      if (typeof maxBars !== "undefined") {
        data = data.slice(0, maxBars);
        title = title + " (top " + maxBars + ")";
      }
      var visualization = d3plus.viz()
        .data(data)
        .title(title)
        .container("#uniquedownloads-by-pid")
        .type("bar")
        .id("pid")
        .x({
          "value": "pid",
          "label": config.datasetTerm + " Identifier"
        })
        .y({
          "value": "count",
          "label": "Unique Download Count",
          "scale": "linear"
        })
        //the API orders the results (so the slice gets the ones with the most counts), but the graph will reorder the without this
        .order("count")
        .text("pid")
        .format(function(text){if((typeof text) == 'string') {text = text.replace(/["]+/g,'');} return text;})
        .mouse({
          "click": function(d) {
            window.open(dvserver + "/dataset.xhtml?persistentId=" + JSON.stringify(d.pid).replace(/["]+/g,''), target="_blank");
          }
        })
        .resize(true)
        .draw();
    }
  });
  $("#uniquedownloads-by-pid").append($("<a/>").addClass("button").attr("href", "/api/info/metrics/uniquedownloads" + addAlias()).attr("type", "text/csv").text("CSV"));
}

//The max number of elements (e.g. PIDs) to include can be controlled with the config.maxBars parameter
function fileDownloads(config) {
  var color = config["colors"]["filedownloads/unique"];
  $.ajax({
    url: dvserver + '/api/info/metrics/filedownloads' + addAlias(),
    headers: { Accept: "application/json" },
    success: function(data) {
      data = data.data;
            var xName = "pid";
            if(data[0].pid.length==0) {
                    xName="id";
            }
      var title = "Downloads per DataFile";
      var maxBars = config["maxBars"];
      if (typeof maxBars !== "undefined") {
        data = data.slice(0, maxBars);
        title = title + " (top " + maxBars + ")";
      }
      var visualization = d3plus.viz()
        .data(data)
        .title(title)
        .container("#filedownloads-by-id")
        .type("bar")
        .id("id")
        .x({
          "value": xName,
          "label": config.datasetTerm + " Identifier"
        })
        .y({
          "value": "count",
          "label": "Download Count",
          "scale": "linear"
        })
        //the API orders the results (so the slice gets the ones with the most counts), but the graph will reorder the without this
        .order("count")
        .format(function(text){if((typeof text) == 'string') {text = text.replace(/["]+/g,'');} return text;})
        .text(xName)
        .mouse({
          "click": function(d) {
            if(!d.hasOwnProperty("pid") || d.pid.length==0) {
              window.open(dvserver + "/file.xhtml?fileId=" + JSON.stringify(d.id).replace(/["]+/g,''), target="_blank");
            } else {
              window.open(dvserver + "/file.xhtml?persistentId=" + JSON.stringify(d.pid).replace(/["]+/g,''), target="_blank");
            }
          }
        })
        .resize(true)
        .draw();
    }
  });
  $("#filedownloads-by-id").append($("<a/>").addClass("button").attr("href", "/api/info/metrics/filedownloads" + addAlias()).attr("type", "text/csv").text("CSV"));
}


//Add the parentAlias param at the end of URLs if alias is set
function addAlias() {
  return ((alias === null) ? '' : '?parentAlias=' + alias);
}

//Turn dataverse names into links to the metrics page using that dataverse as the parent
function updateNames(node) {
  node.name = "<a href='" + window.location + "?parentAlias=" + node.alias + "'>" + node.alias + "</a>";
  if (typeof node.children !== 'undefined') {
    node.children.forEach((childnode) => {
      updateNames(childnode);
    });
  }
}
