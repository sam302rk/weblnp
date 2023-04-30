var map = L.map('map').setView([50.69, 9.77], 6.2)
let index = {}
let layers = []
const template = (name, text) => `<div class="hvrc" id="${name}"><span class="hvr">-> </span><a onclick="citySearchResultClick('${name}', 'main')">${text}</a></div>`

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; Ebou B., Justin O.'
}).addTo(map)

fetchText('kml/index.json', rawIndex => {
    index = JSON.parse(rawIndex)
    let results = ''
    index.cities.forEach(city => {
        results += template(city, city)
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
        results += template(city, city.replace(regex, `<b>${input}</b>`))
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

function loadLayer(name, layer) {
    layers.forEach(l => {
        map.removeLayer(l.layer)
        document.getElementById(l.name).classList.remove('active')
        layers.pop(l)
    })

    fetchKML(`kml/${name}/${layer}.kml`, r => {
        layers.push({ layer: r, name: name, add: layer })
        document.getElementById(name).classList.add('active')
        map.addLayer(r)

        // TODO: Make async
        for (let path of document.querySelectorAll('path.leaflet-interactive')) {
            path.setAttribute('stroke-width', '3')
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