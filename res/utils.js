const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
})

function fetchText(url, reciever) {
    fetch(url).then(res => res.text()).then(text => reciever(text))
}

function fetchKML(url, trackReciever) {
    fetchText(url, kmltext => {
        parser = new DOMParser();
        kml = parser.parseFromString(kmltext, "text/xml");
        const track = new L.KML(kml)
        map.addLayer(track)
        trackReciever(track)
    })
}

function ifnul(inp, repl) {
    return (typeof inp === 'undefined') ? repl : inp
}

function sort(div) {
    var list = document.getElementById(div)
    var items = list.childNodes
    var sorter = []
    for (var i in items) if (items[i].nodeType == 1) sorter.push(items[i])

    sorter.sort((a, b) => {
        return a.innerHTML == b.innerHTML
            ? 0
            : (a.innerHTML > b.innerHTML ? 1 : -1)
    })

    for (i = 0; i < sorter.length; ++i) list.appendChild(sorter[i])
}

/**
 * @param {string} key 
 * @param {string} type 
 * @param {string} id 
 * @param {string} placeholder 
 * @returns A key-value element with the parameters filled in.
 */
function keyValue (key, type, id, placeholder) {
    return `<div class="key_value"><p>${key}</p> <input type="${type}" placeholder="${placeholder}" id="${id}" /></div>`
}
keySelect = (key, options, id) => `<div class="key_value"><p>${key}</p><select id="${id}">${options}</select></div>`
nodeTableEntry = id => `<td>${id}</td><td><button id="node_${id}_display">Display</button><button id="node_${id}_focus">Focus</button></td><td><input id="node_${id}_name" type="text" placeholder="Currently hidden"/></td>`

line_path_tree = (line, paths) =>
`<div id="line_${line}" class="line">
<div id="line_${line}_title" class="line_title"><i class="bi bi-caret-down-fill"></i><b>Line "${line}"</b></div>
<div id="line_${line}_nodes">
${paths}
</div></div>`
path_tree_child = (line, path) => `<div><input type="radio" name="current_path" id="${line}_${path}" /> <i class="bi bi-arrow-return-right"></i> Path #${path}</div>`

const node_size = 12
const metaKeys = [ 'city', 'network', 'country', 'company', 'year' ]

const hidden_node_icon = L.icon({
    iconUrl: "/res/editor/node_hidden.svg",
    iconSize: [node_size, node_size],
})

const station_node_icon = L.icon({
    iconUrl: "/res/editor/node_station.svg",
    iconSize: [node_size, node_size],
})

function onClick(id, el) {
    document.getElementById(id).addEventListener('click', el)
}

function title(msg) {
    let titleNode = document.createElement('h4')
    titleNode.innerText = msg
    return titleNode
}

function div_with_id(type, id, content) {
    let div = document.createElement(type)
    div.id = id
    div.innerHTML = content
    return div
}