// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GRAPH FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function generateNewGraph(dummy_eles = false) {
    let dummy = [ // list of graph elements to start with
        // nodes
        { data: { id: 'n0' } },
        { data: { id: 'n1' } },
        { data: { id: 'n2' } },

        // edges
        { data: { id: 'e0', source: 'n0', target: 'n1', weight: 1 }, classes: ["directed"] },
        { data: { id: 'e1', source: 'n0', target: 'n2', weight: 1 }, classes: ["directed"] },
        { data: { id: 'e2', source: 'n1', target: 'n2', weight: 1 }, classes: ["directed"] },
    ];
    
    return cytoscape({
        container: $('#graph'), // container to render in
        
        elements: dummy_eles ? dummy : [], // elements to render
        data: dummy_eles ? { numNodes: 3, numEdges: 3 } : { numNodes: 0, numEdges: 0 },
    
        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'label': 'data(id)',
                }
            },
            {
                selector: 'node:active',
                style: {
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
    thegraph.destroy();
    thegraph = generateNewGraph();

    console.log("new graph generated");
    refreshGraph(thegraph);

    return thegraph;
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// NODES AND EDGES FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function centerGraph(thegraph) {
    let selected = thegraph.$(":selected");
    selected.length > 0 ? thegraph.center(selected) : thegraph.center();

    console.log("centered graph on", selected.length > 0 ? "selected eles" : "all nodes");

    return thegraph;
};

function addNode(thegraph) {
    let newNode = { group: "nodes", data: { id: `n${thegraph.nodes().length}` } };
    thegraph.add(newNode);
    thegraph.$(`#${newNode.data.id}`).on("select", function (event) {
        $("#graph-properties-panel").addClass("d-none");
        $("#node-properties-panel").removeClass("d-none");
    }).on("unselect", function (event) {
        $("#graph-properties-panel").removeClass("d-none");
        $("#node-properties-panel").addClass("d-none");
    });
    
    thegraph.data("numNodes", thegraph.nodes().length);
    refreshGraph(thegraph);

    console.log("added node with id", newNode.data.id);
    // console.log(newNode);

    return thegraph;
};

function addEdge(thegraph) {
    // let source = $("#edge-source").val();
    // let target = $("#edge-target").val();
    // let weight = $("#edge-weight").val();

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
            if(i == j) continue;
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
};

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
            updateLayoutOptions("circle");
            options.radius = parseInt($("#input-circle-radius").val());
            // options.sweep = parseFloat($("#input-circle-sweep").val());
        break;

        case "grid":
            updateLayoutOptions("grid");
            options.condense = $("#input-grid-condense").is(":checked");
            options.spacingFactor = $("#input-grid-condense").is(":checked") ? 1.5 : 0;
            options.rows =     $("#input-grid-rows").val();
            options.cols =     $("#input-grid-cols").val();
        break;

        case "concentric":
            updateLayoutOptions("concentric");
            options.minNodeSpacing = 50;
        break;

        case "cose":
            updateLayoutOptions("cose");
        break;

        case "random":
            updateLayoutOptions("random");
            // no additional options
        break;

        default:
            // no additional options
        break;
    }
    
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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// READY FUNCTION
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).ready(function () {
    console.log("graph.js loaded");

    // setInterval(() => {
    //     console.log("selected nodes", thegraph.nodes(":selected"), "\nselected edges", thegraph.edges(":selected"));
    //     // console.log("selected edges", thegraph.edges(":selected"));
    // }, 1000);
});