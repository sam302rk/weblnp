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
        document.getElementById('console').innerHTML += `<span class="green">INFO: ${txt}</span>`
        info(txt)
    }
})()

var map = L.map('map').setView([50.69, 9.77], 6.2)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    minZoom: 6,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | Network Editor'
}).addTo(map)

document.querySelectorAll("div.tabs").forEach(node => {
    node.querySelectorAll("button").forEach((children, idx) => {
        children.addEventListener('click', () => TabClickEvent(node.id.replace('tabs_', ''), idx))
    })
})

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

keyValue = (key, type, id) => `<div class="key_value">${key} <input type="${type}" id="${id}" /></div>`
nodeTableEntry = (id, lat, long) => `<tr><td>${id}</td><td>${lat}; ${long} <button id="node_${id}_focus">Focus</button></td><td><input id="node_${id}_name" type="text" placeholder="Currently hidden"/></td></tr>`

const node_size = 12

const hidden_node_icon = L.icon({
    iconUrl: "/res/editor/node_hidden.svg",
    iconSize: [node_size, node_size],
})

const station_node_icon = L.icon({
    iconUrl: "/res/editor/node_station.svg",
    iconSize: [node_size, node_size],
})

function CreateNode(id, lat, lng, name) {
    document.getElementById('nodes').innerHTML += nodeTableEntry(id, lat, lng)
    document.getElementById(`node_${id}_name`).value = name

    // node_${id}_name
    // node_${id}_focus

    document.getElementById(`node_${id}_name`).addEventListener('click', () => NodeNameInputClick(`node_${id}_name`, id))
    document.getElementById(`node_${id}_focus`).addEventListener('click', () => NodeFocusButtonClick(lat, lng))

    let options = {}
    options.icon = (name == "") ? hidden_node_icon : station_node_icon

    let marker = L.marker([lat, lng], options)
    marker.addTo(map)
    NETWORK.nodes.push({
        position: [lat, lng],
        name: name,
        _temp: {
            marker: marker
        }
    })
}

clickModes = {
    "create_hidden": (pos) => {
        CreateNode(NETWORK.nodes.length, pos.lat, pos.lng, prompt("Enter a name for this node.\n\n(Leave blank to hide it.)"))
    },
    "create_station": (pos) => {
        CreateNode(NETWORK.nodes.length, pos.lat, pos.lng, prompt("Enter a station name.\n\n(Leave blank to hide it.)"))
    },
    "delete": (pos) => {

    },
    "inactive": (pos) => {}
}

let mode = "inactive"

document.querySelectorAll('button.mode_btn').forEach(btn => {
    btn.addEventListener('click', () => {
        mode = btn.id
    })
})

map.on('click', (e) => {
    const pos = e.latlng
    clickModes[mode](pos)
})

function NodeNameInputClick(input_id, id) {
    const val = document.getElementById(input_id).value
    NETWORK.nodes[id].name = val
    NETWORK.nodes[id].marker.icon = (val == "") ? hidden_node_icon : station_node_icon
}

function NodeFocusButtonClick(lat, lng) {
    map.setView([lat, lng], 16)
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