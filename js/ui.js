// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GENERAL FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * Checks if the current environment is development or production.
 * 
 * This function determines if the current URL starts with "https://synogun.github.io/gViewJS/".
 * If it does, it returns false indicating a production environment.
 * Otherwise, it modifies the DOM to indicate a development environment and returns true.
 * 
 * @returns {boolean} - Returns true if the environment is development, false if it is production.
 */
function checkDevelopment() {
    if (window.location.href.startsWith("https://synogun.github.io/gViewJS/")) {
        return false;
    }

    $("#is-dev").removeClass("d-none");
    $("title").text("gViewJS - Development");
    return true;
}

/**
 * Finds the most common value of a specified property among a collection of elements.
 *
 * @param {string} prop - The property name to check.
 * @param {Array} eles - The collection of elements to search through.
 * @returns {*} - The most common property value, or null if no elements are provided or the property is not found.
 */
function findMostCommonPropertyValue(prop, eles) {
    // TODO: Use default value from settings in the future instead of null
    if (eles.length === 0) {
        return null;
    }
    let firstEleData = eles.eq(0).data(prop);
    if (firstEleData === undefined || firstEleData === null) {
        return null;
    }
    if (eles.length === 1) {
        return firstEleData;
    }

    let count = {};
    let mode = { prop: firstEleData, count: 0 };

    eles.forEach((ele) => {
        let val = ele.data(prop);
        if (count[val]) {
            count[val]++;
        } else {
            count[val] = 1;
        }

        if (count[val] > mode.count) {
            mode.prop = val;
            mode.count = count[val];
        }
    });

    return mode.prop;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GRAPH UI FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function refreshGraphFields(thegraph) {
    $("#input-node-count").val(thegraph.data("numNodes") + " nodes");
    $("#input-edge-count").val(thegraph.data("numEdges") + " edges");
}

function refreshGraph(thegraph) {
    refreshGraphFields(thegraph);

    let layout = getLayoutFields();
    thegraph = refreshGraphLayout(thegraph, layout);

    return thegraph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// LAYOUT UI FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function switchLayoutPanel(panel) {
    $(".layout-properties").addClass("d-none");
    $(`#${panel}-layout-properties`).removeClass("d-none");
}

function getLayoutFields() {
    let name = $("#select-graph-layout").val();
    let layout = {
        name: name,
        
        animate: true,
        animationDuration: 500,
        animationEasing: "ease-in-out",
    };

    switch (name) {
        case "circle":
            layout.radius = parseInt($("#input-circle-radius").val());
        break;

        case "grid":
            layout.rows = parseInt($("#input-grid-rows").val());
            layout.cols = parseInt($("#input-grid-cols").val());
            layout.condense = $("#input-grid-condensed").is(":checked");
            layout.spacingFactor = $("#input-grid-condensed").is(":checked") ? 1.5 : 0;
        break;

        case "concentric":
            layout.minNodeSpacing = 50;
        break;
        
        default:
            // do nothing
        break;
    }

    return layout;
}

function clearLayoutFields() {
    // TODO: Use default values from settings in the future instead of hardcoding

    // default layout
    $("#select-graph-layout").val("circle");

    // default circle layout
    $("#input-circle-radius").val(100);

    // default grid layout
    $("#input-grid-rows").val(3);
    $("#input-grid-cols").val(3);
    $("#input-grid-condense").val(false);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// NODE UI FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * Retrieves the values from the node input fields.
 *
 * @returns {Object} An object containing the label, color, and shape of the node.
 * @returns {string} return.label - The label of the node.
 * @returns {string} return.color - The color of the node.
 * @returns {string} return.shape - The shape of the node.
 */
function getNodeFields() {
    return {
        label: $("#input-node-label").val(),
        color: $("#input-node-color").val(),
        shape: $("#select-node-shape").val()
    };
}

/**
 * Sets the values of the node input fields based on the provided properties.
 *
 * @param {Object} props - The properties of the node.
 * @param {string} props.label - The label of the node.
 * @param {string} props.color - The color of the node.
 * @param {string} props.shape - The shape of the node.
 */
function setNodeFields(props) {
    $("#input-node-label").val(props.label);
    $("#input-node-color").val(props.color);
    $("#select-node-shape").val(props.shape);
}

/**
 * Clears the input fields for node properties by setting them to default values.
 * 
 * This function resets the following fields:
 * - Node label: an empty string
 * - Node color: black ("#000000")
 * - Node shape: ellipse
 */
function clearNodeFields() {
    // TODO: Use default values from settings in the future instead of hardcoding
    $("#input-node-label").val("");
    $("#input-node-color").val("#000000");
    $("#input-node-shape").val("ellipse");
}

function updateNodeFields(thegraph) {
    let selected = thegraph.nodes(":selected");

    if (selected.length === 0) {
        clearNodeFields();
        return;
    }
    
    setNodeFields({
        label: selected.map((ele) => ele.data("label") !== undefined ? ele.data("label") : ele.id()).join("; "),
        color: findMostCommonPropertyValue("color", selected) || "#000000",
        shape: findMostCommonPropertyValue("shape", selected) || "ellipse"
    });

    // $("textarea#input-node-label").val(labels);
    
    // let colorToDisplay = findPropMode("color", selected);
    // $("#input-node-color").val(colorToDisplay);
    
    // let shapeToDisplay = findPropMode("shape", selected);
    // $("#select-node-shape").val(shapeToDisplay);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EVENT HANDLERS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function bindLeftEvents(thegraph) {
    $("#btn-new-graph").click(function () { 
        thegraph = refreshGraph(thegraph);
        thegraph = newGraph(thegraph);
    });

    $("#btn-arrange-graph").click(function () { 
        thegraph = refreshGraph(thegraph); 
    });

    $("#btn-center-graph").click(function () { 
        thegraph = centerGraph(thegraph);
    });

    $("#btn-add-node").click(function () { 
        thegraph = addNode(thegraph);
        thegraph = refreshGraph(thegraph);
    });

    $("#btn-add-edge").click(function () { 
        thegraph = addEdge(thegraph); 
        thegraph = refreshGraph(thegraph);
    });

    return thegraph;
}

function bindGraphEvents(thegraph) {
    thegraph.on('select', 'node', function (evt) {
        $("#graph-properties-panel").addClass("d-none");
        $("#layout-properties-panel").addClass("d-none");
        $("#node-properties-panel").removeClass("d-none");

        updateNodeFields(thegraph);
        console.log("selected node", evt.target.id());
    });

    thegraph.on('unselect', 'node', function (evt) {
        if (thegraph.nodes(':selected').length === 0) {
            $("#node-properties-panel").addClass("d-none");
            clearNodeFields();

            $("#graph-properties-panel").removeClass("d-none");
            $("#layout-properties-panel").removeClass("d-none");
        }

        updateNodeFields(thegraph);
        console.log("unselected node", evt.target.id());
    });

    return thegraph;
}

function bindRightEvents(thegraph) {
    // LAYOUT PANEL
    $("#select-graph-layout, .circle-properties, .grid-properties").change(function () {
        // if (this.id === "select-graph-layout") {
        //     thegraph = refreshGraphLayout(thegraph, layout);
        // } else {
        //     thegraph = refreshGraphLayout(thegraph, $("#select-graph-layout").val());
        // }
        
        let layout = getLayoutFields();
        switchLayoutPanel(layout.name);

        thegraph = refreshGraph(thegraph);
        console.log("updated graph layout", layout.name);
    });

    // NODES PANEL
    $("#input-node-label, #input-node-color, #select-node-shape").change(function (evt) {
        updateNodesProp(thegraph, evt.target.id);
        console.log(`changed node(s) ${evt.target.id} to`, $(this).val());
    });

    $("#btn-delete-node").click(function () { thegraph = removeNode(thegraph); });

    return thegraph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++