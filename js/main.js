// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GLOBAL VARIABLES
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var appVersion = "0.1.0";
var isDev = false;

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("document").ready(function () {
    $("#app-version").text(appVersion);

    var thegraph = generateNewGraph();
    thegraph = bindLeftEvents(thegraph);
    thegraph = bindGraphEvents(thegraph);
    thegraph = bindRightEvents(thegraph);

    isDev = checkDevelopment();
    thegraph = refreshGraph(thegraph);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++