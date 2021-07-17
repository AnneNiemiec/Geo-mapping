    console.log('');
    // Creating map object
    var myMap = L.map("map", {
        center: [40.7, -73.95],
        zoom: 3
    });
    
    // Adding tile layer to the map
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);
    
    // Store API query variables
    var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
    
    // Grab the data with d3
    d3.json(baseURL, function(earthquakes) {
    // console.log(earthquakes)

    // features.geometry (style)
    function createFeatures(earthquakesData){
        return {fillColor: earthquakeColor(earthquakesData.geometry.coordinates[2]),
            radius: earthquakeRadius(earthquakesData.properties.mag),
            opacity: 1,
            fillOpacity: 1,
            color: "#000000"
        }
            
        }
    // features.magnitude
    function earthquakeColor(d) {
        return d > 90 ? '#800026' :
               d > 70  ? '#BD0026' :
               d > 50  ? '#E31A1C' :
               d > 30  ? '#FC4E2A' :
               d > 10   ? '#FD8D3C' :
                         '#FEB24C';
    }
    // earthquakeRadius
    function earthquakeRadius(earthquakesData){
        return earthquakesData *3        
    }
    // geojson
    L.geoJson(earthquakes, {
        style: createFeatures,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("magnitude " + feature.properties.mag);
        }
    }).addTo(myMap);
    
    // myMap.addLayer(geojsonLayer);

    // Set up the legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90]
               
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + earthquakeColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
     // Adding legend to the map
    legend.addTo(myMap);

  });
  