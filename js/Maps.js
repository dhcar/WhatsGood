var map;

function initializeMap() {
  var mapOptions = {
    zoom: 15
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var image = {
	    url: 'images/music/kiss.jpg',
	    // This marker is 20 pixels wide by 32 pixels tall.
	    scaledSize: new google.maps.Size(20, 20),
	    // The origin for this image is 0,0.
	    origin: new google.maps.Point(0,0)
	  };

      var marker = new google.maps.Marker({
	      position: pos,
	      map: map,
	      title: 'Current Location',
	      icon: image
	  });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(36.977598,-122.030495),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}