function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(36.98217, 122.01533),
		zoom: 8
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);