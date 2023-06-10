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

var map = L.map('map').setView([50.69, 9.77], 6.2)

var layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 6,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | Network Editor'
})

layer.addTo(map)

document.querySelectorAll("div.tabs").forEach(node => {
    node.querySelectorAll("button").forEach((children, idx) => {
        children.addEventListener('click', () => TabClickEvent(node.id.replace('tabs_', ''), idx))
    })
})

let markers = []

let NETWORK = EmptyNetwork()

function EmptyNetwork() {
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
        "action": args => CreateNode(NETWORK.nodes.length, args.pos.lat, args.pos.lng, '')
    },
    "delete": {
        "mode": "marker",
        "action": args => {
            NETWORK.nodes.splice(args.id, 1)
            regenerateNodes()
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

function fireModeEvent(required_mode, args) {
    const mode = clickModes[selectedClickMode]
    if (mode.mode == required_mode) mode.action(args)
}

keyValue = (key, type, id) => `<div class="key_value">${key} <input type="${type}" id="${id}" /></div>`
nodeTableEntry = id => `<tr id="node_${id}"><td>${id}</td><td><button id="node_${id}_display">Display</button><button id="node_${id}_focus">Focus</button></td><td><input id="node_${id}_name" type="text" placeholder="Currently hidden"/></td></tr>`

const node_size = 12

const hidden_node_icon = L.icon({
    iconUrl: "/res/editor/node_hidden.svg",
    iconSize: [node_size, node_size],
})

const station_node_icon = L.icon({
    iconUrl: "/res/editor/node_station.svg",
    iconSize: [node_size, node_size],
})

function CreateNodeMarker(id, lat, lng, name) {
    const pos = [lat, lng]

    let options = {}
    options.icon = (name == "") ? hidden_node_icon : station_node_icon

    let marker = L.marker(pos, options)
    marker.on('click', () => fireModeEvent('marker', { id, pos }))
    return marker
}

function CreateNodeTableEntry(id, lat, lng, name) {
    document.getElementById('nodes').innerHTML += nodeTableEntry(id)
    document.getElementById(`node_${id}_name`).value = name
    document.getElementById(`node_${id}_name`).addEventListener('keypress', (e) => NodeNameInput(e, `node_${id}_name`, id))
    document.getElementById(`node_${id}_focus`).addEventListener('click', () => map.setView([lat, lng], 16))
    document.getElementById(`node_${id}_display`).addEventListener('click', () => console.info(`lat: ${lat}; lng: ${lng}`))
}

function regenerateNodes() {
    markers.forEach(marker => {
        marker.removeFrom(map)
    })
    
    markers = []
    document.getElementById('nodes').innerHTML = ""

    NETWORK.nodes.forEach((node, idx) => {
        CreateNodeTableEntry(idx, node.position[0], node.position[1], node.name)
        
        let nodeMarker = CreateNodeMarker(idx, node.position[0], node.position[1], node.name)
        markers.push(nodeMarker)
        nodeMarker.addTo(map)
    })
}

function CreateNode(id, lat, lng, name) {
    CreateNodeTableEntry(id, lat, lng, name)

    let marker = CreateNodeMarker(id, lat, lng, name)

    markers.push(marker)
    marker.addTo(map)

    NETWORK.nodes.push({
        position: [lat, lng],
        name: name
    })
}

document.querySelectorAll('button.mode_btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedClickMode = btn.id
    })
})

map.on('click', (e) => {
    const pos = e.latlng
    fireModeEvent("map", { pos });
})

function NodeNameInput(e, input_id, id) {
    if (e.key != "Enter") return
    console.log(document.getElementById(input_id).value)
    NETWORK.nodes[id].name = document.getElementById(input_id).value
    regenerateNodes()
}

function TabClickEvent(list_id, tab_id) {
    const tab_content_id = `tab_content_${list_id}_${tab_id}`
    const tab_content_query = `.tab_content_${list_id}`
    const list_element = `tabs_${list_id}`
    if (document.getElementById(tab_content_id).className.includes('hidden')) {
        document.querySelectorAll(tab_content_query).forEach(el => el.classList.add('hidden'))
        document.getElementById(tab_content_id).classList.remove('hidden')

        document.getElementById(list_element).querySelectorAll('button').forEach((btn, idx) => {
            if (idx == tab_id) btn.classList.add('active')
            else btn.classList.remove('active')
        })
    }
}

document.getElementById('clear_terminal').addEventListener('click', () => {
    document.getElementById('console').innerHTML = `<span class="green">INFO: Console cleared.</span>`
})

document.getElementById('toggle_menu_text').addEventListener('click', () => {
    document.getElementById('top').classList.toggle('hide_text')
})