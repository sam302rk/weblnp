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

//networkToInput()

// -------------------
//  Click modes logic
// -------------------

// 0x001 - map click
// mode, { latlng }

// 0x010 - node click
// mode, { latlng, id }

// 0x100 - polyline click
// mode, { line, path }
const clickModes = {
    "select": {
        "mode": 0x110,
        "action": (mode, args) => {
            if (mode == 0x010) {
                console.log(`Node with ID ${args.id} "${NETWORK.nodes[args.id].name}" @ ${args.pos}`.replace(' ""', ''))
                // TODO: node properties
            } else {
                // TODO: line/path properties
            }
        }
    },
    "create": {
        "mode": 0x001,
        "left_tab": 0,
        "action": (mode, args) => {
            createNode(NETWORK.nodes.length, args.pos.lat, args.pos.lng, '')
        }
    },
    "delete": {
        "mode": 0x010,
        "left_tab": 0,
        "action": (mode, args) => {
            NETWORK.nodes.splice(args.id, 1)
            redrawNodes()
        }
    },
    "add": {
        "mode": 0x010,
        "left_tab": 2,
        "action": (mode, args) => {
            addNodeToCurrentPath(args.id)
            redrawPaths()
        }
    }
}

let selectedClickMode = "select"

function triggerClickMode(event_mode, args) {
    let mode = clickModes[selectedClickMode]
    if (bitwise_check(mode.mode, event_mode)) mode.action(event_mode, args)
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
    marker.on('click', () => triggerClickMode(0x010, { id, pos }))
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
    triggerClickMode(0x001, { pos })
})

// ------------
//  Line logic
// ------------

/*let selectedLinePath = {
    any_selected: false,
    line: "",
    path: 0
}*/

let currentSelection = {
    type: 'map', // Map, Node, Path
    data: {} 
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
    currentSelection = {
        type: 'path',
        data: { line, path }
    }
}

// ----------------
//  Hierachy logic
// ----------------

function generateHierarchy(hide_nodes) {
    const rowTemplate = inp => `<tr><td>${inp}</td></tr>`
    const contextMenu = `<a class="right"><i class="bi bi-sliders"></i> <i class="bi bi-trash"></i></a>`
    const lineTemplate = (l, lo) => `<p class="h line" style="color: ${lo.color};"><i class="bi bi-minecart"></i> Line "${l}" ${contextMenu}</p>`
    const pathTemplate = (p, po) => `<p class="h path" style="color: ${po.color};"><i class="bi bi-share"></i> Path #${p} (every ${po.frequency}min)  ${contextMenu}</p>`
    const nodeTemplate = (n, ni, no) => `<p class="h node"><i class="bi bi-node-plus"></i> ${Number.parseInt(n)+1}. Node ${ni} "${no.name}"  ${contextMenu}</p>`.replace(' ""', '')
    let content = ""

    for (const line in NETWORK.lines) {
        const lineObj = NETWORK.lines[line]
        content += rowTemplate(lineTemplate(line, lineObj))
        
        for (const path in lineObj.paths) {
            const pathObj = lineObj.paths[path]
            content += rowTemplate(pathTemplate(path, pathObj))

            for (const node in pathObj.nodes) {
                const nodeIndex = pathObj.nodes[node]
                const nodeObj = NETWORK.nodes[nodeIndex]

                if (hide_nodes && nodeObj.name == "") console.log(`Skipped node '${nodeIndex}' at position ${node}`)
                else content += rowTemplate(nodeTemplate(node, nodeIndex, nodeObj))
            }
        }
    }
    return `<table><tbody>${content}</tbody></table>`
}

function regenerateHierarchy(hide_nodes) {
    document.getElementById('hierarchy').innerHTML = generateHierarchy(hide_nodes)
}

onClick('refresh_hierarchy', () => {
    regenerateHierarchy(false)
})

// ---------------------
//  Path <-> Node logic
// ---------------------

/**
 * @param {number} nodeId ID of node, which shall be appended.
 */
function addNodeToCurrentPath(nodeId) {
    if (currentSelection.type == 'path') {
        NETWORK.lines[currentSelection.data.line].paths[currentSelection.data.path].nodes.push(nodeId)
    } else {
        console.error('You need to select a path.')
    }
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
            polyline.on('click', () => triggerClickMode(0x100, { line, path }))
            pathPolylines.push(polyline)
            polyline.addTo(map)
        }
    }
}

/**
 * Completly redraws the paths
 * @param {boolean} shouldRedrawTreeList Should the tree list also get redrawn? Only required, if a new node has been added or a node got removed.
 */
function redrawPaths() {
    clearPathsFromScreen()
    drawPaths()
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
    const parentLine = document.querySelector('#create_path #parent_line_id').value
    const frequency = Number.parseInt(document.querySelector('#create_path #frequency').value)
    const color = document.querySelector('#create_path #color').value
    const style = document.querySelector('#create_path #style').value

    createPath(parentLine, frequency, color, style)

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

                try {
                    // FIXME
                    networkToInput()
                } catch(e) {
                    console.log('networkToInput broken')
                }
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

let propertiesHandler = {
    "map": {
        "generate": (div) => {
            let innerHtml = `<h4>Network</h4>`
            innerHtml += keyValue('City', 'text', 'meta_city', 'ex. Karlsruhe, ...')
            innerHtml += keyValue('Network', 'text', 'meta_network', 'ex. Tram, Bus, ...')
            innerHtml += keyValue('Country', 'text', 'meta_country', 'ex. Germany, ...')
            innerHtml += keyValue('Company', 'text', 'meta_company', 'ex. VBK, AVG, ...')
            innerHtml += keyValue('Year', 'number', 'meta_year', 'ex. 1981, 2006, ...')
            div.innerHTML = innerHtml
            return div
        },
        "save": () => {

        }
    },
    "node": {
        "generate": (div) => {
            let innerHtml = `<h4>Node ${currentSelection.data.id}</h4>`
            return div
        },
        "save": () => {
            
        }
    },
    "path": {
        "generate": (div) => {
            let innerHtml = `<h4>Path ${currentSelection.data.path}</h4><p>(Line ${currentSelection.data.line})</p>`
            return div
        },
        "save": () => {
            
        }
    }
}

/**
 * Generates the Properties window
 * @ignore Gets called by regenerateProperties(), which you should call instead.
 */
function generateProperties() {
    properties.appendChild(
        propertiesHandler[currentSelection.type].generate(document.createElement('div')))
}

/**
 * Call everytime a selecttedLinePath changes.
 * @borrows from generateProperties()
 */
function regenerateProperties() {
    properties.innerHTML = ""
    generateProperties()
}