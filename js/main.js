// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GLOBAL VARIABLES
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var appVersion = "0.1.0";
var isDev = false;
var thegraph = generateNewGraph();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("document").ready(function () {
    $("#app-version").text(appVersion);

    thegraph = bindLeftEvents(thegraph);
    thegraph = bindGraphEvents(thegraph);
    thegraph = bindRightEvents(thegraph);

    isDev = checkDevelopment();
    thegraph = refreshGraph(thegraph);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++