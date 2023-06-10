// ---------------
//  Console logic
// ---------------

(function(){
    let log = console.log
    console.log = (txt) => {
        document.getElementById('console').innerHTML += `\n<span class="lavender">LOG: ${txt}</span>`
        log(txt)
    }

    let error = console.error
    console.error = (txt) => {
        document.getElementById('console').innerHTML += `\n<span class="red">ERROR: ${txt}</span>`
        error(txt)
    }

    let warn = console.warn
    console.warn = (txt) => {
        document.getElementById('console').innerHTML += `\n<span class="yellow">WARN: ${txt}</span>`
        warn(txt)
    }

    let info = console.info
    console.info = (txt) => {
        document.getElementById('console').innerHTML += `\n<span class="green">INFO: ${txt}</span>`
        info(txt)
    }
})()

// ---------------
//  Leaflet setup
// ---------------

var map = L.map('map').setView([50.69, 9.77], 6.2)

var layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 6,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | Network Editor'
})

layer.addTo(map)

// -----------
//  Tab logic
// -----------

document.querySelectorAll("div.tabs").forEach(node => {
    node.querySelectorAll("button").forEach((children, idx) => {
        children.addEventListener('click', () => tabClickEvent(node.id.replace('tabs_', ''), idx))
    })
})

function tabClickEvent(list_id, tab_id) {
    const tab_content_id = `tab_content_${list_id}_${tab_id}`
    if (document.getElementById(tab_content_id).className.includes('hidden')) {
        document.querySelectorAll(`.tab_content_${list_id}`).forEach(el => el.classList.add('hidden'))
        document.getElementById(tab_content_id).classList.remove('hidden')
        document.getElementById(`tabs_${list_id}`).querySelectorAll('button').forEach((btn, idx) => {
            if (idx == tab_id) btn.classList.add('active')
            else btn.classList.remove('active')
        })
    }
}

// -------------------------
//  Constants and templates
// -------------------------

keyValue = (key, type, id, placeholder) => `<div class="key_value">${key} <input type="${type}" placeholder="${placeholder}" id="${id}" /></div>`
keySelect = (key, options, id) => `<div class="key_value">${key} <select id="${id}">${options}</select></div>`
nodeTableEntry = id => `<tr id="node_${id}"><td>${id}</td><td><button id="node_${id}_display">Display</button><button id="node_${id}_focus">Focus</button></td><td><input id="node_${id}_name" type="text" placeholder="Currently hidden"/></td></tr>`

line_path_tree = (line, paths) =>
`<div id="line_${line}" class="line">
<div id="line_${line}_title" class="line_title"><i class="bi bi-caret-down-fill"></i><b>Line "${line}"</b></div>
<div id="line_${line}_nodes">
${paths}
</div></div>`
path_tree_child = (line, path) => `<div><input type="radio" name="current_path" id="${line}_${path}" /> <i class="bi bi-arrow-return-right"></i> Path #${path}</div>`

const node_size = 12

const hidden_node_icon = L.icon({
    iconUrl: "/res/editor/node_hidden.svg",
    iconSize: [node_size, node_size],
})

const station_node_icon = L.icon({
    iconUrl: "/res/editor/node_station.svg",
    iconSize: [node_size, node_size],
})

// -----------------
//  Network storage
// -----------------

let NETWORK = emptyNetwork()

function emptyNetwork() {
    const empty = {
        "meta": {
            "city": "",
            "network": "",
            "country": "",
            "company": ""
        },
        "nodes": [],
        "lines": {}
    }
    return empty
}

// -------------------
//  Click modes logic
// -------------------

const clickModes = {
    // Note: "mode": "marker" recieves an id, but "mode": "map" won't.
    "select": {
        "mode": "marker",
        "action": args => {
            console.log(`Node with ID ${args.id} "${NETWORK.nodes[args.id].name}" @ ${args.pos}`)
        }
    },
    "create": {
        "mode": "map",
        "action": args => createNode(NETWORK.nodes.length, args.pos.lat, args.pos.lng, '')
    },
    "delete": {
        "mode": "marker",
        "action": args => {
            NETWORK.nodes.splice(args.id, 1)
            redrawNodes()
        }
    },
    "add": {
        "mode": "marker",
        "action": args => {
            
        }

    },
    "remove": {
        "mode": "marker",
        "action": args => {
            
        }
    }
}

let selectedClickMode = "select"

function triggerClickMode(required_mode, args) {
    const mode = clickModes[selectedClickMode]
    if (mode.mode == required_mode) mode.action(args)
}

document.querySelectorAll('button.mode_btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedClickMode = btn.id
    })
})

// ------------
//  Node logic
// ------------

let markers = []

function createNodeMarker(id, lat, lng, name) {
    const pos = [lat, lng]

    let options = {}
    options.icon = (name == "") ? hidden_node_icon : station_node_icon

    let marker = L.marker(pos, options)
    marker.on('click', () => triggerClickMode('marker', { id, pos }))
    return marker
}

function createNodeTableEntry(id, lat, lng, name) {
    document.getElementById('nodes').innerHTML += nodeTableEntry(id)
    document.getElementById(`node_${id}_name`).value = name
    document.getElementById(`node_${id}_name`).addEventListener('keypress', (e) => NodeNameInputEvent(e, `node_${id}_name`, id))
    document.getElementById(`node_${id}_focus`).addEventListener('click', () => map.setView([lat, lng], 16))
    document.getElementById(`node_${id}_display`).addEventListener('click', () => console.info(`lat: ${lat}; lng: ${lng}`))
}

function redrawNodes() {
    markers.forEach(marker => {
        marker.removeFrom(map)
    })
    
    markers = []
    document.getElementById('nodes').innerHTML = ""

    NETWORK.nodes.forEach((node, idx) => {
        createNodeTableEntry(idx, node.position[0], node.position[1], node.name)
        
        let nodeMarker = createNodeMarker(idx, node.position[0], node.position[1], node.name)
        markers.push(nodeMarker)
        nodeMarker.addTo(map)
    })
}

function createNode(id, lat, lng, name) {
    createNodeTableEntry(id, lat, lng, name)

    let marker = createNodeMarker(id, lat, lng, name)

    markers.push(marker)
    marker.addTo(map)

    NETWORK.nodes.push({
        position: [lat, lng],
        name: name
    })
}

map.on('click', (e) => {
    const pos = e.latlng
    triggerClickMode("map", { pos })
})

// ------------
//  Line logic
// ------------

let selectedLinePath = {
    any_selected: false,
    line: "",
    path: 0
}

function createLine(name, color, style) {
    NETWORK.lines[name] = { color, style, paths: [] }
}

function createPath(line, frequency, color, style) {
    NETWORK.lines[line].paths.push({ frequency, color, style, nodes: [] })
}

// ------------
//  Path logic
// ------------

function selectPath(line, path) {
    selectedLinePath = {
        any_selected: true, line, path
    }
}

function deselectPath() {
    selectedLinePath.any_selected = false
}

function generatePathTree() {
    let lines = ""
    for (let _line in NETWORK.lines) {
        let paths = ""
        for (let _path in NETWORK.lines[_line].paths) 
            paths += path_tree_child(_line, _path)
        lines += line_path_tree(_line, paths)
    }
    document.getElementById('lines').innerHTML = lines

    for (let _line in NETWORK.lines) {
        for (let _path in NETWORK.lines[_line].paths) document.getElementById(`${_line}_${_path}`).addEventListener('click', () => selectPath(_line, _path))
        document.getElementById(`line_${_line}_title`).addEventListener('click', () => document.querySelector(`#line_${_line}`).classList.toggle('collapsed'))
    }
}

// ---------------------
//  Path <-> Node logic
// ---------------------

/**
 * @param {number} nodeId ID of node, which shall be appended.
 */
function addNodeToCurrentPath(nodeId) {
    NETWORK.lines[selectedLinePath.line].paths[selectedLinePath.path].push(nodeId)
}

/**
 * @param {number} nodeId ID of node, which shall be removed.
 * @returns New version of nodes array
 */
function removeNodeFromCurrentPath(nodeId) {
    setCurrentPathsNodes(NETWORK.lines[selectedLinePath.line].paths[selectedLinePath.path].nodes.filter(obj => obj !== nodeId));
}

/**
 * Overrides the current path's node list.
 * @param {number[]} new_nodes The new node list.
 */
function setCurrentPathsNodes(new_nodes) {
    NETWORK.lines[selectedLinePath.line].paths[selectedLinePath.path].nodes = new_nodes
}

// -----------------
//  Rendering logic
// -----------------

let pathPolylines = []

/**
 * Clears Paths from screen and also overrides pathPolylines to an empty array.
 */
function clearPathsFromScreen() {
    for (var ppl in pathPolylines) ppl.removeFrom(map)
    pathPolylines = []
}

function drawPaths() {
    for (var line in NETWORK.lines) {
        for (var path in line.paths) {
            let latlngs = []
            const color = path.color || line.color
            const style = path.style || line.style

            for (var node in path.nodes) {
                const latlng = NETWORK.nodes[node]
                latlngs.push(latlng)
            }

            // TODO IMPL: do something with "const style"
            let polyline = L.polyline(latlngs, {color: color, weight: path.frequency/10, lineJoin: 'round'})
            pathPolylines.push(polyline)
            polyline.addTo(map)
        }
    }
}

function redrawPaths() {
    clearPathsFromScreen()
    drawPaths()
    generatePathTree()
}

document.querySelector('#create_line .btn').addEventListener('click', () => {
    const name = document.querySelector('#create_line #name').value
    const color = document.querySelector('#create_line #color').value
    const style = document.querySelector('#create_line #style').value

    createLine(name, color, style)
    createPath(name, 60, color, style)

    redrawPaths()
})

document.querySelector('#create_path .btn').addEventListener('click', () => {
    if (!selectedLinePath.any_selected) return

    const frequency = Number.parseInt(document.querySelector('#create_path #frequency').value)
    const color = document.querySelector('#create_path #color').value
    const style = document.querySelector('#create_path #style').value

    createPath(selectedLinePath.line, frequency, color, style)

    redrawPaths()
})

// -----------------
//  Event Listeners
// -----------------

function NodeNameInputEvent(e, input_id, id) {
    if (e.key != "Enter") return
    console.log(document.getElementById(input_id).value)
    NETWORK.nodes[id].name = document.getElementById(input_id).value
    redrawNodes()
}

document.getElementById('clear_terminal').addEventListener('click', () => {
    document.getElementById('console').innerHTML = `<span class="green">INFO: Console cleared.</span>`
})

document.getElementById('toggle_menu_text').addEventListener('click', () => {
    document.getElementById('top').classList.toggle('hide_text')
})