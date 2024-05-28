
var map = L.map('mapid', {
    crs: L.CRS.Simple, 
    minZoom: -5, 
    maxZoom: 5
});

var w = 6704,
    h = 4960;

var southWest = map.unproject([0, h], map.getMaxZoom());
var northEast = map.unproject([w, 0], map.getMaxZoom());
var bounds = new L.LatLngBounds(southWest, northEast);

L.imageOverlay('images/outroros v4.png', bounds).addTo(map);

map.setMaxBounds(bounds);
map.fitBounds(bounds);

var options = {
    lengthUnit: {
        factor: 0.044508,
        display: 'Miles',
        decimal: 2,
        label: 'Distance:'
    },
};
L.control.ruler(options).addTo(map);

// Debug function
map.on('click', function(e) {
    var latlng = e.latlng;
    console.log(latlng.lat + ', ' + latlng.lng);
});


function adjustMeasurement(totalDistance, conversionFactor) {
    return totalDistance * conversionFactor;
}

var markers = L.layerGroup().addTo(map);
var markerData = [];


var customIcon = L.icon({
    iconUrl: 'images/position-marker-blue.svg', // Substitua pelo caminho da sua imagem
    iconSize: [38, 38], // Tamanho do ícone
    iconAnchor: [19, 38], // Ponto de ancoragem (posição onde o ícone será ancorado)
    popupAnchor: [0, -38] // Ponto de ancoragem do popup em relação ao ícone
});

function addMarker(lat, lng, popupContent, title) {
    var marker = L.marker([lat, lng], {icon: customIcon}).addTo(markers);
    marker.bindPopup(popupContent, {className: 'marker-popup'});
    markerData.push({ marker: marker, title: title, lat: lat, lng: lng });
}

function updatePopupContent(popup, totalDistance, unit) {
    if (popup) {
        let content = popup.getContent();
        content = content.replace(/[\d.]+ mi/g, totalDistance.toFixed(2) + ' ' + unit);
        popup.setContent(content);
    }
}


// Markers:
//addMarker(-69.4375, 125.15625, "<b>Test</b><br><a href='https://example.com'>Lorem ipsun</a><br><img src='images/village.webp' alt='Example'>");
addMarker(-74.5625, 146.8125, "<b>Vilarejo de Morrinho</b><br>0 habitantes<br>", "Morrinho");
addMarker(-100.125, 117.75, "<b>Vilarejo de Buraco</b><br> 300 habitantes<br>", "Buraco");


// Show and hide Markers
var markersVisible = true;
function toggleMarkers() {
    if (markersVisible) {
        map.removeLayer(markers);
    } else {
        map.addLayer(markers);
    }
    markersVisible = !markersVisible;
}

// Button: Show and hide Markers 
L.easyButton('<img class="marker-button" src="images/position-marker.svg">', function(btn, map) {
    toggleMarkers();
}).addTo(map);



// Função para filtrar e exibir os resultados da busca
document.getElementById('search-input').addEventListener('input', function(e) {
    var searchQuery = e.target.value.toLowerCase();
    var results = markerData.filter(function(item) {
        return item.title.toLowerCase().includes(searchQuery);
    });
    displaySearchResults(results);
});

function displaySearchResults(results) {
    var searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    results.forEach(function(item) {
        var li = document.createElement('li');
        li.textContent = item.title;
        li.addEventListener('click', function() {
            map.setView([item.lat, item.lng], map.getMaxZoom());
            item.marker.openPopup();
            clearSearchResults();
        });
        searchResults.appendChild(li);
    });
}

function clearSearchResults() {
    var searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
}

// Event listener para limpar resultados de busca ao clicar fora da caixa de busca
document.addEventListener('click', function(e) {
    var searchBox = document.getElementById('search-box');
    if (!searchBox.contains(e.target)) {
        clearSearchResults();
        document.getElementById('search-input').value = '';
    }
});
