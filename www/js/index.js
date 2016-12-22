var map;
var marker;
var MapZoom = 15;
var MapTypeId = google.maps.MapTypeId.ROADMAP;

$(window).on("orientationchange",function()
{
	SetContentHeight();
	setTimeout(function() { SetContentHeight(); }, 100 );
	setTimeout(function() { SetContentHeight(); }, 800 );
});

function SetContentHeight()
{
	setContentPage1(); 
	setMapHeight(); 
	if (marker === undefined)
		map.setCenter(marker.getPosition());
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() 
{
	setContentPage1();
	initGeoInfo();
	getCurrentPosition();
}

function Locate()
{
	setContentPage1();
	initGeoInfo();
	getCurrentPosition();
}



// Info
function initGeoInfo()
{
	$('#geoAddress').html('Loading Current Position ...');
	$('#geoLatitude').html('');
	$('#geoLongitude').html('');
	$('#geoAltitude').html('');
	$('#geoAccuracy').html('');
	$('#geoAlAc').html('');
	$('#geoSpeed').html('');
	$('#geoTimestamp').html('');
	$('#map').html('');
}

function setGeoInfo(position)
{
	$('#geoLatitude').html(position.coords.latitude);
	$('#geoLongitude').html(position.coords.longitude);
	$('#geoAltitude').html(position.coords.altitude);
	$('#geoAccuracy').html(position.coords.accuracy);
	$('#geoAlAc').html(position.coords.altitudeAccuracy);
	$('#geoSpeed').html(position.coords.speed);
	$('#geoTimestamp').html(position.timestamp);
}

function setGeoInfoLatLong(position)
{
	$('#geoLatitude').html(position.lat());
	$('#geoLongitude').html(position.lng());
	$('#geoAltitude').html('');
	$('#geoAccuracy').html('');
	$('#geoAlAc').html('');
	$('#geoSpeed').html('');
	$('#geoTimestamp').html('');
}


// Loading
function showLoading()
{
	$.mobile.loading( 'show', {text: '', textVisible: 0, theme: 0, textonly: 0, html: ""});
}

function hideLoading()
{
	$.mobile.loading( "hide" );
}


// Desing display
function setContentPage1()
{
	if ($.mobile.activePage.attr( "id" ) != "page1")
		return;
		
	var screen = $.mobile.getScreenHeight(); 
	var header = $("#p1Header").outerHeight();
	var footer = $("#p1footer").outerHeight();
	var contentCurrent = $("#p1Content").outerHeight() - $("#p1Content").height();
	var content = screen - header - footer - contentCurrent;
	$("#p1Content").height(content);
}

function setMapHeight()
{
	if ($.mobile.activePage.attr( "id" ) != "page1")
		return;
	
	var content = $("#p1Content").height();
	var info = $("#geoAddress").outerHeight();
	$("#map").height(content - info);
}


// GPS
function getCurrentPosition() 
{
	showLoading();
	marker = undefined;
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 1000, timeout: 5000, enableHighAccuracy: true } );
}

var onSuccess = function(position) 
{
	setGeoInfo(position);
	setMapHeight();
	showMap(position.coords.latitude, position.coords.longitude);
	hideLoading();
};

function onError(error) 
{
	$('#geoAddress').html('ERROR<br />Code: ' + error.code + '<br />Message: ' + error.message);
	hideLoading();
}


function showMap(latitude, longitude)
{
	var LatLng = new google.maps.LatLng(latitude, longitude);
	var mapConfig = {zoom:MapZoom, center:LatLng, mapTypeId:MapTypeId}
	map = new google.maps.Map($('#map').get(0), mapConfig);
	
	map.addListener('zoom_changed', function() {
		MapZoom = map.getZoom();
	});
	google.maps.event.addListener(map, "maptypeid_changed", function() {
		MapTypeId = map.getMapTypeId();
	});
	
	placeMarker(LatLng);
	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
  });
}

function placeMarker(location) 
{
	if (marker === undefined)
		marker = new google.maps.Marker({map:map, position:location, animation: google.maps.Animation.DROP});
	else
	{
		marker.setPosition(location);
		setGeoInfoLatLong(location);
	}
	getAddress(location);
}

function getAddress(LatLng)
{
	var localisation = new google.maps.Geocoder();
	localisation.geocode({"latLng" : LatLng}, function(address, status)
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			$('#geoAddress').html(address[0].formatted_address);
			//setMapHeight();
		}
	});
}