// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GENERAL FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function generateNewGraph() {
    return cytoscape({
        container: $('#graph'), // container to render in
        
        elements: [], // elements to render
        data: { directed: false, numNodes: 0, numEdges: 0, removedNodes: [], removedEdges: [] },
    
        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'background-color': 'data(color)',
                    'shape': 'data(shape)',

                    'font-family': 'Fira Code, sans-serif',
                    'color': '#fff',
                    'text-outline-color': '#000',
                    'text-outline-width': 1,
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
                    'line-color': 'data(color)',
                    'curve-style': 'data(curve)',
                    'line-style': 'data(style)',

                    'target-arrow-color': 'data(color)',

                    'font-family': 'Fira Code, sans-serif',
                    'color': '#fff',
                    'text-outline-color': '#000',
                    'text-outline-width': 1,
                }
            },
            {
                selector: '.edge-label-weight',
                style: {
                    'label': 'data(weight)',
                }
            },
            {
                selector: '.edge-label-index',
                style: {
                    'label': 'data(index)',
                }
            },
            {
                selector: '.directed',
                style: {
                    'target-arrow-shape': 'data(arrowShape)',
                }
            },
            {
                selector: 'edge:active',
                style: {
                    'line-color': '#0169d9',
                    'target-arrow-color': '#0169d9',

                    'line-outline-width': 2.5,
                    'line-outline-color': '#0169d9',
                }
            },
            {
                selector: 'edge:selected',
                style: {
                    'line-color': 'data(color)',
                    'target-arrow-color': 'data(color)',

                    'line-outline-width': 2.5,
                    'line-outline-color': '#0169d9',
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

function centerGraph(thegraph) {
    let selected = thegraph.$(":selected");
    let fitPadding = 30;
    
    selected.length > 0 ?
        thegraph.fit(selected, fitPadding) :
        thegraph.fit(thegraph.nodes(), fitPadding);

    console.log("centered graph on", selected.length > 0 ? "selected eles" : "all nodes");
    return thegraph;
}

function refreshGraphLayout(thegraph, layout) {
    thegraph.layout(layout).run();

    // console.log("refreshed graph layout with", layout.name, "layout");
    return thegraph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// NODE FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function addNode(thegraph) {
    let newId = thegraph.nodes().length + thegraph.data("removedNodes").length;

    // TODO: add more properties
    // TODO: change this to default node properties from settings instead of hardcoding
    thegraph.add({
        group: "nodes",
        data: {
            id: `node-${newId}`,
            label: newId,
            color: '#999999',
            shape: "ellipse",
        }
    });
    
    thegraph.data("numNodes", thegraph.nodes().length);
    console.log(`added node with id 'node-${newId}' and label '${newId}'`);
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

    console.log("removed", selected.length, "node(s)");
    return thegraph;
}

function updateNodesProp(thegraph, prop, value) {
    let selected = thegraph.nodes(":selected");
    if (selected.length === 0) {
        console.log("Select at least one node");
        return thegraph;
    }

    // let prop = propId.split('-')[2];
    // let value = $(`#${propId}`).val();

    if (prop === "label") {
        let lval = value.split(";");
        selected.map((ele, i) => {
            if (lval[i].trim() === "") lval[i] = ele.id().split('-')[1];
            ele.data(prop, lval[i].trim());
        });
    } else {
        selected.map((ele) => {
            ele.data(prop, value);
        });
    }

    console.log("updated", selected.length, "node(s) with new", prop);
    return thegraph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EDGE FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function addEdge(thegraph, source=null, target=null) {
    if (source !== null && target !== null) {
        // TODO: add more properties
        // TODO: change this to default edge properties from settings instead of hardcoding
        thegraph.add({
            group: "edges",
            data: {
                id: `edge-${thegraph.edges().length + thegraph.data("removedEdges").length}`,
                source: source.id(),
                target: target.id(),
                weight: 1,
                index: thegraph.edges().length,

                // Styling
                label: "hidden",       // 0: hidden, 1: weight, 2: index
                color: "#cccccc",
                style: "solid",
                curve: "bezier",
                arrowShape: "triangle",
            },
            classes: [],
        });
        // if (thegraph.data("directed")) {
        //     thegraph.edges().last().addClass("directed");
        // }
        console.log("added edge with source", source.id(), "and target", target.id());
        thegraph.data("numEdges", thegraph.edges().length);

        return thegraph;
    }
    
    let selected = thegraph.nodes(":selected");
    if (selected.length < 2) {
        console.log("Select at least two nodes");
        return thegraph;
    }

    // TODO: Add option on settings to choose between sequential and all-to-all edges
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
            let source = selected[i];
            let target = selected[j];

            addEdge(thegraph, source, target);
        }
    }

    return thegraph;
}

function removeEdge(thegraph) {
    let selected = thegraph.edges(":selected");
    if (selected.length === 0) {
        console.log("Select at least one edge");
        return thegraph;
    }

    selected.map((ele) => {
        thegraph.data("removedEdges").push(ele);
        thegraph.remove(ele);
    });
    thegraph.data("numEdges", thegraph.edges().length);

    console.log("removed", selected.length, "edge(s)");
    return thegraph;
}

function updateEdgesProp(thegraph, prop, value) {
    let selected = thegraph.edges(":selected");
    if (selected.length === 0) {
        console.log("Select at least one edge");
        return thegraph;
    }

    if (prop === "weight" && value.trim() === "") value = 1;
    if (prop === "label") {
        selected.map((ele) => {
            ele.removeClass(`edge-label-${ele.data("label")}`);
            ele.data("label", value);
            ele.addClass(`edge-label-${value}`);
        });
    } else {
        selected.map((ele) => {
            ele.data(prop, value);
        });
    }

    console.log("updated", selected.length, "edge(s) with new", prop);
    return thegraph;
}