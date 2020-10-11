//const { token } = require("morgan");

// Set-up
let current_note = ['C',''];
let root_node;
let current_node;
let edgeMode = false;

var locales = {
    music: {
        edit: 'Edit',
        del: 'Delete selected note',
        back: 'Back',
        addNode: 'Add Node',
        addEdge: 'Add Edge',
        editNode: 'Edit Node',
        editEdge: 'Edit Edge',
        addDescription: 'Click in an empty space to place a new node.',
        edgeDescription: 'Click on a node and drag the edge to another node to connect them.',
        editEdgeDescription: 'Click on the control points and drag them to a node to connect to it.',
        createEdgeError: 'Cannot link edges to a cluster.',
        deleteClusterError: 'Clusters cannot be deleted.',
        editClusterError: 'Clusters cannot be edited.'
    }
}

var default_instrument = new Instrument("sawtooth", 0.01, 0.05, 0.001, 1, 1, new Filter(1000, "lowpass"), new Reverb(1, 0.3), new Delay(0.1, 0.5, 0.5));

// create an array with nodes
// mode can be "Full Random" = randomly chooses
var nodes = new vis.DataSet([
    {id: 0, label: 'Bb4', interval: 500, timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Full Random"},
    {id: 1, label: 'D4', interval: 500, timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Full Random"},
    {id: 2, label: 'F4', interval: 500, timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Full Random"},
    {id: 3, label: 'A4', interval: 500, timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Full Random"},
    {id: 4, label: 'G4', interval: 500, timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Full Random"}
]);

// create an array with edges
var edges = new vis.DataSet([
    {from: 0, to: 2, interval: 1000},
    {from: 0, to: 1, interval: 1000},
    {from: 1, to: 3, interval: 1000},
    {from: 1, to: 4, interval: 1000},
    {from: 2, to: 4, interval: 1000},
    {from: 2, to: 3, interval: 1000}
]);

// node functions set-up 
function selectNote(note) {
    switch (note) {
        case 'sharp':
            current_note[1] = "#";
            console.log(current_note);
            break;
        case 'flat':
            current_note[1] = "b";
            console.log(current_note);
            break;
        case 'natural':
            current_note[1] = "";
            console.log(current_note);
            break;
        default:
            current_note[0] = note;
            console.log(current_note);
            break;
    }
}
function addNodeSubmit() {
    network.enableEditMode();
    if (current_note[0] != '') {
        nodeList = nodes.get({fields: ['id', 'label']});
        nodes.add([
            {id: nodeList.length+1, label: current_note[0] + current_note[1]}
        ]);
    }
}
function toggleAddNode(bool) {
    if (bool) {
        network.enableEditMode();
        network.addNodeMode();
    }
    else {
        network.disableEditMode();
    }
}
function toggleAddEdge(bool) {
    if (bool) {
        edgeMode = true;
        network.enableEditMode();
        network.addEdgeMode();
    }
    else {
        edgeMode = false;
        network.disableEditMode();
    }
}
function renderNodesDropdown() {
    nodeList = nodes.get({fields: ['id', 'label']});
    edgeList = edges.get({fields:["from", "to"]});
    for (node in nodeList) {
        var dropdown = document.createElement("a");                
        dropdown.innerHTML = node;  
        dropdown.classList.add("dropdown-item"); 
        document.getElementById("fromDropdown").appendChild(dropdown);
    }
}

function triggerNode(node) {
    clearTimeout(node.timer);
    node.instrument.press_note(node.label, node.id);
    node.timer = setTimeout(() => { node.instrument.release_note(node.label, node.id) }, node.interval);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Traversing to play music
async function playPressed() {
    await Tone.start();
    network.disableEditMode();
    nodeList = nodes.get({fields: ['id', 'label', 'interval', 'timer', 'instrument']});
    edgeList = edges.get({fields:["from", "to"]});
    var randomRoot = nodeList[Math.floor(Math.random()*nodeList.length)];
    current_node = randomRoot.id;
    console.log(randomRoot);
    while (true) {
        current_node = getNextNode(current_node);
        console.log(nodeList[current_node]);
        triggerNode(nodeList[current_node]);
        await sleep(200);
    }
}

function getNextNode(node_id) {
    let neighboring_nodes = network.getConnectedNodes(node_id);
    // Add play sound function here
    return neighboring_nodes[Math.floor(Math.random()*neighboring_nodes.length)];
}

// create a network
var container = document.getElementById('musicNetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    interaction: { hover: true },
    interaction: {
        navigationButtons: true,
        keyboard: true
    },
    manipulation: {
        enabled: false,
        addNode: function(nodeData,callback) {
            current_note = prompt("Please enter note");
            if (current_note != "") {
                console.log(nodeData);
                nodeData.label = current_note;
                callback(nodeData);
            }
        },
        addEdge: function(edgeData,callback) {
            edgeList = edges.get({fields: ['from', 'to']});
            if ({from: edgeData.from, to: edgeData.to})
            if (edgeData.from === edgeData.to) {
                var r = confirm("Do you want to connect the node to itself?");
                if (r === true) {
                callback(edgeData);
                }
            }
            else {
                callback(edgeData);
            }
            if (edgeMode) {
                network.addEdgeMode();
            }
        },
        addNode: function(nodeData,callback) {
            current_note;
            if (current_note[0] != '') {
                nodeData.label = current_note;
                callback(nodeData);
            }
        },
        editNode: function(nodeData,callback) {
            nodeData.label = 'A';
            callback(nodeData);
        },
        controlNodeStyle: {
            //Styling here dab
        }
    },
    locales: locales,
    locale: "music",
};

// initialize your network!
var network = new vis.Network(container, data, options);
network.on("click", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML =
        "<h2>Click event:</h2>" + JSON.stringify(params, null, 4);
    console.log(
        "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
    );
});
network.on("doubleClick", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML =
        "<h2>doubleClick event:</h2>" + JSON.stringify(params, null, 4);
});
network.on("oncontext", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML = 
        "<h2>oncontext (right click) event:</h2>" + JSON.stringify(params, null, 4);
});
network.on("dragStart", function (params) {
    // There's no point in displaying this event on screen, it gets immediately overwritten
    params.event = "[original event]";
    console.log("dragStart Event:", params);
    console.log(
        "dragStart event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
    );
});
network.on("dragging", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML =
        "<h2>dragging event:</h2>" + JSON.stringify(params, null, 4);
});
network.on("dragEnd", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML =
        "<h2>dragEnd event:</h2>" + JSON.stringify(params, null, 4);
    console.log("dragEnd Event:", params);
    console.log(
        "dragEnd event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
);
});
network.on("controlNodeDragging", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML =
        "<h2>control node dragging event:</h2>" + JSON.stringify(params, null, 4);
});
network.on("controlNodeDragEnd", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML =
        "<h2>control node drag end event:</h2>" + JSON.stringify(params, null, 4);
    console.log("controlNodeDragEnd Event:", params);
});
network.on("zoom", function (params) {
    document.getElementById("eventSpan").innerHTML =
        "<h2>zoom event:</h2>" + JSON.stringify(params, null, 4);
});
network.on("showPopup", function (params) {
    document.getElementById("eventSpan").innerHTML =
        "<h2>showPopup event: </h2>" + JSON.stringify(params, null, 4);
});
network.on("hidePopup", function () {
    console.log("hidePopup Event");
});
network.on("select", function (params) {
    console.log("select Event:", params);
});
network.on("selectNode", function (params) {
    // THIS IS WHEN YOU SELECT A NODE
    root_node_index = params["nodes"][0];
    console.log("dab");
    // root_node_index is actually a string for some reason? Whack
    console.log("selectNode Event:", params);
});
network.on("selectEdge", function (params) {
    console.log("selectEdge Event:", params);
});
network.on("deselectNode", function (params) {
    console.log("deselectNode Event:", params);
});
network.on("deselectEdge", function (params) {
    console.log("deselectEdge Event:", params);
});
network.on("hoverNode", function (params) {
    console.log("hoverNode Event:", params);
});
network.on("hoverEdge", function (params) {
    console.log("hoverEdge Event:", params);
});
network.on("blurNode", function (params) {
    console.log("blurNode Event:", params);
});
network.on("blurEdge", function (params) {
    console.log("blurEdge Event:", params);
});
