// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GLOBAL VARIABLES
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var isDev = false;

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("document").ready(function () {
    var thegraph = generateNewGraph();
    thegraph = bindLeftEvents(thegraph);
    thegraph = bindGraphEvents(thegraph);
    thegraph = bindRightEvents(thegraph);

    isDev = checkDevelopment();
    thegraph = refreshGraph(thegraph);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++