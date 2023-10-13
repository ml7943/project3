// URL to earthquake data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// URL to tectonic plate boundaries data
const url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Function to visualize the earthquake and tectonic plate boundaries data  
async function Visualize() {
  let earthquakeData = await (await fetch(url)).json();
  let boundariesData = await (await fetch(url2)).json();

  var map = L.map('map').setView([0, 0], 2);

  // Define base map layers

  // Create a layer for outdoors view
  var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a layer for satellite view
  var satelliteLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Esri, DigitalGlobe, GeoEye, and the GIS User Community'
  });

  // Create a layer for grayscale view  
  var grayscaleLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Esri, DeLorme'  
  });

  // Create a layer for earthquake data
  var earthquakesLayer = L.layerGroup();

  // Loop through your earthquake data and create markers
  earthquakeData.features.forEach(function (earthquake) {
    var magnitude = earthquake.properties.mag;
    var depth = earthquake.geometry.coordinates[2];

    // Define the marker size and color based on magnitude and depth
    var markerSize = magnitude * 5;
    var markerColor = getColor(depth);

    // Create a marker
    var marker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      radius: markerSize,
      fillColor: markerColor,
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });

    // Add a popup with earthquake information
    marker.bindPopup(
      "Magnitude: " + magnitude.toFixed(1) + "<br>" +
      "Depth: " + depth.toFixed(1) + " km"
    );

    // Add the marker to the earthquake layer
    marker.addTo(earthquakesLayer);
  });

  // Create a layer for tectonic plate boundaries
  var boundariesLayer = L.geoJSON(boundariesData);

  // Create a legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [-10, 30, 50, 70, 90];
    var colors = ['#FF5733', '#FF8333', '#FFAE33', '#FFD733', '#FFF333', '#D7FF33'];

    div.innerHTML += "<h4 style='margin:4px'>Earthquake Depth</h4>";
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + (grades[i + 1] - 1) + '</i><br>' : '+');
    }

    return div;
  };

  legend.addTo(map);

  // Function to determine marker color based on depth
  function getColor(depth) {
    var colors = ['#FF5733', '#FF8333', '#FFAE33', '#FFD733', '#FFF333', '#D7FF33'];
    for (var i = 0; i < colors.length; i++) {
      if (depth < (i + 1) * 20) {
        return colors[i];
      }
    }
    return colors[colors.length - 1];
  }

  // Define an object to hold the base map layers
  var baseMaps = {
    "Satellite": satelliteLayer,
    "Grayscale": grayscaleLayer,
    "Outdoors": osmLayer,
  };

  // Set the default base map
  osmLayer.addTo(map);

  // Create a layer control for base maps and overlay layers
  var overlayMaps = {
    "Earthquakes": earthquakesLayer,
    "Tectonic Plate Boundaries": boundariesLayer
  };

  L.control.layers(baseMaps, overlayMaps).addTo(map);

  // Event listener for base map radio buttons
  document.querySelectorAll('.base-map-radio input').forEach(function (input) {
    input.addEventListener('change', function () {
      var selectedBaseMap = document.querySelector('.base-map-radio input:checked').value;
      baseMaps[selectedBaseMap].addTo(map);
      Object.values(baseMaps).forEach(function (layer) {
        if (layer !== baseMaps[selectedBaseMap]) {
          map.removeLayer(layer);
        }
      });
    });
  });
}

// Call the Visualize function
Visualize();