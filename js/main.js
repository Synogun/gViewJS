// generates the graph and the cytoscape object
var cy = generateNewGraph(false);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/// FINISH CHECKING AND ADDING FIELD VALUES
function resetLayoutFields() {
    $("#select-graph-layout").val("circle");

    $("#input-circle-radius").val(100);

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

$("#btn-new-graph").click(   function () { cy = newGraph(cy); });

$("#btn-center-graph").click(function () { cy = centerGraph(cy); });
$("#btn-add-node").click(function () { cy = addNode(cy); });
$("#btn-add-edge").click(function () { cy = addEdge(cy); });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EVENT HANDLERS RIGHT COLUMN
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// LAYOUT PANEL

$("#select-graph-layout").change(function () {
    refreshGraphLayout(cy, $(this).val());
    console.log("changed layout to", $(this).val());
});

$(".circle-properties").change(function () {
    refreshGraphLayout(cy, "circle");
    console.log("changed circle layout properties");
});

$(".grid-properties").change(function () {
    refreshGraphLayout(cy, "grid");
    console.log("changed grid layout properties");
});

// NODES PANEL

// cy.nodes().on("select", function (event) {
//     $("#graph-properties-panel").addClass("d-none");
//     $("#node-properties-panel").removeClass("d-none");
// });

// cy.nodes().on("unselect", function (event) {
//     $("#graph-properties-panel").removeClass("d-none");
//     $("#node-properties-panel").addClass("d-none");
// });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// READY FUNCTION
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("document").ready(function () {

    // change this after deploying, to use the negation of the actual domain;
    if (!window.location.href.startsWith("https://synogun.github.io/gViewJS/")) $("#is-dev").removeClass("d-none");

    refreshGraph(cy);
    console.log("main.js loaded");
});
