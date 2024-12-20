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
    if (eles.length === 0) { // no elements
        return null;
    }
    let firstEleData = eles.eq(0).data(prop);
    if (firstEleData === undefined || firstEleData === null) { // property not found
        return null;
    }
    if (eles.length === 1) { // only one element
        return firstEleData;
    }

    let count = {};
    let mode = { prop: firstEleData, count: 0 };

    // count the occurrences of each property value
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

function switchPanel(panel) {
    $('.panel').addClass("d-none");
    
    switch (panel) {
        case "graph":
            $(`#graph-properties-panel`).removeClass("d-none");
        break;

        case "node":
            $(`#node-properties-panel`).removeClass("d-none");
        break;

        case "edge":
            $(`#edge-properties-panel`).removeClass("d-none");
        break;

        default:
            console.log("switchPanel: invalid panel", panel);
        break;
    }
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

function switchLayoutPanel(subpanel) {
    $(".layout-properties").addClass("d-none");
    $(`#${subpanel}-layout-properties`).removeClass("d-none");
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
        return false;
    }
    
    setNodeFields({
        label: selected.map((ele) => ele.data("label") !== undefined ? ele.data("label") : ele.id()).join(" ; "),
        color: findMostCommonPropertyValue("color", selected) || "#000000",
        shape: findMostCommonPropertyValue("shape", selected) || "ellipse"
    });

    return true;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EDGE UI FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * Retrieves the values from the edge input fields.
 *
 * @returns {Object} An object containing the label, color, style, and curve of the edge.
 * @returns {number} return.weight - The weight of the selected edge(s).
 * @returns {string} return.label - The label of the edge.
 * @returns {string} return.color - The color of the edge.
 * @returns {string} return.style - The style of the edge.
 * @returns {string} return.curve - The curve type of the edge.
 */
function getEdgeFields() {
    return {
        weight: $("#input-edge-weight").val(),
        label: $(".radio-edge-label:checked").val(),
        color: $("#input-edge-color").val(),
        style: $(".radio-edge-style:checked").val(),
        curve: $("#select-edge-curve").val()
    };
}

/**
 * Sets the edge fields in the UI based on the provided properties.
 *
 * @param {Object} props - The properties to set the edge fields.
 * @param {number} props.weight - The weight of the edge to be set.
 * @param {string} props.label - The label of the edge to be selected.
 * @param {string} props.color - The color of the edge to be set.
 * @param {string} props.style - The style of the edge to be selected.
 * @param {string} props.curve - The curve type of the edge to be set.
 */
function setEdgeFields(props) {
    $("#input-edge-weight").val(props.weight);
    $(`.radio-edge-label[value="${props.label}"]`).prop("checked", true);
    $("#input-edge-color").val(props.color);
    $(`.radio-edge-style[value="${props.style}"]`).prop("checked", true);
    $("#select-edge-curve").val(props.curve);
}

/**
 * Resets the edge fields in the UI to their default values.
 * 
 * This function sets the following default values:
 * - Edge weight: 1
 * - Edge label visibility: hidden
 * - Edge color: black (#000000)
 * - Edge style: solid
 * - Edge curve: bezier
 */
function clearEdgeFields() {
    // TODO: Use default values from settings in the future instead of hardcoding
    $("#input-edge-weight").val(1);
    $("#radio-edge-label-1").prop("checked", true);
    $("#input-edge-color").val("#000000");
    $("#radio-edge-style-1").prop("checked", true);
    $("#select-edge-curve").val("bezier");
}

function updateEdgeFields(thegraph) {
    let selected = thegraph.edges(":selected");

    if (selected.length === 0) {
        clearEdgeFields();
        return false;
    }

    let val = {
        weight: findMostCommonPropertyValue("weight", selected) || 1,
        label:  findMostCommonPropertyValue("label", selected)  || "hidden",
        color:  findMostCommonPropertyValue("color", selected)  || "#000000",
        style:  findMostCommonPropertyValue("style", selected)  || "solid",
        curve:  findMostCommonPropertyValue("curve", selected)  || "bezier"
    };
    setEdgeFields(val);

    return true;
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
    // NODE EVENTS
    thegraph.on('select', 'node', function (evt) {
        updateNodeFields(thegraph);
        switchPanel("node");
        console.log("selected node", evt.target.id());
    });

    thegraph.on('unselect', 'node', function (evt) {
        updateNodeFields(thegraph);
        if (thegraph.nodes(':selected').length === 0) {
            switchPanel("graph");
        }
        console.log("unselected node", evt.target.id());
    });

    // EDGE EVENTS
    thegraph.on('select', 'edge', function (evt) {
        updateEdgeFields(thegraph);
        switchPanel("edge");
        console.log("selected edge", evt.target.id());
    });

    thegraph.on('unselect', 'edge', function (evt) {
        updateEdgeFields(thegraph);
        
        if (thegraph.edges(':selected').length === 0) {
            switchPanel("graph");
        }
        console.log("unselected edge", evt.target.id());
    });

    return thegraph;
}

function bindRightEvents(thegraph) {
    // LAYOUT PANEL
    $("#select-graph-layout, .circle-properties, .grid-properties").change(function () {
        let layout = getLayoutFields();
        switchLayoutPanel(layout.name);

        thegraph = refreshGraph(thegraph);
        console.log("updated graph layout", layout.name);
    });

    // NODES PANEL
    $("#input-node-label, #input-node-color, #select-node-shape").change(function (evt) {
        let val = getNodeFields();
        let prop = evt.target.id.split('-')[2];
        
        thegraph = updateNodesProp(thegraph, prop, val[prop]);
        updateNodeFields(thegraph);
        console.log(`changed node(s) ${prop} to`, $(this).val());
    });

    $("#btn-delete-node").click(function () {
        thegraph = removeNode(thegraph); 
        thegraph = refreshGraph(thegraph);
        
        updateNodeFields(thegraph);
        if (thegraph.nodes(':selected').length === 0) {
            switchPanel("graph");
        }
    });

    // EDGES PANEL
    $("#input-edge-weight, .radio-edge-label, #input-edge-color, .radio-edge-style, #select-edge-curve").change(function (evt) {
        let val = getEdgeFields();
        let prop = evt.target.id.split('-')[2];
        
        thegraph = updateEdgesProp(thegraph, prop, val[prop]);
        updateEdgeFields(thegraph);
        console.log(`changed edge(s) ${prop} to`, $(this).val());
    });

    $("#btn-delete-edge").click(function () {
        thegraph = removeEdge(thegraph); 
        thegraph = refreshGraph(thegraph);
        
        updateEdgeFields(thegraph);
        if (thegraph.edges(':selected').length === 0) {
            switchPanel("graph");
        }
    });

    return thegraph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++