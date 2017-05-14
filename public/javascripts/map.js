$(function(){	
	L.mapbox.accessToken = 'pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw'; // access token for Mapbox API

	/*var map = L.mapbox.map('map', '', { // creates new map
		scrollWheelZoom: true, // prevents scroll zoom
		center: [45.4456786,-75.9322124], // centers map
		zoom: 10, // zoom tile level
		minZoom: 10, // minimum zoom
		maxZoom: 20 // maximum zoom
	});*/

	var map = L.map('map').setView([45.4202815,-75.6991386], 11);

	// create a tile layer
	L.tileLayer('https://api.mapbox.com/styles/v1/julconz/cj2du5082003a2rp671hlp2lu/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw').addTo(map);

	var tileOptions = {
		maxZoom: 20,  // max zoom to preserve detail on
		tolerance: 3, // simplification tolerance (higher means simpler)
		extent: 4096, // tile extent (both width and height)
		buffer: 64,	  // tile buffer on each side
		debug: 0,      // logging level (0 to disable, 1 or 2)
		indexMaxZoom: 4,        // max zoom in the initial tile index
		indexMaxPoints: 100000, // max number of points per tile in the index
		solidChildren: false    // whether to include solid tile children in the index
	};

	$('#cities').on('change', function() {
		var city = this.value,
			url =  'http://localhost:3000/' + city,// city the user selects 
			layer = ''; 

		if (city !== 'Select city') {
			// get the data from database and output onto map as geojson features
			$.getJSON(url, function(data) {
				for (i = 0; i < data.length; i++){
					if (data[i].type == "yes") {
						var color = "#a7b4ba";
					} else {
						var color = "#494e8a";
					}

					var style = {
					    "color": color,
					    "weight": 5,
					    "opacity": 0.65
					};

					/* This creates the content for the map's legend 
					var overlayMaps = {
						"Building Type",
						"Yes": "<div></si"
						"Other":
					};

					// This initiates the legend onto the map 
					L.control.layers("",overlayMaps, {
						collapsed: false,
						position: 'topright'
					}).addTo(map);*/

					// This modifies the features on the legend to have have checkboxes (only text)
					var checks = document.querySelectorAll('[type = "checkbox"]');
					checks[0].outerHTML = '<div type="checkbox" class="leaflet-control-layers-selector" disabled=""></div>'
					
		    		L.geoJson(data[i].geometry, {
					    style: style
					}).addTo(map)
		    		//geojsonvt(data[i], tileOptions)
		    	}
		    	//test.addTo(map)
			});
		}
	});
	
});