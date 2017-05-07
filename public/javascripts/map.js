$(function(){	
	L.mapbox.accessToken = 'pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw'; // Access token for Mapbox AP

	var map = L.mapbox.map('map', '', { // Creates new map and associated map id
		scrollWheelZoom: false, // Prevents scroll zoom
		center: [45.4456786,-75.9322124], // Centers map
		zoom: 10, // Zoom tile level
		minZoom: 10, 
		maxZoom: 20
	});

	//var layer = L.tileLayer.provider('Stamen.Watercolor').addTo(map);

	var tile_layer = L.tileLayer('https://api.mapbox.com/styles/v1/julconz/cj2du5082003a2rp671hlp2lu/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw').addTo(map);

	$.getJSON("http://localhost:3000/ottawa", function(data) {
		//console.log(JSON.stringify(data))
		/*map.addSource("map", {
	        "type": "geojson",
	        "data": {
	            "type": "Feature",
	            "geometry": "http://localhost:3000/ottawa"
	        }
    	});*/

    	L.geoJson(data).addTo(map)
	});
});