// Zoe Rudd, rudd0083
//API Key: AIzaSyC9ozTUWaQ4pdzkV6AJ7QMeCbIphQUuhGE
function mouseOver(id) {
	if (id == 'img1') 
	{
		document.getElementById("img1").style.display = "inline-block";
		//document.getElementById("cImg").src="img/northrop.jpg";
	}
	else if (id == 'img2'){
		document.getElementById("img2").style.display = "inline-block";
		//document.getElementById("cImg").src="img/keller.jpg";
	}
	else if (id == 'img3'){
		document.getElementById("img3").style.display = "inline-block";
		//document.getElementById("cImg").src="img/folwell.jpg";
	}
	else if (id == 'img4'){
		document.getElementById("img4").style.display = "inline-block";
		//document.getElementById("cImg").src="img/Shepherd.jpg";
	}
	else if (id == 'img5'){
		document.getElementById("img5").style.display = "inline-block";
		//document.getElementById("cImg").src="img/folwell.jpg";
	}
	
}
function mouseOut(id) {
	if (id == 'img1') 
	{
		document.getElementById("img1").style.display = "none";
		//document.getElementById("cImg").src="img/gophers-mascot.png";
	}
	else if (id == 'img2'){
		document.getElementById("img2").style.display = "none";
		//document.getElementById("cImg").src="img/gophers-mascot.png";
	}
	else if (id == 'img3'){
		document.getElementById("img3").style.display = "none";
		//document.getElementById("cImg").src="img/gophers-mascot.png";
	}
	else if (id == 'img4'){
		document.getElementById("img4").style.display = "none";
		//document.getElementById("cImg").src="img/gophers-mascot.png";
	}
	else if (id == 'img5'){
		document.getElementById("img5").style.display = "none";
		//document.getElementById("cImg").src="img/gophers-mascot.png";
	}
}

function checkStrength(){
	var myPassword = document.getElementById("password").value;
	var good = "";
	var passInfo = "";
	var strength = 0;
	if (myPassword.length < 8) {
		passInfo += " Your Password is too short.";
	}
	else {
		strength += 1;
	}
	
	// If myPassword contains both lower and uppercase characters, increase strength value.
	if (myPassword.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
		strength += 1;
	}
	else {
		passInfo += " Your Password needs both a lower case and uppercase letter.";
	}
	// If it has numbers and characters, increase strength value.
	if (myPassword.match(/([a-zA-Z])/) && myPassword.match(/([0-9])/)) {
		strength += 1;
	}
	else {
		passInfo += " Your Password needs both numbers and letters.";
	}
	// If it has one special character, increase strength value.
	if (myPassword.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
		strength += 1;
	}
	else {
		passInfo += " Your Password needs at least 1 special character. Should have 2.";
	}
	// If it has two special characters, increase strength value.
	if (myPassword.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)){
		strength += 1;
	}
	if (strength > 4) {
		good = "Strength: Strong";
		document.getElementById("result").style.color = "green";		
	}
	else if (strength > 2) {
		good = "Strength: Good"
		document.getElementById("result").style.color = "#b89509";
	}
	else {
		good = "Strength: Weak";
		document.getElementById("result").style.color = "red";
	}

	document.getElementById("result").innerHTML = good;
	document.getElementById("message").innerHTML = passInfo;

}
/*Spinning pictures*/
var pics = ["img/northrop.jpg", "img/keller.jpg", "img/folwell.jpg", "img/Shepherd.jpg", "img/gophers-mascot.png"];
var descripts = ["Northrop", "Keller Hall", "Folwell Hall", "Shepherd Labs"];
var iconImg;
function pickImage()
{
   var index = Math.floor(Math.random() * 5 );
   document.getElementById("cImg").src=pics[index];
   document.getElementById("cImg").alt=descripts[index];
} // end function pickImage

var turning = false;
var angle = 0;
function spinImage() {
	var img = document.getElementById("cImg");
	angle += 1;
    img.style.transform = "rotate(" + angle + "deg)";
	if (angle >= 360) {
		angle = 0;
	}
}
var intID;
function spin() {	
	if (!turning){
		intID = setInterval(function(){spinImage()},25);
		turning = true;
	}
	else {
		intID = clearInterval(intID)
		turning = false
	}
	
	
}


/*Google Map*/

var mapContact;
var infowindow;
var service; 
var UMN = { lat: 44.9727, lng: -93.23540000000003}; 
function initMap() {

	UMN = { lat: 44.9727, lng: -93.23540000000003};
	infowindow = new google.maps.InfoWindow();
	mapContact = new google.maps.Map(document.getElementById("map"), {
		zoom: 16,
		center: UMN,
	});

}

// Access Table, Splits it, sends information to create markers
function addMarkers() {
	var table = document.getElementsByTagName("table")[0];
	var rows = table.getElementsByTagName("tr")
	var name;
	var address;
	var contact;
	var columns;
	// console.log(rows.length); 
	var geocoder = new google.maps.Geocoder();
	for (var i = 1; i < rows.length; i++){
		columns = rows[i].getElementsByTagName("td");
		name = columns[0];
		address = columns[2];
		address = address.outerHTML;
		// console.log(address);
		contact = columns[3].getElementsByTagName("p")[0];		
		geocodeAddress(geocoder, mapContact, name.outerHTML, address, contact.outerHTML); 		
	}
}

// Sets markers
// Next two functions based on class code
var markers = [];
var countM = 0;
var marker2;
// Specifically for making the contact page markers
function geocodeAddress(geocoder, resultsMap, name, address, contact) {
	var completeTitle = name + ", " + contact + ", \n" + address;
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			resultsMap.setCenter(results[0].geometry.location);
			marker2 = new google.maps.Marker({
							map: resultsMap,
							position: results[0].geometry.location,
							title:completeTitle
							});
			
			// google.maps.event.addListener(marker2, 'click', createWindow(resultsMap,infowindow2, marker2));
						
			google.maps.event.addListener(marker2, 'click', function() {
				new google.maps.InfoWindow({
					content: this.title
				}).open(map, this);
			});
			markers.push(marker2);
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		} //end if-then-else
	}); // end call to geocoder.geocode function
} // end geocodeAddress function
	
	// Function to return an anonymous function that will be called when the rmarker created in the 
    // geocodeAddress function is clicked	
function createWindow(rmap, rinfowindow, rmarker){
    return function(){
		rinfowindow.open(rmap, rmarker);
    }
}//end create (info) window

/*Marker Helper Functions from Developer Google Website*/
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(mapContact);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

/*Google Map Search Functions*/
var service;
var r;
var locType;
function searchLocation() {
	
	deleteMarkers();
	// var locType;
	if (document.getElementById("Find").value == "other") {
		locType = document.getElementById("otherFind").value;
	}
	else {
		locType = document.getElementById("Find").value;
	}
	// console.log(locType);
	r = document.getElementById("radius").value;
	// console.log(r);
	/*
	var request = {
      location: UMN,
	  radius: r,  
      type: [locType],	
	};
	// console.log(request);
	service = new google.maps.places.PlacesService(mapContact);
	service.nearbySearch(request, (results, status) => {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
		}
	});
	*/
	getLocation("nearby");
	
}

function search(position) {
	var from = position.coords;
	// console.log(from);
	var currFrom = {lat: from.latitude, lng: from.longitude};
	console.log(currFrom);
	mapContact.setCenter(currFrom);
	mapContact.setZoom(13);
	var request = {
      location: currFrom,
	  radius: r,  
      type: [locType],	
	};
	// console.log(request);
	service = new google.maps.places.PlacesService(mapContact);
	service.nearbySearch(request, (results, status) => {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
		}
	});
}

//If name is same as value, just interprets name, so map may not go down

function createMarker(places) {
	if (!places.geometry || !places.geometry.location) return;
	service.getDetails(
	{ placeId: places.place_id},
	(place, status) => {
	  if (
		status === "OK" &&
		place &&
		place.geometry &&
		place.geometry.location
	  ) {
		  var detail = place.name + "\n" +  place.formatted_address;
		  const marker = new google.maps.Marker({
			map: mapContact,
			title: detail,
			position: place.geometry.location,
			});
			
			google.maps.event.addListener(marker, 'click', function() {
				new google.maps.InfoWindow({
					content: this.title
				}).open(map, this);
			});
			markers.push(marker);
		  }
		}
	  );	  
		
	/*
	var detail = place.name + "\n" + place.place_id;
	console.log(detail);
	const marker = new google.maps.Marker({
		map: mapContact,
		title: detail,
		position: place.geometry.location,
	});
	  
	google.maps.event.addListener(marker, 'click', function() {
				new google.maps.InfoWindow({
					content: this.title
				}).open(map, this);
			});
			markers.push(marker);
			*/
	  /*
	  google.maps.event.addListener(marker, "click", () => {
		infowindow.setContent(place.name || "");
		infowindow.open(mapContact);
	  });
	  
	markers.push(marker);
	
	*/
}


  
function ifOther() {
	if (document.getElementById("Find").value == "other") {
        document.getElementById("otherFind").disabled=false;
    } else {
        document.getElementById("otherFind").disabled=true;
    }
}

/*Directions*/
/*getLocation() and showError() taken from w3schools)*/
var toPlace;
var trans;
function direction() {
	deleteMarkers();
	console.log(markers);	
	toPlace = document.getElementById("direc").value;
	var radioValues = document.getElementsByName("transport");
	for (var i = 0; i < radioValues.length; i++) {
		if (radioValues[i].checked){
			trans = radioValues[i].value;
		}
	}
	// console.log(toPlace);
	// console.log(trans);
	getLocation("direct");
	// getDirections();
}
var currLocation; 
function getLocation(whichFunction) {
	
	if (navigator.geolocation) {
		if (whichFunction == "direct") {
			navigator.geolocation.getCurrentPosition(getDirections, showError);
		}
		if (whichFunction == "nearby") {
			navigator.geolocation.getCurrentPosition(search, showError);
		}
	} else { 
		currLocation.innerHTML = "Geolocation is not supported by this browser.";
	}
}
// var toPlaceLatLog;
/*
function setCurrPosition(position){
	currLocation = position.coords;
}
*/
function getDirections(position) {
	currLocation = position.coords;
	var directionsService = new google.maps.DirectionsService();
	var directionsRenderer = new google.maps.DirectionsRenderer();
	directionsRenderer.setMap(mapContact);
	var geocoder2 = new google.maps.Geocoder();	
	//geocodeLocationName(geocoder2, mapContact, toPlace);
	// Adds div object to html to show directions
	var test = document.getElementById("right-panel");
	if (typeof(test) != "undefined" && test != null) {
		test.remove();
	}
	var panel = document.createElement("div");
	panel.id = "right-panel";
	var parentDiv = document.getElementsByClassName("flex-container")[0];
	// console.log(parentDiv);
	var child = parentDiv.getElementsByTagName("div")[0];
	parentDiv.insertBefore(panel, child);
	
	directionsRenderer.setPanel(document.getElementById("right-panel"));
	
	// Calculates directions
	calculateAndDisplayRoute(directionsService, directionsRenderer);

}
	
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      currLocation.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      currLocation.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      currLocation.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      currLocation.innerHTML = "An unknown error occurred."
      break;
  }
}

/*Taken from Google Developer*/
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
	
	directionsService.route(
	  {
		origin: { lat: currLocation.latitude, lng: currLocation.longitude },
 
		destination: toPlace,

		travelMode: google.maps.TravelMode[trans],
	  },
	  (response, status) => {
		if (status == "OK") {
		  directionsRenderer.setDirections(response);
		} else {
		  window.alert("Directions request failed due to " + status);
		}
	  }
	);
}
// Watch the async (callbacks)
var mapForm;
function initMapForm() {
	UMN = { lat: 44.9727, lng: -93.23540000000003};
	mapForm = new google.maps.Map(document.getElementById("mapForm"), {
		zoom: 15,
		center: UMN,
	});
	new ClickEventHandler(mapForm, UMN);
}

/*EXTRA CREDIT FORM WORK*/
// IN PROGRESS
 function isIconMouseEvent(e) {
    return "placeId" in e;
}

class ClickEventHandler {
constructor(map, origin) {
  this.origin = origin;
  this.map = map;
  // this.directionsService = new google.maps.DirectionsService();
  // this.directionsRenderer = new google.maps.DirectionsRenderer();
  // this.directionsRenderer.setMap(map);
  this.placesService = new google.maps.places.PlacesService(map);
  this.infowindow = new google.maps.InfoWindow();
  this.infowindowContent = document.getElementById(
   	"infowindow-content"
   );
  this.infowindow.setContent(this.infowindowContent);
  // Listen for clicks on the map.
  this.map.addListener("click", this.handleClick.bind(this));
}
handleClick(event) {
  console.log("You clicked on: " + event.latLng);

  // If the event has a placeId, use it.
  if (isIconMouseEvent(event)) {
	console.log("You clicked on place:" + event.placeId);
	// Calling e.stop() on the event prevents the default info window from
	// showing.
	// If you call stop here when there is no placeId you will prevent some
	// other map click event handlers from receiving the event.
	event.stop();

	if (event.placeId) {
	//  this.calculateAndDisplayRoute(event.placeId);
	  
	  this.getPlaceInformation(event.placeId);
	  
	}
  }
}



getPlaceInformation(placeId) {
  const me = this;
  this.placesService.getDetails(
	{ placeId: placeId },
	(place, status) => {
	  if (
		status === "OK" &&
		place &&
		place.geometry &&
		place.geometry.location
	  ) {
		me.infowindow.close();
		me.infowindow.setPosition(place.geometry.location);
		me.infowindowContent.children["place-icon"].src = place.icon;
		me.infowindowContent.children["place-name"].textContent =
		  place.name;
		// me.infowindowContent.children["place-id"].textContent =
		//   place.place_id;
		me.infowindowContent.children["place-address"].textContent =
		  place.formatted_address;
		me.infowindow.open(me.map);
		
		var detail = place.formatted_address;
		var ad = document.getElementById("location");
		ad.value = detail;

	  }
	}
  );
}
}
