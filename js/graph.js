// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GRAPH FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function generateNewGraph() {
    return cytoscape({
        container: $('#graph'), // container to render in
        
        elements: [], // elements to render
        data: { numNodes: 0, numEdges: 0, removedNodes: [], removedEdges: [] },
    
        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'background-color': 'data(color)',
                    'shape': 'data(shape)',

                    'font-family': 'Fira Code, sans-serif',
                    'text-halign': 'center',
                    'text-valign': 'center',
                }
            },
            {
                selector: 'node:active',
                style: {
                    'background-color': '#0169d9',
                    'border-color': '#0169d9',
                    'border-width': 2,
                }
            },
            {
                selector: 'node:selected',
                style: {
                    'background-color': 'data(color)',
                    'border-color': '#0169d9',
                    'border-width': 2,
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'curve-style': 'bezier',

                    'font-family': 'Fira Code, sans-serif',
                    'color': '#fff',
                    'text-outline-color': '#000',
                    'text-outline-width': 1,
                }
            },
            {
                selector: 'edge[weight > 1]',
                style: {
                    'label': 'data(weight)',
                }
            },
            {
                selector: '.directed',
                style: {
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                }
            },
            {
                selector: 'edge:active',
                style: {
                    'line-outline-color': '#0169d9',
                    'line-outline-width': 2,
                    // 'target-arrow-color': '#0169d9',
                    // 'target-arrow-shape': 'triangle',
                }
            },
            {
                selector: 'edge:selected',
                style: {
                    'line-color': '#0169d9',
                    'target-arrow-color': '#0169d9',
                }
            },
        ],
    
        // minZoom: 0.4,
        maxZoom: 5,
    
        layout: {
            name: 'circle',
            radius: 100,
        }
    
    });
}

function newGraph(thegraph) {
    window.location.reload();
}

function arrangeGraph(thegraph) {
    let selected = thegraph.$(":selected");
    selected.length > 0 ? selected.layout().run() : thegraph.layout().run();

    console.log("arranged graph");
    return thegraph;
}

function centerGraph(thegraph) {
    let selected = thegraph.$(":selected");
    selected.length > 0 ? thegraph.center(selected) : thegraph.center();

    console.log("centered graph on", selected.length > 0 ? "selected eles" : "all nodes");
    return thegraph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// NODES AND EDGES FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function addNode(thegraph) {
    let newId = `n${thegraph.nodes().length + thegraph.data("removedNodes").length}`;
    let newNode = { 
        group: "nodes",
        data: { 
            id: newId,
            label: newId,
            color: '#999999',
            shape: "ellipse",
        }
    };

    thegraph.add(newNode);
    
    thegraph.data("numNodes", thegraph.nodes().length);
    refreshGraph(thegraph);

    console.log("added node with id", newNode.data.id);
    // console.log(newNode);

    return thegraph;
}

function removeNode(thegraph) {
    let selected = thegraph.nodes(":selected");
    if (selected.length === 0) {
        console.log("Select at least one node");
        return thegraph;
    }

    selected.map((ele) => {
        thegraph.data("removedNodes").push(ele);
        thegraph.remove(ele);
    });
    thegraph.data("numNodes", thegraph.nodes().length);
    thegraph.data("numEdges", thegraph.edges().length);

    refreshGraph(thegraph);

    console.log("removed", selected.length, "node(s)");
    return thegraph;
}

function addEdge(thegraph) {
    let selected = thegraph.nodes(":selected");
    if (selected.length < 2) {
        console.log("Select at least two nodes");
        return thegraph;
    }

    // sequential edges
    // for(let i = 0; i < selected.length; i++) {
    //     let source = selected[i].id();
    //     let target = selected[(i + 1) % selected.length].id();
        
    //     let newEdge = { group: "edges", data: { id: `e${thegraph.edges().length}`, source: source, target: target, weight: 1 } };
    //     thegraph.add(newEdge);

    //     console.log("added edge with source", source, "and target", target);
    //     console.log(newEdge);
    // }

    // all-to-all edges
    for(let i = 0; i < selected.length; i++) {
        for(let j = i; j < selected.length; j++) {
            if(i === j) continue;
            let source = selected[i].id();
            let target = selected[j].id();
            
            let newEdge = { group: "edges", data: { id: `e${thegraph.edges().length}`, source: source, target: target, weight: 1 } };
            thegraph.add(newEdge);
    
            console.log("added edge with source", source, "and target", target);
            // console.log(newEdge);

        }
    }

    thegraph.data("numEdges", thegraph.edges().length);
    refreshGraph(thegraph);

    return thegraph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// REFRESH FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function updateLayoutOptions(layoutName) {
    $(".layout-properties").addClass("d-none");
    $(`#${layoutName}-layout-properties`).removeClass("d-none");
}

function refreshGraphLayout(thegraph, layout = null) {
    let options = {
        name: layout === null ? $("#select-graph-layout").val() : layout,
        
        animate: true,
        animationDuration: 500,
        animationEasing: 'ease-in-out',
    };

    // get correct options based on the selected layout
    switch(options.name) {
        case "circle":
            options.radius = parseInt($("#input-circle-radius").val());
            // options.sweep = parseFloat($("#input-circle-sweep").val());
            updateLayoutOptions("circle");
        break;

        case "grid":
            options.condense =      $("#input-grid-condensed").is(":checked");
            options.spacingFactor = $("#input-grid-condensed").is(":checked") ? 1.5 : 0;
            options.rows =          $("#input-grid-rows").val();
            options.cols =          $("#input-grid-cols").val();
            updateLayoutOptions("grid");
        break;

        case "concentric":
            options.minNodeSpacing = 50;
            updateLayoutOptions("concentric");
        break;

        case "cose":
            updateLayoutOptions("cose");
        break;

        case "preset":
            // no additional options
            updateLayoutOptions("preset");
        break;

        case "random":
            // no additional options
            updateLayoutOptions("random");
        break;

        default:
            // no additional options
        break;
    };
    
    thegraph.layout(options).run();
    console.log("refreshed graph layout with", options.name, "layout");

    return thegraph;
}

function refreshGraphProps(thegraph) {
    $("#input-node-count").val(thegraph.data("numNodes") + " nodes");
    $("#input-edge-count").val(thegraph.data("numEdges") + " edges");
}

function refreshGraph(thegraph) {
    refreshGraphLayout(thegraph);
    refreshGraphProps(thegraph);

    return thegraph;
}

function updateNodeLabels(thegraph) {
    let selected = thegraph.nodes(":selected");
    if (selected.length == 0) {
        console.log("Select at least one node");
        return thegraph;
    }

    let labels = $("#input-node-label").val().split(";");
    selected.map((ele, i) => {
        ele.data("label", labels[i].trim());
    });

    refreshGraph(thegraph);
    console.log("updated", selected.length, "node(s) with new labels");

    return thegraph;
}

function updateNodeColors(thegraph) {
    let selected = thegraph.nodes(":selected");
    if (selected.length == 0) {
        console.log("Select at least one node");
        return thegraph;
    }

    let color = $("#input-node-color").val();
    selected.map((ele) => {
        ele.data("color", color);
    });

    refreshGraph(thegraph);
    console.log("updated", selected.length, "node(s) with new color");

    return thegraph;
}

function updateNodeShapes(thegraph) {
    let selected = thegraph.nodes(":selected");
    if (selected.length == 0) {
        console.log("Select at least one node");
        return thegraph;
    }

    let shape = $("#select-node-shape").val();
    selected.map((ele) => {
        ele.data("shape", shape);
    });

    refreshGraph(thegraph);
    console.log("updated", selected.length, "node(s) with new shape");

    return thegraph;
}

function updateNodeProps(thegraph, propId) {
    let selected = thegraph.nodes(":selected");
    if (selected.length == 0) {
        console.log("Select at least one node");
        return thegraph;
    }

    let prop = propId.split('-')[2];
    switch(prop) {
        case "label":
            return updateNodeLabels(thegraph);

        case "color":
            return updateNodeColors(thegraph);

        case "shape":
            return updateNodeShapes(thegraph);

        default:
            console.log("Invalid property");
    };
        
    return thegraph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// READY FUNCTION
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).ready(function () {

    // setInterval(() => {
    //     console.log("selected nodes", thegraph.nodes(":selected"), "\nselected edges", thegraph.edges(":selected"));
    //     // console.log("selected edges", thegraph.edges(":selected"));
    // }, 1000);
});