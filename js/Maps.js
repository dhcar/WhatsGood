var Map = {
	map : null,
	center : null,
	MY_MAPTYPE_ID : 'custom_style',
	geocoder : null,
	currMarker : null,
	soloToggle : true,
	soloMarkers : [],
	eventToggle : true,
	eventMarkers : []
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
    mapTypeId: Map.MY_MAPTYPE_ID,
    disableDoubleClickZoom : true
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

  google.maps.event.addListener(Map.map, 'dblclick', function(event) {
    addEventMarker(event.latLng, 'Event');
    hackUINavigation('#make-event');
  });

  $(window).resize(function(){
  	Map.map.setCenter(Map.center);
  });
  var el = document.getElementById("poop");
  el.addEventListener("touchend", handleEnd, false);
}

function mapCurrent() {
	if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      Map.center = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      addPersonalMarker(Map.center, 'Current Location');

      Map.map.setCenter(Map.center);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function addEventMarker(location, title) {
	var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      // '<h1 id="firstHeading" class="firstHeading">Event Name</h1>'+
      '<div id="bodyContent">'+
      '<b>Event Name</b> : '+
      'Content'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
  });

	var image = {
		url: 'images/Group.png',
		// This marker is 20 pixels wide by 32 pixels tall.
		scaledSize: new google.maps.Size(20, 20),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0)
	};
	var marker = new google.maps.Marker({
	  position: location,
	  map: Map.map,
	  title: title,
	  icon: image
	});
  google.maps.event.addListener(marker, 'click', function() {
  	console.log(this);
    infowindow.open(Map.map,marker);
  });
	Map.eventMarkers.push(marker);
}

function addSoloMarker(location, title) {
	var image = {
		url: 'images/People.png',
		// This marker is 20 pixels wide by 32 pixels tall.
		scaledSize: new google.maps.Size(20, 20),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0)
	};
	var marker = new google.maps.Marker({
	  position: location,
	  map: Map.map,
	  title: title,
	  icon: image
	});
	Map.soloMarkers.push(marker);
}

function addPersonalMarker(location, title) {
	var image = {
		url: 'images/Location.png',
		// This marker is 20 pixels wide by 32 pixels tall.
		scaledSize: new google.maps.Size(20, 20),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0)
	};
	if(Map.currMarker) Map.currMarker.setMap(null);
	Map.currMarker = new google.maps.Marker({
	  position: location,
	  map: Map.map,
	  title: title,
	  icon: image
	});
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

function toggleMarkers(isSolo){
	if (isSolo){
		if (Map.soloToggle){
			hideMarkers(true);
		} else {
			showMarkers(true);
		}
		Map.soloToggle = !Map.soloToggle;
	} else {
		if (Map.eventToggle){
			hideMarkers(false);
		} else {
			showMarkers(false);
		}
		Map.eventToggle = !Map.eventToggle;
	}
}

function pinSoloMarkers(map){
	for(var i = 0; i < Map.soloMarkers.length; ++i){
		Map.soloMarkers[i].setMap(map);
	}
}

function pinEventMarkers(map){
	for(var i = 0; i < Map.eventMarkers.length; ++i){
		Map.eventMarkers[i].setMap(map);
	}
}

function showMarkers(isSolo){
	if(isSolo)
		pinSoloMarkers(Map.map);
	else
		pinEventMarkers(Map.map);
}

function hideMarkers(isSolo){
	if(isSolo)
		pinSoloMarkers(null);
	else
		pinEventMarkers(null);
}

function clearMarkers(isSolo){
	if(isSolo){
		hideMarkers(true);
		Map.soloMarkers = [];
		mapCurrent();
	}else{
		hideMarkers(false);
		Map.eventMarkers = [];
		mapCurrent();
	}
}

function removeLastMarker(isSolo){
	if(isSolo){
		Map.soloMarkers[Map.soloMarkers.length-1].setMap(null);
		Map.soloMarkers.remove(Map.soloMarkers.length-1);
	}else{
		Map.eventMarkers[Map.eventMarkers.length-1].setMap(null);
		Map.eventMarkers.remove(Map.eventMarkers.length-1);
	}
}

function hackUINavigation(destinationHref){
    $(destinationHref).addClass('navigable');
    var destination = $(destinationHref);
    $.UIGoToArticle(destination);
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
  Map.map.setCenter(options.position);
}