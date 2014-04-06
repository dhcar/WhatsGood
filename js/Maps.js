var Map = {
	map : null,
	center : null,
	currentPos : null,
	MY_MAPTYPE_ID : 'custom_style',
	geocoder : null,
	markers : []
}

function initializeMap() {
  Map.geocoder = new google.maps.Geocoder();
  var featureOpts = [
    {
	    featureType: "poi",
	    elementType: "labels",
	    stylers: [
	      { visibility: "off" }
	    ]
	  }
  ];

  var mapOptions = {
    zoom: 15,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, Map.MY_MAPTYPE_ID]
    },
    mapTypeId: Map.MY_MAPTYPE_ID
  };

  Map.map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var styledMapOptions = {
    name: 'Custom Style'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  Map.map.mapTypes.set(Map.MY_MAPTYPE_ID, customMapType);

  mapCurrent();

  google.maps.event.addDomListener(Map.map, "idle", function(){
  	Map.center = Map.map.getCenter();
  });

  google.maps.event.addListener(Map.map, 'click', function(event) {
    addMarker(event.latLng);
  });

  $(window).resize(function(){
  	Map.map.setCenter(Map.center);
  });
}

function mapCurrent() {
	if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      Map.currentPos = Map.center = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      addMarker(Map.center, 'Current Location');

      Map.map.setCenter(Map.center);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function addMarker(location, title) {
	var image = title ? {
		url: 'images/music/kiss.jpg',
		// This marker is 20 pixels wide by 32 pixels tall.
		scaledSize: new google.maps.Size(20, 20),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0)
	} : null;
	var marker = new google.maps.Marker({
	  position: location,
	  map: Map.map,
	  title: title || "Click",
	  icon: image || null
	});
	Map.markers.push(marker);
}

function addAddressMarker(address) {
  Map.geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      addMarker(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function pinMarkers(map){
	for(var i = 0; i < Map.markers.length; ++i){
		Map.markers[i].setMap(map);
	}
}

function hideMarkers(){
	pinMarkers(null);
}

function showMarkers(){
	pinMarkers(null);
}

function clearMarkers(){
	hideMarkers();
	Map.markers = [];
	mapCurrent();
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: Map.map,
    position: new google.maps.LatLng(36.977598,-122.030495),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}