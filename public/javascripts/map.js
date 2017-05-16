$(function(){

	mapboxgl.accessToken = 'pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw'; // access token for Mapbox API

	// create map, define certain options
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/julconz/cj2du5082003a2rp671hlp2lu',
		center: [-75.71520, 45.419723],
		zoom: 10
	});

	// when a city is selected
	$('#cities').on('change', function() {
		var city = this.value, // selected city
			url =  'http://localhost:3000/' + city; // the api url to get the city data

		if (city !== 'Select city') {
			$.getJSON(url, function(data) {
				// add the source
				var geojson = map.addSource(city + "-geojson", {
					'type': 'geojson',
					'data': data[0].data // geojson data from api url
				})

				// add layer from source
				map.addLayer({
					'id': city + '-geojson1',
					'type': 'fill',
					'source': city + '-geojson', // use the above geojson source
					'paint': {
						'fill-color': {
							property: 'building',
							type: 'categorical',
							default: '#003333',
							stops: [
								['yes', '#00b3b3']
							]
						}
					}
					//'filter': ['==', 'building', 'yes'], []
				})

				$('#legend').show();
			});
		}
	});
	
});