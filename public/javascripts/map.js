$(function(){

	mapboxgl.accessToken = 'pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw'; // access token for Mapbox API

	// create map, define certain options
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/julconz/cj2du5082003a2rp671hlp2lu',
		center: [-75.71520, 45.419723],
		zoom: 12,
		maxZoom: 16,
		minZoom: 12
	});

	// when a city is selected
	$('#cities').on('change', function() {
		var city = this.value, // selected city
			url =  'http://localhost:3000/' + city; // the api url to get the city data
		$('#legend').show();
		if (city !== 'Select city') {
			$.getJSON(url, function(data) {
				// add the source
				var geojson = map.addSource(city + "-geojson", {
					'type': 'geojson',
					'data': data[0].data // geojson data from api url
				})

				// add layer from source
				map.addLayer({
					'id': city + '-geojson',
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



				map.on('click', city + '-geojson', function(e){
					$('#legend').html('<h4>Building Type</h4><div><span style="background-color: #00b3b3"></span>yes<br><span style="background-color: #003333"></span>other</div><br><strong>Area </strong>' + round(e.features[0].properties.area, 2) + ' m&sup2;<br><strong>Building type </strong>' + e.features[0].properties.building + '<br><strong>Centroid </strong>')
				});

				map.on('mouseenter', city + '-geojson', function () {
				    map.getCanvas().style.cursor = 'pointer';
				});

				
			});
		}
	});
	
});