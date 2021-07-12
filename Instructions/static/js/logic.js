    // Creating map object
    var myMap = L.map("mapid", {
        center: [40.7, -73.95],
        zoom: 11
    });
    
    // Adding tile layer to the map
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox-streets-v8",
        accessToken: "pk.eyJ1IjoiYW5pZW1pZWMiLCJhIjoiY2txdThqd2lhMDIzajJwcGFzbndndDQwciJ9.Z077oo1U8_51TiBVmpp1gw"
    }).addTo(myMap);
    // L.tileLayer("https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/1/0/0.mvt?access_token=pk.eyJ1IjoiYW5pZW1pZWMiLCJhIjoiY2txdThqd2lhMDIzajJwcGFzbndndDQwciJ9.Z077oo1U8_51TiBVmpp1gw").addTo(myMap)

    // Store API query variables
    var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
    
    // Grab the data with d3
    d3.json(baseURL, function(earthquakes) {
    // console.log(earthquakes)

    // features.geometry (style)
    function createFeatures(earthquakesData){
        return {fillColor: earthquakeColor(earthquakesData.geometry.coordinates[2]),
            radius: earthquakeRadius(earthquakesData.properties.mag)}
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
        return earthquakesData *2        
    }
    // geojson
    geojsonLayer = L.geoJson(earthquakes, {
        style: createFeatures,
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng
            );
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.mag);
        }
    });
    
    myMap.addLayer(geojsonLayer);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10,10,30,50,70,90];
        var colors = ["#FF7F50","#6495ED","#008B8B", "#DEB887", "#BDB76B", "#FFE4C4"];
        var labels = []

        var legendInfo = 
        "<div class=\"labels\">" +
          "<div class=\"min\">" + grades[0] + "</div>" +
          "<div class=\"max\">" + grades[grades.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;  
      grades.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;        
    }
    // Adding legend to the map
    legend.addTo(myMap);
  });
  