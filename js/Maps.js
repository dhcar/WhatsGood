function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(36.989031,-122.06446),
		zoom: 15
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);
}
