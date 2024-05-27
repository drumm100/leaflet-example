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

L.imageOverlay('images/outroros v4.png/', bounds).addTo(map);

map.setMaxBounds(bounds);
map.fitBounds(bounds);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: false,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: true
    }
});
map.addControl(drawControl);

function calculateDistance(latlng1, latlng2) {
    return map.distance(latlng1, latlng2);
}

var points = [];

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
    
    if (layer instanceof L.Marker) {
        points.push(layer.getLatLng());
        
        if (points.length == 2) {
            var distance = calculateDistance(points[0], points[1]);
            alert('Distance is : ' + distance.toFixed(2) + ' km');
            points = [];
        }
    }
});