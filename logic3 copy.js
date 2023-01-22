// Create a map
let myMap = L.map("map", {
  center: [45.52, -1.67],
  zoom: 2
});

// add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// URL link to geojson file
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'


// create a function for the color choice based on earthquake depth
function markerColor(depth){
  console.log(depth);
  if (depth < 10) return '#fef0d9';
  else if (depth < 30) return '#fdd49e';
  else if (depth < 50) return '#fdbb84';
  else if (depth < 70) return '#fc8d59';
  else if (depth < 90) return '#e34a33';
  else return '#b30000';
}

// create a function for the size of marker based on earthquake magnitude
function markerSize(magnitude){
  return magnitude * 2.5;
}

// create a function to style the circle marker
function style_circle(feature){
  return {
    color: "black",
    weight: 0.25,
    fillColor: markerColor(feature.geometry.coordinates[2]),
    fillOpacity: 1,
    radius: markerSize(feature.properties.mag)
  }
}


// Perform a GET request to the query URL
d3.json(url).then(function(data) {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
      },
      style : style_circle,
    onEachFeature: function (feature, layer) {
      layer.bindPopup('<h1><u><font color="black">Location: '+feature.properties.place+'</h1> </u></font><h2>Magnitude: '+feature.properties.mag+'<p> Depth: '+feature.geometry.coordinates[2]+'</p></h2>');
  }}).addTo(myMap)});



// REMEMBER TO ADD A LEGEND FOR THE DEPTH COLORS

let legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {
let div = L.DomUtil.create('div', 'info legend'),
depth = [10,30,50,70,90];
labels = ['#fef0d9', '#fdd49e', '#fdbb84', '#e34a33', '#b30000']

for (var i = 0; i < depth.length; i++) {
  div.innerHTML += depth[i] + (" <img src="+ labels[i] +" height='50' width='50'>") +'<br>';
}

return div;
};

legend.addTo(map);