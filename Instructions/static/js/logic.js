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
    function earthquakeColor(earthquakesData){
        if(earthquakesData < 10){
            return "#FF7F50"            
        }
        else if(earthquakesData < 30){
            return "#6495ED"            
        }
        else if(earthquakesData < 50){
            return "#008B8B"            
        }
        else if(earthquakesData < 70){
            return "#DEB887"            
        }
        else if(earthquakesData < 90){
            return "#BDB76B"            
        }
        else {
            return "#FFE4C4"            
        }
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
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10,10,30,50,70,90];
        var colors = ["#FF7F50","#6495ED","#008B8B", "#DEB887", "#BDB76B", "#FFE4C4"];
       
        var legendInfo = 
        "<div class=\"labels\">" +
          "<div class=\"min\">" + grades[0] + "</div>" +
          "<div class=\"max\">" + grades[grades.length - 1] + "</div>" +
        "</div>";
  
    //   grades.forEach(function(limit, index) {
    //     div.innerHTML +="<li style='background-color: " + colors[index] + "'></li>"+ grades[index];

    //   });
        for (let index = 0; index < grades.length; index++) {
            div.innerHTML +="<li style='background-color: " + colors[index] + "'></li>"+ grades[index];
            
        }
    //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;        
    }
    // Adding legend to the map
    legend.addTo(myMap);
  });
  