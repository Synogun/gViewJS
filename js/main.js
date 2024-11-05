// generates the graph and the cytoscape object
var thegraph = generateNewGraph(false);

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

function checkWelcomeBanner(value=null) {
    if (value !== null) {
        localStorage.setItem("show-welcome-banner", value);
        return;
    }

    let show = localStorage.getItem("show-welcome-banner");
    if (show === null || show === "true") {
        localStorage.setItem("show-welcome-banner", true);
        $("#welcome-banner").removeClass("d-none");
        return;
    }
}

function checkNewsBanner(value=null) {
    if(value !== null) {
        localStorage.setItem("show-news-banner", value);
        return;
    }
    
    let show = localStorage.getItem("show-news-banner");
    if(show === null || show === "true") {
        localStorage.setItem("show-news-banner", true);
        $("#news-banner").removeClass("d-none");
        return;
    }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EVENT HANDLERS LEFT COLUMN
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#btn-new-graph").click(   function () { thegraph = newGraph(thegraph); });

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
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("document").ready(function () {

    // change this after deploying, to use the negation of the actual domain;
    if (!window.location.href.startsWith("https://synogun.github.io/gViewJS/")) $("#is-dev").removeClass("d-none");

    checkWelcomeBanner();
    checkNewsBanner();

    refreshGraph(thegraph);
    console.log("main.js loaded");
});
