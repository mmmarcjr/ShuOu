var MapZoom = 15;
var MapTypeId = google.maps.MapTypeId.ROADMAP;

document.addEventListener("deviceready", onDeviceReady, false);

$(window).on("orientationchange",function()
{
	setContentPage1();
	setMapHeight();
});

function onDeviceReady() 
{
	setContentPage1();
	initGeoInfo();
	getCurrentPosition();
}


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


function showLoading()
{
	$.mobile.loading( 'show', {text: '', textVisible: 0, theme: 0, textonly: 0, html: ""});
}

function hideLoading()
{
	$.mobile.loading( "hide" );
}


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
		
	var screen = $("#p1Content").height();
	//$('#geoAddress').html($('#geoAddress').html() + ' - height:' + $("#geoAddress").height());
	var info = $("#geoAddress").height();
	$("#map").height(screen - info - 1);
}


function getCurrentPosition() 
{
	showLoading();
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
	var map = new google.maps.Map($('#map').get(0), mapConfig);
	map.addListener('zoom_changed', function() {
		MapZoom = map.getZoom();
	});
	google.maps.event.addListener(map, "maptypeid_changed", function() {
			MapTypeId = map.getMapTypeId();
	});
	new google.maps.Marker({map:map, position:LatLng, animation: google.maps.Animation.DROP});
	getAddress(LatLng);
}

function getAddress(LatLng)
{
	var localisation = new google.maps.Geocoder();
	localisation.geocode({"latLng" : LatLng}, function(address, status)
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			$('#geoAddress').html(address[0].formatted_address);
				setMapHeight();
		}
	});
}