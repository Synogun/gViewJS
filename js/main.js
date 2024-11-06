// generates the graph and the cytoscape object
var thegraph = generateNewGraph(true);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function checkDevelopment() {
    if (window.location.href.startsWith("https://synogun.github.io/gViewJS/")) return;

    $("#is-dev").removeClass("d-none");
    $("title").text("gViewJS - Development");
}

/// FINISH CHECKING AND ADDING FIELD VALUES
function resetLayoutFields() {
    // default layout
    $("#select-graph-layout").val("circle");

    // default circle layout
    $("#input-circle-radius").val(100);

    // default grid layout
    $("#input-grid-rows").val(3);
    $("#input-grid-cols").val(3);
    $("#input-grid-condense").val(false);
}

function resetNodeFields() {
    $("#input-node-label").val("");
    $("#input-node-color").val("#0169d9");
    $("#input-node-shape").val("ellipse");
}

function resetFields() {
    resetLayoutFields();
    resetNodeFields();
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EVENT HANDLERS LEFT COLUMN
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#btn-new-graph").click(function () { thegraph = newGraph(thegraph); });

$("#btn-center-graph").click(function () { thegraph = centerGraph(thegraph); });
$("#btn-add-node").click(function () { thegraph = addNode(thegraph); });
$("#btn-add-edge").click(function () { thegraph = addEdge(thegraph); });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EVENT HANDLERS RIGHT COLUMN
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// LAYOUT PANEL

$("#select-graph-layout").change(function () {
    refreshGraphLayout(thegraph, $(this).val());
    console.log("changed layout to", $(this).val());
});

$(".circle-properties").change(function () {
    refreshGraphLayout(thegraph, "circle");
    console.log("changed circle layout properties");
});

$(".grid-properties").change(function () {
    refreshGraphLayout(thegraph, "grid");
    console.log("changed grid layout properties");
});

// NODES PANEL

// thegraph.nodes().on("select", function (event) {
//     $("#graph-properties-panel").addClass("d-none");
//     $("#node-properties-panel").removeClass("d-none");
// });

// thegraph.nodes().on("unselect", function (event) {
//     $("#graph-properties-panel").removeClass("d-none");
//     $("#node-properties-panel").addClass("d-none");
// });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// READY FUNCTION
// MAIN PIPELINE
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("document").ready(function () {

    checkDevelopment();

    refreshGraph(thegraph);
    console.log("main.js loaded");
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++