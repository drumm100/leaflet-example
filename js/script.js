
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

function addMarker(lat, lng, popupContent) {
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(popupContent, {className: 'marker-popup'});
}

function adjustMeasurement(totalDistance, conversionFactor) {
    return totalDistance * conversionFactor;
}

function updatePopupContent(popup, totalDistance, unit) {
    if (popup) {
        let content = popup.getContent();
        content = content.replace(/[\d.]+ mi/g, totalDistance.toFixed(2) + ' ' + unit);
        popup.setContent(content);
    }
}


// Markers:
addMarker(-69.4375, 125.15625, "<b>Test</b><br><a href='https://example.com'>Lorem ipsun</a><br><img src='images/village.webp' alt='Example'>");
