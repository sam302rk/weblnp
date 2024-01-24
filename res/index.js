var map = L.map('map').setView([50.69, 9.77], 6.2)
let index = {}
let layers = []
const template = (name, text, icon) => `<div class="hvrc" id="${name}"><span class="hvr">-> </span><a onclick="citySearchResultClick('${name}', 'main')">${icon.exists ? `<img class="city_icon" src="/kml/${name}/${icon.url}">` : ''} ${tryTranslation(text)}</a></div>`
let currentMetadata = {}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    minZoom: 6,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; Ebou B., Justin O.'
}).addTo(map)

fetchText('kml/index.json', rawIndex => {
    index = JSON.parse(rawIndex)
    let results = ''
    index.cities.forEach(city => {
        results += generateCity(city, city)
    })
    overwriteResults(results)
})

document.getElementById('citysearch_input').addEventListener('input', () => {
    let results = ''
    const input = document.getElementById('citysearch_input').value
    const regex = new RegExp(`^${input}`, 'i')
    let matchingCities = index.cities.filter(city => {
        let result = regex.test(city)
        return result
    })

    matchingCities.forEach(city => {
        results += generateCity(city, city.replace(regex, `<b>${input}</b>`))
    })

    overwriteResults(results)
})

document.getElementById('variantSet').addEventListener('click', () => {
    const value = document.getElementById('variantSel').value
    if (value == 'Choose a map') return
    loadLayer(index.currentCity, value)
    document.getElementById('variant_container').classList.add('hide')
})

document.getElementById('show_search_window').addEventListener('click', () => {
    document.getElementById('search_container').classList.remove('mobile_hide')
    document.getElementById('search_btn_container').classList.add('mobile_hide')
})

function generateCity(city, readable) {
    let icon_data = { exists: false, url: '' }

    if (index.cityData[city] && index.cityData[city].icon) {
        icon_data.exists = true
        icon_data.url = index.cityData[city].icon
    }
    
    return template(city, readable, icon_data)
}

function loadLayer(name, layer) {
    layers.forEach(l => {
        map.removeLayer(l.layer)
        document.getElementById(l.name).classList.remove('active')
        layers.pop(l)
    })

    fetchText(`kml/${name}/${layer}.json`, jsonText => {
        currentMetadata = JSON.parse(jsonText)
    })

    fetchKML(`kml/${name}/${layer}.kml`, track => {
        layers.push({ layer: track, name: name, add: layer })
        document.getElementById(name).classList.add('active')

        map.addLayer(track)

        // TODO: Make async
        for (let path of document.querySelectorAll('path.leaflet-interactive')) {
            path.setAttribute('stroke-width', '5')
        }
    })
}

function citySearchResultClick(name) {
    if (ifnul(index.currentCity)) document.getElementById(index.currentCity).classList.remove('active')
    index.currentCity = name
    document.getElementById(`${name}`).classList.add('active')

    document.getElementById('search_container').classList.add('mobile_hide')
    document.getElementById('search_btn_container').classList.remove('mobile_hide')

    if (!index.cityData[name]) {
        document.getElementById('variant_container').classList.add('hide')
        return loadLayer(name, 'main')
    }

    document.getElementById('variant_container').classList.remove('hide')

    let options = ''
    index.cityData[name].variants.forEach(v => {
        options += `<option>${v}</option>`
    })

    document.getElementById('variantSel').innerHTML = options
    sort('variantSel')
    document.getElementById('variantSel').innerHTML = `<option>${tryTranslation('options.layer.default')}</option>` + document.getElementById('variantSel').innerHTML
}

function overwriteResults(content) {
    document.getElementById('citysearch_results').innerHTML = content
    sort('citysearch_results')
}

// Usage not recommended
function sat() {
    L.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '<a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
    }).addTo(map)
}

function hasMetadata(name) {
    return currentMetadata[name] != undefined
}

function renderPopup(name) {
    const meta = currentMetadata[name]
    let stationBody = ''
    let textColor = ''
    if (meta.textColor != undefined) textColor = `color: ${meta.textColor} !important;`
    for (const station of meta.stations) stationBody += `<div class="popup_station"><img src="/res/node.svg"><p>${station}</p></div>\n`
    return `<h2><span class="line ${meta.style}" style="background-color: ${meta.color}; ${textColor}">${meta.line}</span> ${meta.stations[0]} - ${meta.stations[meta.stations.length - 1]}</h2>
    <div class="popup_station_list">${stationBody}<p class="meta">${tryTranslation("line.popup.operated_by")+meta.operator}</p></div>`
}