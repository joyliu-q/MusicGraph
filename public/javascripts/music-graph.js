// Set-up
let root_node;
let current_node;
let edgeMode = false;

var bpm = 120;
var secPerBeat = 4*60/bpm;
var default_instrument = new Instrument("default", "sawtooth", 0.01, 0.05, 0.001, 1, 0.9, new Filter(1000, "lowpass"), new Reverb(1, 0.3), null);
var gamer_instrument = new Instrument("default", "square", 0.01, 0.05, 0.001, 1, 0.2, null, null, null);
var chill_instrument = new Instrument("default", "sine", 0.5, 0.1, 0.001, 3, 1, null, new Reverb(3, 1), null);
var listOfInstruments = {"Default": default_instrument, "Gamer": gamer_instrument, "Chill": chill_instrument };

// Log Slider lmao
function convertLog(position) {
    console.log(Math.exp(Math.log(5)*position));
    return Math.exp(Math.log(5)*position);
}

$("#slider").roundSlider();

// create an array with nodes
// mode can be "Complete" = randomly chooses, "Single" = chooses a single node, "None" 
var nodes = new vis.DataSet([
    {id: 0, label: 'Bb4', interval: [1, 8], timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Single"},
    {id: 1, label: 'D4', interval: [1, 8], timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Single"},
    {id: 2, label: 'F4', interval: [1, 8], timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Single"},
    {id: 3, label: 'A4', interval: [1, 8], timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Single"},
    {id: 4, label: 'G4', interval: [1, 8], timer: setTimeout(() => {}, 0), instrument: default_instrument, mode: "Single"}
]);

// create an array with edges
var edges = new vis.DataSet([
    {id: 0, from: 0, to: 2, interval: [1, 8]},
    {id: 1, from: 0, to: 1, interval: [2, 8]},
    {id: 2, from: 1, to: 0, interval: [1, 8]},
    {id: 3, from: 1, to: 3, interval: [1, 8]},
    {id: 4, from: 1, to: 4, interval: [2, 8]},
    {id: 5, from: 3, to: 4, interval: [1, 8]},
    {id: 6, from: 2, to: 3, interval: [1, 8]},
    {id: 7, from: 4, to: 0, interval: [2, 8]},
]);

async function triggerNode(node) {
    clearTimeout(node.timer);
    node.instrument.press_note(node.label, node.id);
    let playTime = node.interval[0]/node.interval[1]*secPerBeat * 1000;
    console.log(playTime);
    node.timer = setTimeout(() => { node.instrument.release_note(node.label, node.id) }, 1000);
}

//var prev_time;
function sleep(ms) {
    //Debug
    //time_now = Date.now();
    //console.log(time_now - prev_time);
    //prev_time = time_now;

    return new Promise(resolve => setTimeout(resolve, ms));
}

// Traversing to play music
async function playPressed() {
    await Tone.start();
    network.disableEditMode();
    nodeList = nodes.get({fields: ['id', 'label', 'interval', 'timer', 'instrument', 'mode']});
    edgeList = edges.get({fields:["from", "to"]});
    var randomRoot = nodeList[Math.floor(Math.random()*nodeList.length)];
    current_node = randomRoot;
    
    playNode(current_node, 0);
}

async function playNode(parentNode, delay) {
    await sleep(delay);
    triggerNode(parentNode);
    let start = Date.now();
    nodeEdges = getNextNodes(parentNode);
    for (i = 0; i < nodeEdges[0].length; i++) {
        let edge = edges.get(nodeEdges[1][i]);
        let interval = edge.interval[0] / edge.interval[1] * secPerBeat * 1000;
        playNode(nodeEdges[0][i], interval - (Date.now() - start), nodeList);
    }
}

function getNextNodes(node) {
    let neighboring_nodes = network.getConnectedNodes(node.id, 'to');
    let parent_edges = network.getConnectedEdges(node.id);
    // Add play sound function here
    if (node.mode == "Complete") {
        nodes = [];
        edges = [];
        for (node in neighboring_nodes) {
            if (Math.random > 0.5) {
                nodes.push(node);
                loop: for (child_edge in network.getConnectedEdges(node)) {
                    for (parent_edge in parent_edges) {
                        if (child_edge == parent_edge) {
                            edges.push(parent_edge);
                            break loop;
                        }
                    }
                }
            }
        }
        return [nodes, edges];
    }
    if (node.mode == "Single") {
        let nodeId = neighboring_nodes[Math.floor(Math.random()*neighboring_nodes.length)];
        let edges;
        let child_edges = network.getConnectedEdges(nodeId);
        loop: for (i in child_edges) {
            for (j in parent_edges) {
                if (child_edges[i] == parent_edges[j]) {
                    edges = parent_edges[j];
                    break loop;
                }
            }
        }
        return [[nodes.get(nodeId)], [edges]];
    }
    loop: for (child_edge in getConnectedEdges(node)) {
        for (parent_edge in parent_edges) {
            if (child_edge == parent_edge) {
                edges.push(parent_edge);
                break loop;
            }
        }
    }
    edges = [];
    for (node in neighboring_nodes) {
        loop: for (child_edge in getConnectedEdges(node)) {
            for (parent_edge in parent_edges) {
                if (child_edge == parent_edge) {
                    edges.push(parent_edge);
                    break loop;
                }
            }
        }
    }
    return [neighboring_nodes, edges];
}

//Ariq Code
var currently_selected_nodes = [];
var force_save = false;
function saveNodeSubmit()
{
    var note;
    var accidental;
    var octave;
    var instrument_str;
    
    $('#noteButtons .active').each(function(){
        note = $(this)[0].innerText;
    }); 
    $('#accidentalButtons .active').each(function(){
        accidental = $(this)[0].innerText;
    });
    $('#octaveButtons .active').each(function(){
        octave = $(this)[0].innerText;
    });
    $('#instrumentButtons .active').each(function(){
        instrument_str = $(this)[0].innerText;
    });
    $('#modeButtons .active').each(function(){
        mode_str = $(this)[0].innerText;
    });

    //Debug
    //console.log(note, accidental, octave, instrument_str);
    
    //Add node
    var accidentals = {'Flat':'b', 'Sharp':'#', 'Natural':''}
    
    network.enableEditMode();
    
    //console.log("LENGTH OF NODES:", currently_selected_nodes.length);

    //If new node
    if(currently_selected_nodes.length == 0 || force_save)
    {
        nodeList = nodes.get({fields: ['id', 'label']});
        nodes.add([
            {id: nodeList.length+1, label: note + accidentals[accidental] + octave, instrument: listOfInstruments[instrument_str], mode: mode_str}
        ]);
        
        force_save = false;
        
        return;
    }
    
    //Edit pre-existing node
    var selected_node_id = currently_selected_nodes[0];
    
    nodes.update({id: selected_node_id, label: note + accidentals[accidental] + octave, instrument: listOfInstruments[instrument_str], mode: mode_str});
}

//Ariq Code
function editOpenModal() {
    if(currently_selected_nodes.length == 0)
        return;
    
    //Show modal
    $("#noteModal").modal("toggle");
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
};

//

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

    currently_selected_nodes = params["nodes"];
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