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
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);
  
    // Store API query variables
    var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
    
    // Grab the data with d3
    d3.json(baseURL, function(earthquakes) {
    console.log(earthquakes)

    // .features.geometry (style)
    function createFeatures(earthquakesData){
        return {fillColor: earthquakeColor(earthquakesData.geometry.coordinates[2]),
            radius: earthquakeRadius(earthquakesData.properties.mag)}
        }
    // .features.magnitude
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
    geojsonLayer = L.geoJson(earthquakesData, {
        style: createFeatures,
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng
            );
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.mag);
        }
    });
    
    map.addLayer(geojsonLayer);
     // Create a new marker cluster group

    // var markers = L.markerClusterGroup();
  
    // // Loop through data
    // for (var i = 0; i < response.length; i++) {
  
    //   // Set the data location property to a variable
    //   var location = response[i].location;
  
    //   // Check for location property
    //   if (location) {
  
    //     // Add a new marker to the cluster group and bind a pop-up
    //     markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
    //       .bindPopup(response[i].descriptor));
    //   }
  
    // }
  
    // // Add our marker cluster layer to the map
    // myMap.addLayer(markers);
  
  });
  