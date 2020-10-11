"use strict";

var _options;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Set-up
var root_node;
var current_node;
var edgeMode = false;
var bpm = 120;
var secPerBeat = 4 * 60 / bpm;
var play = false;
var instrument1 = new Instrument("Instrument 1", "sine", 1.25, 1.25, 0.43, 1.25, 0.9, new Filter(1270, "lowpass"), new Reverb(2.5, 0.5), new Delay([1, 8], 0.5, 0.5));
var instrument2 = new Instrument("Instrument 2", "sine", 1.25, 1.25, 0.43, 1.25, 0.9, new Filter(1270, "lowpass"), new Reverb(2.5, 0.5), new Delay([1, 8], 0.5, 0.5));
var instrument3 = new Instrument("instrument 3", "sine", 1.25, 1.25, 0.43, 1.25, 0.9, new Filter(1270, "lowpass"), new Reverb(2.5, 0.5), new Delay([1, 8], 0.5, 0.5));
var listOfInstruments = {
  "Instrument 1": instrument1,
  "Instrument 2": instrument2,
  "Instrument 3": instrument3
}; // Add New Instrument TBD

function addNewInstrument() {
  var instrumentName = document.getElementById('newInstrumentName').value;
  var instrument = new Instrument(instrumentName, wave_name, document.getElementById('adsrA').value, document.getElementById('adsrD').value, document.getElementById('adsrS').value, document.getElementById('adsrR').value, gain, filter, reverb, delay);
  listOfInstruments.add([{
    instrumentName: instrument
  }]);
}

function updateAttack(elem, id) {
  var value = 5 * Math.pow(elem.value, 2);
  console.log(value);
  document.getElementById("attackSpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_attack(value);
}

function updateDecay(elem, id) {
  var value = 5 * Math.pow(elem.value, 2);
  document.getElementById("decaySpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_decay(value);
}

function updateSustain(elem, id) {
  var value = Math.pow(elem.value, 1.2) + 0.0001;
  document.getElementById("sustainSpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_sustain(value);
}

function updateRelease(elem, id) {
  var value = 10 * Math.pow(elem.value, 2);
  document.getElementById("releaseSpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_release(value);
}

function updateCutoff(elem, id) {
  var value = 20000 * Math.pow(elem.value, 4) + 20;
  document.getElementById("cutoffSpan" + id).value = Math.round(value);
  listOfInstruments["Instrument " + (id + 1)].set_filter_cutoff(value);
}

function updateFilterType(elem, id) {
  var type = elem.value;
  listOfInstruments["Instrument " + (id + 1)].set_filter_type(type);
}

function updateReverbDecay(elem, id) {
  var value = 10 * Math.pow(elem.value, 2) + 0.0001;
  document.getElementById("reverbDecaySpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_reverb_decay(value);
}

function updateReverbMix(elem, id) {
  var value = elem.value;
  document.getElementById("reverbMixSpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_reverb_mix(value);
}

function updateDelayTimeTop(elem, id) {
  var value = elem.value;
  console.log("top");
  listOfInstruments["Instrument " + (id + 1)].set_delay_time_top(value);
}

function updateDelayTimeBot(elem, id) {
  var value = elem.value;
  listOfInstruments["Instrument " + (id + 1)].set_delay_time_bot(value);
}

function updateDelayFeedback(elem, id) {
  var value = elem.value;
  document.getElementById("delayFeedbackSpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_delay_feedback(value);
}

function updateDelayMix(elem, id) {
  var value = elem.value;
  document.getElementById("delayMixSpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_delay_mix(value);
}

function updateGain(elem, id) {
  var value = elem.value;
  document.getElementById("gainSpan" + id).value = Math.round(value * 100) / 100;
  listOfInstruments["Instrument " + (id + 1)].set_gain(value);
}

function updateFilter(id) {
  if ($("#filterCheck" + id).is(':checked')) {
    $("#filterButton" + id).removeClass("disabled");
  } else {
    $("#filterButton" + id).addClass("disabled");
    $("#collapseFilter" + id).collapse('hide');
  }

  listOfInstruments["Instrument " + (id + 1)].toggle_filter();
}

function updateReverb(id) {
  if ($("#reverbCheck" + id).is(':checked')) {
    $("#reverbButton" + id).removeClass("disabled");
  } else {
    $("#reverbButton" + id).addClass("disabled");
    $("#collapseReverb" + id).collapse('hide');
  }

  listOfInstruments["Instrument " + (id + 1)].toggle_reverb();
}

function updateDelay(id) {
  if ($("#delayCheck" + id).is(':checked')) {
    $("#delayButton" + id).removeClass("disabled");
  } else {
    $("#delayButton" + id).addClass("disabled");
    $("#collapseDelay" + id).collapse('hide');
  }

  listOfInstruments["Instrument " + (id + 1)].toggle_delay();
} // Log Slider lmao


function convertLog(position) {
  console.log(Math.exp(Math.log(5) * position));
  return Math.exp(Math.log(5) * position);
}

$("#slider").roundSlider(); // Custom Carousel 

var slide0 = 0;
var slide1 = 1;
var slide2 = 2;

function nextImage(id) {
  var elem = document.getElementById("waveIMG" + id);

  if (id == 0) {
    slide0 = (slide0 + 1) % 4 + 4;
    var arr = valueToWaveform(slide0 - 4);
    elem.src = arr[0];
    elem.alt = arr[1];
    listOfInstruments["Instrument " + (id + 1)].set_wave_form(arr[1]);
  }

  if (id == 1) {
    slide1 = (slide1 + 1) % 4 + 4;

    var _arr = valueToWaveform(slide1 - 4);

    elem.src = _arr[0];
    elem.alt = _arr[1];
    listOfInstruments["Instrument " + (id + 1)].set_wave_form(_arr[1]);
  }

  if (id == 2) {
    slide2 = (slide2 + 1) % 4 + 4;

    var _arr2 = valueToWaveform(slide2 - 4);

    elem.src = _arr2[0];
    elem.alt = _arr2[1];
    listOfInstrumentst["Instrument " + (id + 1)].set_wave_form(_arr2[1]);
  }
}

function previousImage(id) {
  var elem = document.getElementById("waveIMG" + id);

  if (id == 0) {
    slide0 = (slide0 - 1) % 4 + 4;
    console.log(slide0 - 4);
    var arr = valueToWaveform(slide0 - 4);
    elem.src = arr[0];
    elem.alt = arr[1];
    listOfInstruments["Instrument " + (id + 1)].set_wave_form(arr[1]);
  }

  if (id == 1) {
    slide1 = (slide1 - 1) % 4 + 4;

    var _arr3 = valueToWaveform(slide1 - 4);

    elem.src = _arr3[0];
    elem.alt = _arr3[1];
    listOfInstruments["Instrument " + (id + 1)].set_wave_form(_arr3[1]);
  }

  if (id == 2) {
    slide2 = (slide2 - 1) % 4 + 4;

    var _arr4 = valueToWaveform(slide2 - 4);

    elem.src = _arr4[0];
    elem.alt = _arr4[1];
    listOfInstruments["Instrument " + (id + 1)].set_wave_form(_arr4[1]);
  }
}

function valueToWaveform(v) {
  if (v == 0) {
    return ["/images/sine.png", "sine"];
  } else if (v == 1) {
    return ["/images/square.png", "square"];
  } else if (v == 2) {
    return ["/images/triangle.png", "triangle"];
  } else {
    return ["/images/sawtooth.png", "sawtooth"];
  }
} // create an array with nodes
// mode can be "Complete" = randomly chooses, "Single" = chooses a single node, "None" 


var nodes = new vis.DataSet([{
  id: 0,
  label: 'G2',
  interval: [1, 1],
  timer: setTimeout(function () {}, 0),
  instrument: instrument1,
  mode: "None",
  root: true
}, {
  id: 1,
  label: 'F2',
  interval: [1, 1],
  timer: setTimeout(function () {}, 0),
  instrument: instrument1,
  mode: "None",
  root: false
}, {
  id: 2,
  label: 'Eb2',
  interval: [1, 1],
  timer: setTimeout(function () {}, 0),
  instrument: instrument1,
  mode: "None",
  root: false
}, {
  id: 3,
  label: 'C2',
  interval: [1, 1],
  timer: setTimeout(function () {}, 0),
  instrument: instrument1,
  mode: "None",
  root: false
}, {
  id: 4,
  label: 'G4',
  interval: [1, 2],
  timer: setTimeout(function () {}, 0),
  instrument: instrument2,
  mode: "None",
  root: false
}, {
  id: 5,
  label: 'A4',
  interval: [1, 2],
  timer: setTimeout(function () {}, 0),
  instrument: instrument2,
  mode: "None",
  root: false
}, {
  id: 6,
  label: 'F4',
  interval: [1, 2],
  timer: setTimeout(function () {}, 0),
  instrument: instrument2,
  mode: "None",
  root: false
}, {
  id: 7,
  label: 'Bb4',
  interval: [1, 2],
  timer: setTimeout(function () {}, 0),
  instrument: instrument2,
  mode: "None",
  root: false
}, {
  id: 8,
  label: 'D5',
  interval: [1, 2],
  timer: setTimeout(function () {}, 0),
  instrument: instrument2,
  mode: "None",
  root: false
}]); // create an array with edges

var edges = new vis.DataSet([{
  id: 0,
  from: 0,
  to: 1,
  interval: [1, 1]
}, {
  id: 1,
  from: 0,
  to: 4,
  interval: [1, 2]
}, {
  id: 2,
  from: 0,
  to: 7,
  interval: [1, 2]
}, {
  id: 3,
  from: 0,
  to: 8,
  interval: [1, 2]
}, {
  id: 4,
  from: 1,
  to: 2,
  interval: [1, 1]
}, {
  id: 5,
  from: 1,
  to: 6,
  interval: [1, 2]
}, {
  id: 6,
  from: 1,
  to: 5,
  interval: [1, 2]
}, {
  id: 7,
  from: 1,
  to: 8,
  interval: [1, 2]
}, {
  id: 8,
  from: 2,
  to: 3,
  interval: [1, 1]
}, {
  id: 9,
  from: 2,
  to: 4,
  interval: [1, 2]
}, {
  id: 10,
  from: 2,
  to: 7,
  interval: [1, 2]
}, {
  id: 11,
  from: 2,
  to: 8,
  interval: [1, 2]
}, {
  id: 12,
  from: 3,
  to: 0,
  interval: [1, 1]
}, {
  id: 13,
  from: 3,
  to: 4,
  interval: [1, 2]
}, {
  id: 14,
  from: 3,
  to: 7,
  interval: [1, 2]
}, {
  id: 15,
  from: 3,
  to: 8,
  interval: [1, 2]
}]);

function triggerNode(node) {
  var playTime;
  return regeneratorRuntime.async(function triggerNode$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          node.color = {
            background: "#71e36f",
            highlight: {
              background: "#71e36f"
            }
          };
          nodes.update(node);
          clearTimeout(node.timer);
          node.instrument.press_note(node.label, node.id);
          playTime = node.interval[0] / node.interval[1] * secPerBeat * 1000;
          console.log(playTime);
          node.timer = setTimeout(function () {
            node.instrument.release_note(node.label, node.id);
            node.color = {
              background: "#D2E5FF",
              highlight: {
                background: "#D2E5FF"
              }
            };
            nodes.update(node);
          }, 1000);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function test() {
  console.log($('#carouselOne .active').index('#carouselOne .item'));
} //var prev_time;


function sleep(ms) {
  //Debug
  //time_now = Date.now();
  //console.log(time_now - prev_time);
  //prev_time = time_now;
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function stopPressed() {
  play = false;
  document.getElementById('playMusic').style.display = "block";
  document.getElementById('stopMusic').style.display = "none"; // Enable all edit buttons
  // Disable all edit buttons

  $("#edit-button").removeClass("disabled");
  $("#add-button").removeClass("disabled");
  $("#delete-button").removeClass("disabled");
} // Traversing to play music


function playPressed() {
  var randomRoot;
  return regeneratorRuntime.async(function playPressed$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          play = true;
          document.getElementById('playMusic').style.display = "none";
          document.getElementById('stopMusic').style.display = "block";
          _context2.next = 5;
          return regeneratorRuntime.awrap(Tone.start());

        case 5:
          network.disableEditMode(); // Disable all edit buttons

          $("#edit-button").addClass("disabled");
          $("#add-button").addClass("disabled");
          $("#delete-button").addClass("disabled");
          nodeList = nodes.get({
            fields: ['id', 'label', 'interval', 'timer', 'instrument', 'mode', 'root']
          });
          rootNodes = [];

          for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].root) {
              rootNodes.push(nodeList[i]);
            }
          }

          randomRoot = nodeList[Math.floor(Math.random() * nodeList.length)];
          current_node = randomRoot;
          i = 0;

        case 15:
          if (!(i < rootNodes.length)) {
            _context2.next = 24;
            break;
          }

          if (!play) {
            _context2.next = 20;
            break;
          }

          playNode(rootNodes[i], 0);
          _context2.next = 21;
          break;

        case 20:
          return _context2.abrupt("break", 24);

        case 21:
          i++;
          _context2.next = 15;
          break;

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function playNode(parentNode, delay) {
  var start, edge, _interval;

  return regeneratorRuntime.async(function playNode$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(sleep(delay));

        case 2:
          triggerNode(parentNode);
          start = Date.now();
          nodeEdges = getNextNodes(parentNode);
          console.log(nodeEdges);
          i = 0;

        case 7:
          if (!(i < nodeEdges[0].length)) {
            _context3.next = 18;
            break;
          }

          edge = edges.get(nodeEdges[1][i]);
          _interval = edge.interval[0] / edge.interval[1] * secPerBeat * 1000;

          if (!play) {
            _context3.next = 14;
            break;
          }

          playNode(nodeEdges[0][i], _interval - (Date.now() - start));
          _context3.next = 15;
          break;

        case 14:
          return _context3.abrupt("break", 18);

        case 15:
          i++;
          _context3.next = 7;
          break;

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getNextNodes(node) {
  var neighboring_nodes = network.getConnectedNodes(node.id, 'to');
  var parent_edges = network.getConnectedEdges(node.id); // Add play sound function here

  if (node.mode == "Complete") {
    nodes = [];
    loc_edges = [];

    for (nn in neighboring_nodes) {
      if (Math.random > 0.5) {
        nodes.push(nodes.get(neighboring_nodes[nn]));
        var child_edges = network.getConnectedEdges(neighboring_nodes[nn]);

        loop: for (ce = 0; ce < child_edges.length; ce++) {
          for (j in parent_edges) {
            if (child_edges[ce] == parent_edges[j]) {
              loc_edges.push(parent_edges[j]);
              break loop;
            }
          }
        }
      }
    }

    return [nodes, loc_edges];
  }

  if (node.mode == "Single") {
    var nodeId = neighboring_nodes[Math.floor(Math.random() * neighboring_nodes.length)];

    var _loc_edges;

    var _child_edges = network.getConnectedEdges(nodeId);

    loop: for (i in _child_edges) {
      for (j in parent_edges) {
        if (_child_edges[i] == parent_edges[j]) {
          _loc_edges = parent_edges[j];
          break loop;
        }
      }
    }

    return [[nodes.get(nodeId)], [_loc_edges]];
  }

  console.log("hi");
  loc_edges = [];
  loc_nodes = [];

  for (nn = 0; nn < neighboring_nodes.length; nn++) {
    console.log(nn);
    console.log(neighboring_nodes[nn]);
    console.log(neighboring_nodes);
    loc_nodes.push(nodes.get(neighboring_nodes[nn]));

    var _child_edges2 = network.getConnectedEdges(neighboring_nodes[nn]);

    console.log("got edges");

    loop: for (ce = 0; ce < _child_edges2.length; ce++) {
      for (j in parent_edges) {
        if (_child_edges2[ce] == parent_edges[j]) {
          loc_edges.push(parent_edges[j]);
          break loop;
        }
      }
    }
  }

  console.log("Done: " + loc_edges);
  return [loc_nodes, loc_edges];
}

var currently_selected_nodes = [];
var currently_selected_edges = [];
var force_save = false;

function saveNodeSubmit() {
  var note;
  var accidental;
  var octave;
  var instrument_str;
  var mode_str;
  var root_str;
  var interval_inp = [$("#startNodeInterval")[0].value, $("#stopNodeInterval")[0].value]; //Debug

  console.log(interval_inp);
  $('#noteButtons .active').each(function () {
    note = $(this)[0].innerText;
  });
  $('#accidentalButtons .active').each(function () {
    accidental = $(this)[0].innerText;
  });
  $('#octaveButtons .active').each(function () {
    octave = $(this)[0].innerText;
  });
  $('#instrumentButtons .active').each(function () {
    instrument_str = $(this)[0].innerText;
  });
  $('#modeButtons .active').each(function () {
    mode_str = $(this)[0].innerText;
  });
  $('#rootButtons .active').each(function () {
    root_str = $(this)[0].innerText;
  }); //Debug
  //console.log(note, accidental, octave, instrument_str);
  //Add node

  var accidentals = {
    'Flat': 'b',
    'Sharp': '#',
    'Natural': ''
  };
  var root_dict = {
    "Root": true,
    "Not Root": false
  };
  network.enableEditMode(); //console.log("LENGTH OF NODES:", currently_selected_nodes.length);
  //If new node

  if (currently_selected_nodes.length == 0 || force_save) {
    nodeList = nodes.get({
      fields: ['id', 'label']
    });
    nodes.add({
      id: nodeList.length + 1,
      label: note + accidentals[accidental] + octave,
      instrument: listOfInstruments[instrument_str],
      mode: mode_str,
      root: root_dict[root_str],
      interval: interval_inp
    });
    console.log(instrument_str, listOfInstruments[instrument_str]);
    force_save = false;
    return;
  } //Edit pre-existing node


  var selected_node_id = currently_selected_nodes[0];
  nodes.update({
    id: selected_node_id,
    label: note + accidentals[accidental] + octave,
    instrument: listOfInstruments[instrument_str],
    mode: mode_str,
    root: root_dict[root_str],
    interval: interval_inp
  });
}

function saveEdgeSubmit() {
  interval = [$("#startInterval")[0].value, $("#stopInterval")[0].value];
  edge_id = currently_selected_edges[0];
  edges.update({
    id: edge_id,
    interval: interval
  });
} //Trash version, doesn't show current settings


function openEditModal() {
  if (currently_selected_nodes.length > 0) {
    //Show Node modal
    $("#noteModal").modal("toggle");
  } else if (currently_selected_nodes.length == 0 && currently_selected_edges.length > 0) {
    //Show Edge Modal
    $("#edgeModal").modal("toggle");
  }
}

function toggleAddNode(bool) {
  if (bool) {
    network.enableEditMode();
    network.addNodeMode();
  } else {
    network.disableEditMode();
  }
}

function toggleAddEdge(bool) {
  if (bool) {
    edgeMode = true;
    network.enableEditMode();
    network.addEdgeMode();
  } else {
    edgeMode = false;
    network.disableEditMode();
  }
}

function renderNodesDropdown() {
  nodeList = nodes.get({
    fields: ['id', 'label']
  });
  edgeList = edges.get({
    fields: ["from", "to"]
  });

  for (node in nodeList) {
    var dropdown = document.createElement("a");
    dropdown.innerHTML = node;
    dropdown.classList.add("dropdown-item");
    document.getElementById("fromDropdown").appendChild(dropdown);
  }
} // create a network


var container = document.getElementById('musicNetwork'); // provide the data in the vis format

var data = {
  nodes: nodes,
  edges: edges
};
var options = (_options = {
  edges: {
    arrows: {
      to: {
        enabled: true
      }
    },
    smooth: {
      enabled: true
    }
  },
  interaction: {
    hover: true
  }
}, _defineProperty(_options, "interaction", {
  navigationButtons: true,
  keyboard: true
}), _defineProperty(_options, "manipulation", {
  enabled: false,

  /*
  addNode: function(nodeData,callback) {
      current_note = prompt("Please enter note");
      if (current_note != "") {
          console.log(nodeData);
          nodeData.label = current_note;
          callback(nodeData);
      }
  },
  */
  //Function to add edge
  addEdge: function addEdge(edgeData, callback) {
    //if ({from: edgeData.from, to: edgeData.to})

    /*if (edgeData.from === edgeData.to) {
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
    }*/
    edge_id = edges.add(edgeData)[0];
    edges.update({
      id: edge_id,
      interval: [1, 8]
    });

    if (edgeMode) {
      network.addEdgeMode();
    }
  }
  /*
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
  */

}), _options); //Initialize your network!

var network = new vis.Network(container, data, options);
network.on("oncontext", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpan").innerHTML = "<h2>oncontext (right click) event:</h2>" + JSON.stringify(params, null, 4);
});
network.on("select", function (params) {
  currently_selected_nodes = params["nodes"];
  currently_selected_edges = params["edges"]; //Edit button should only be activated when Node or Edge is selected

  if (currently_selected_nodes.length == 0 && currently_selected_edges.length == 0) {
    $("#edit-button").addClass("disabled");
  } else {
    $("#edit-button").removeClass("disabled");
  }
});
network.on("selectNode", function (params) {
  var node_index = params["nodes"][0];
  triggerNode(nodes.get(node_index));
});
network.on("selectEdge", function (params) {
  console.log("selectEdge Event:", params);
});
network.on("deselectEdge", function (params) {
  console.log("deselectEdge Event:", params);
}); //Unessary event listeners

/*
network.on("click", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML =
        "<h2>Click event:</h2>" + JSON.stringify(params, null, 4);
    console.log(
        "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
    );
});
network.on("showPopup", function (params) {
    document.getElementById("eventSpan").innerHTML =
        "<h2>showPopup event: </h2>" + JSON.stringify(params, null, 4);
});
network.on("hidePopup", function () {
    console.log("hidePopup Event");
});
network.on("zoom", function (params) {
    document.getElementById("eventSpan").innerHTML =
        "<h2>zoom event:</h2>" + JSON.stringify(params, null, 4);
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
network.on("deselectNode", function (params) {
    console.log("deselectNode Event:", params);
});
network.on("selectNode", function (params) {
    // THIS IS WHEN YOU SELECT A NODE
    root_node_index = params["nodes"][0];
    console.log("dab");
    // root_node_index is actually a string for some reason? Whack
    console.log("selectNode Event:", params);
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
network.on("doubleClick", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpan").innerHTML =
        "<h2>doubleClick event:</h2>" + JSON.stringify(params, null, 4);
});
*/