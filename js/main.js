// generates the graph and the cytoscape object
var isDev = false;
var thegraph = generateNewGraph();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function checkDevelopment() {
    if (window.location.href.startsWith("https://synogun.github.io/gViewJS/")) return;

    isDev = true;
    $("#is-dev").removeClass("d-none");
    $("title").text("gViewJS - Development");
}

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
    $("#input-node-color").val("#000000");
    $("#input-node-shape").val("ellipse");
}

function resetFields() {
    resetLayoutFields();
    resetNodeFields();
}

function updateNodeFields() {
    let selected = thegraph.$("node:selected");
    
    let labels = selected.map((ele) => ele.data("label") ? ele.data("label") : ele.id()).join("; ");
    $("textarea#input-node-label").val(labels);

    let countColors = {};
    let colorToDisplay = { color: "#000000", count: 0 };
    selected.map((ele) => ele.data("color")).forEach((color) => {
        if (countColors[color]) countColors[color]++;
        else countColors[color] = 1;

        if (countColors[color] > colorToDisplay.count) {
            colorToDisplay.color = color;
            colorToDisplay.count = countColors[color];
        }
    });
    $("#input-node-color").val(colorToDisplay.color);

    let countShapes = {};
    let shapeToDisplay = { shape: "ellipse", count: 0 };
    selected.map((ele) => ele.data("shape")).forEach((shape) => {
        if (countShapes[shape]) countShapes[shape]++;
        else countShapes[shape] = 1;

        if (countShapes[shape] > shapeToDisplay.count) {
            shapeToDisplay.shape = shape;
            shapeToDisplay.count = countShapes[shape];
        }
    });
    $("#select-node-shape").val(shapeToDisplay.shape);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GENERAL EVENT HANDLERS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

thegraph.on('select', 'node', function (evt) {
    $("#graph-properties-panel").addClass("d-none");
    $("#layout-properties-panel").addClass("d-none");
    $("#node-properties-panel").removeClass("d-none");

    updateNodeFields();
    console.log("selected node", evt.target.id());
}).on('unselect', 'node', function (evt) {
    if (thegraph.$(':selected').length === 0) {
        $("#node-properties-panel").addClass("d-none");
        resetNodeFields();

        $("#graph-properties-panel").removeClass("d-none");
        $("#layout-properties-panel").removeClass("d-none");
    }

    updateNodeFields();
    console.log("unselected node", evt.target.id());
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EVENT HANDLERS LEFT COLUMN
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#btn-new-graph").click(    function () { thegraph = newGraph(thegraph);     } );

$("#btn-arrange-graph").click(function () { thegraph = refreshGraphLayout(thegraph); } );
$("#btn-center-graph").click( function () { thegraph = centerGraph(thegraph);  } );
$("#btn-add-node").click(     function () { thegraph = addNode(thegraph);      } );
$("#btn-add-edge").click(     function () { thegraph = addEdge(thegraph);      } );

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EVENT HANDLERS RIGHT COLUMN
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// LAYOUT PANEL

$("#select-graph-layout, .circle-properties, .grid-properties").change(function () {
    if(this.id === "select-graph-layout") {
        thegraph = refreshGraphLayout(thegraph, $(this).val());
    } else {
        thegraph = refreshGraphLayout(thegraph, $("#select-graph-layout").val());
    }

    console.log("updated graph layout");
});

// NODES PANEL

$("#input-node-label, #input-node-color, #select-node-shape").change(function (evt) {
    updateNodeProps(thegraph, evt.target.id);
    console.log(`changed node(s) ${evt.target.id} to`, $(this).val());
});

$("#btn-delete-node").click(function () { thegraph = removeNode(thegraph); });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// READY FUNCTION
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("document").ready(function () {

    checkDevelopment();

    refreshGraph(thegraph);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++