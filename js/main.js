// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// VERSION CONTROL
//
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 0.1.0 - 2024-10-28 - Initial version
// 0.2.0 - Node Manipulation
// 0.3.0 - Edge Manipulation

var appVersion = "0.3.0";

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