$(function(){

	mapboxgl.accessToken = "pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw"; // access token for Mapbox API

	// create map, define certain options
	var map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/julconz/cj725p6pj1c272spmrrgseoly",
		center: [-123.1241, 49.2573],
		zoom: 12,
		maxZoom: 18,
		minZoom: 4
	});

	// when a data is selected build map layer
	$('.select-data').on('click', function() {
		$(this).toggleClass('button-activated')
		var selection = this.value, // selected city
			url = "http://localhost:3000/" + selection; // the api url to get the city data
		buildLayer(url);
	});

	// function that adds data to map as a layer
	function buildLayer(url){
		$.getJSON(url, function(data) {

			console.log(data[0].data)
			// add layer from source
			map.addLayer({
				"id": "data",
				"source": {
					"type": "geojson",
		            "data": data[0].data
		        },
		        "type": "fill",
		        "paint": {
					"fill-color": {
						property: "type",
						type: "categorical",
						default: "#FF99EC",
						stops: [
							["residential", "#514799"]
						]
					}
				}
			});
		});
	}
	
});