// ---------------
//  Console logic
// ---------------

(() => {
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

function toggleMinimizedConsole() {
    document.querySelector('section.layout').classList.toggle('minimize-console')
}

function toggleHiddenConsole() {
    document.querySelector('section.layout').classList.toggle('no-console')
}

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

function forceTabChange(list_id, tab_id) {
    document.getElementById(`tabs_${list_id}`).querySelectorAll('button')[tab_id].click()
}

// -----------------
//  Network storage
// -----------------

function emptyNetwork() {
    return {
        "meta": {
            "city": "",
            "network": "",
            "country": "",
            "company": "",
            "year": 1970
        },
        "nodes": [],
        "lines": {}
    }
}

let NETWORK = emptyNetwork()

function networkToInput() {
    metaKeys.forEach(key => document.getElementById(`meta_` + key).value = NETWORK.meta[key])
}

function inputToNetwork() {
    metaKeys.forEach(key => NETWORK.meta[key] = document.getElementById(`meta_${key}`).value)
} 

networkToInput()

// -------------------
//  Click modes logic
// -------------------

const clickModes = {
    // Note: "mode": "marker" recieves an id, but "mode": "map" won't.
    "select": {
        "mode": "select",
        "action": args => {
            console.log(`Node with ID ${args.id} "${NETWORK.nodes[args.id].name}" @ ${args.pos}`.replace(' ""', ''))
        }
    },
    "create": {
        "mode": "map",
        "left_tab": 0,
        "action": args => {
            createNode(NETWORK.nodes.length, args.pos.lat, args.pos.lng, '')
        }
    },
    "delete": {
        "mode": "marker",
        "left_tab": 0,
        "action": args => {
            NETWORK.nodes.splice(args.id, 1)
            redrawNodes()
        }
    },
    "add": {
        "mode": "marker",
        "left_tab": 2,
        "action": args => {
            addNodeToCurrentPath(args.id)
            redrawPaths()
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
        const left_tab = clickModes[btn.id].left_tab;
        const right_tab = clickModes[btn.id].right_tab;
        if (left_tab != undefined) forceTabChange('left', left_tab)
        if (right_tab != undefined) forceTabChange('right', right_tab)

        document.querySelectorAll('button.mode_btn').forEach(btn_ => {
            if (btn_.id != btn.id) {
                btn_.classList.remove('active')
            } else {
                btn_.classList.add('active')
            }
        })

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
    marker.on('click', () => triggerClickMode(1, { id, pos }))
    return marker
}

/**
 * Generates a new table row for a node inside the nodes table
 * @param {number} id Node index
 * @param {decimal} lat Latitude
 * @param {decimal} lng Longitude
 * @param {string} name Station name
 */
function createNodeTableEntry(id, lat, lng, name) {
    let child = document.createElement('tr')
    child.id = "node_" + id
    child.innerHTML = nodeTableEntry(id)
    document.getElementById('nodes').appendChild(child)

    document.getElementById(`node_${id}_name`).value = name
    document.getElementById(`node_${id}_name`).addEventListener('keypress', (e) => NodeNameInputEvent(e, `node_${id}_name`, id))
    onClick(`node_${id}_focus`, () => map.setView([lat, lng], 16))
    onClick(`node_${id}_display`, () => console.info(`lat: ${lat}; lng: ${lng}`))
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

/**
 * 
 * @param {number} id 
 * @param {decimal} lat 
 * @param {decimal} lng 
 * @param {string} name 
 */
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
    triggerClickMode(0x1, { pos })
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
        for (let _path in NETWORK.lines[_line].paths) onClick(`${_line}_${_path}`, () => selectPath(_line, _path))
        onClick(`line_${_line}_title`, () => document.querySelector(`#line_${_line}`).classList.toggle('collapsed'))
    }
}

// ---------------------
//  Path <-> Node logic
// ---------------------

/**
 * @param {number} nodeId ID of node, which shall be appended.
 */
function addNodeToCurrentPath(nodeId) {
    NETWORK.lines[selectedLinePath.line].paths[selectedLinePath.path].nodes.push(nodeId)
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
    pathPolylines.forEach(ppl => map.removeLayer(ppl))
    pathPolylines = []
}

function drawPaths() {
    for (var line in NETWORK.lines) {
        for (var path in NETWORK.lines[line].paths) {
            var pathObj = NETWORK.lines[line].paths[path]
            let latlngs = []
            const color = pathObj.color || line.color
            const style = pathObj.style || line.style

            for (let node in pathObj.nodes) {
                const id = pathObj.nodes[node]
                latlngs.push(NETWORK.nodes[id].position)
            }
            // TODO IMPL: do something with "const style"
            const options = {color: color, weight: pathObj.frequency/10, lineJoin: 'round'}
            let polyline = L.polyline(latlngs, options)
            pathPolylines.push(polyline)
            polyline.addTo(map)
        }
    }
}

/**
 * Completly redraws the paths
 * @param {boolean} shouldRedrawTreeList Should the tree list also get redrawn? Only required, if a new node has been added or a node got removed.
 */
function redrawPaths(shouldRedrawTreeList) {
    clearPathsFromScreen()
    drawPaths()
    if (shouldRedrawTreeList) generatePathTree()
}

document.querySelector('#create_line .btn').addEventListener('click', () => {
    const name = document.querySelector('#create_line #name').value
    const color = document.querySelector('#create_line #color').value
    const style = document.querySelector('#create_line #style').value

    createLine(name, color, style)
    createPath(name, 60, color, style)

    redrawPaths(true)
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
    NETWORK.nodes[id].name = document.getElementById(input_id).value
    redrawNodes()
}

onClick('clear_terminal', () => {
    document.getElementById('console').innerHTML = `<span class="green">INFO: Console cleared.</span>`
})

onClick('toggle_menu_text', () => {
    document.getElementById('top').classList.toggle('hide_text')
})

// ------------
//  File logic
// ------------

function saveToFile() {
    inputToNetwork()
    const networkString = JSON.stringify(NETWORK)
    downloadFile(networkString)
}

function loadFromFile() {
    openFileDialog(file => {
        try {
            readFile(file, txt => {
                NETWORK = JSON.parse(txt)

                networkToInput()
                redrawNodes()
                redrawPaths(true)
            })
        } catch (e) {
            console.log(file)
            console.error(e)
        }
    })
}

function openFileDialog(cb) {
    let input = document.createElement('input')
    input.type = 'file'
    input.onchange = _ => {
        cb(Array.from(input.files)[0])
    }
    input.click()
}

async function downloadFile(file) {
    var a = document.createElement("a")
    a.href = "data:text/json;base64," + btoa(file)
    a.download = "network.json"
    a.click()
}

function readFile(file, cb) {
    let read = new FileReader()
    read.readAsBinaryString(file)
    read.onloadend = () => cb(read.result)
}

onClick('save_file', () => saveToFile())
onClick('open_file', () => loadFromFile())
onClick('new_file', () => {
    if (!confirm("Are you sure you want to reset the network?")) return
    NETWORK = emptyNetwork()
    inputToNetwork()
    redrawNodes()
    redrawPaths()
})

// ------------
//  Properties
// ------------

properties = document.getElementById('properties')

/**
 * Generates the Properties window
 * @ignore Gets called by regenerateProperties(), which you should call instead.
 */
function generateProperties() {
    properties.appendChild(title(`Line "${selectedLinePath.line}"`))
    const line = NETWORK.lines[selectedLinePath.line]
    let lineProperties = ""
    lineProperties += keyValue("Colour", "text", "line_color", "CSS colour code")
    lineProperties += keySelect("Style", `<option>solid</option><option>dashed</option><option>dotted</option>`, 'line_style')
    properties.appendChild(div_with_id('div', 'line_properties', lineProperties))

    properties.getElementById('color').value = line.color
    properties.getElementById('style').value = line.style

    properties.appendChild(title(`Path #${selectedLinePath.path}`))
    const path = line.paths[selectedLinePath.path]
    let pathProperties = ""
    pathProperties += keyValue("Frequency", "number", "path_frequency", "Frequency in Minutes")
    pathProperties += keyValue("Colour", "text", "path_color", "CSS colour code")
    pathProperties += keySelect("Style", `<option>solid</option><option>dashed</option><option>dotted</option>`, 'path_style')
    properties.appendChild(div_with_id('div', 'path_properties', pathProperties))

    properties.getElementById('frequency').value = path.frequency
    properties.getElementById('color').value = path.color
    properties.getElementById('style').value = path.style
}

/**
 * Call everytime a selecttedLinePath changes.
 * @borrows from generateProperties()
 */
function regenerateProperties() {
    properties.innerHTML = ""
    generateProperties()
}