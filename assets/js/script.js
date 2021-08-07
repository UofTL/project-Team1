//Search bar starts here
$(function () {
  $('.search')
    .bind('click', function (event) {
      $(".search-field").toggleClass("expand-search");

      // if the search field is expanded, focus on it
      if ($(".search-field").hasClass("expand-search")) {
        $(".search-field").focus();
      }
    })
});
//Empty List until given an event
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
let city = [];

// function to store and populate search history
function getCities() {

  let reverseHistory = searchHistory.reverse();
  let storedCities = JSON.parse(localStorage.getItem("searchHistory"));
  if (storedCities !== null) {
    reverseHistory = storedCities
  };
  $(".city-list").html("");


  //lists up to 4 city locations
  for (i = 0; i < searchHistory.length; i++) {
    reverseHistory.unshift("storedCities");
    //break at the 4th array 
    if (i === 4) {
      break;
    }
    
    //populate new lists  
    let listitem = $("<a>").attr({
      class: "button secondary stacked expanded",
      dataProvince: searchHistory[i].province,
    });
    listitem.text(searchHistory[i].cityName);
    $(".city-list").append(listitem);
  }
  
}

//handle form submission; searches and adds to local storage 
$("form").on("submit", function (event) {
  event.preventDefault();
  city = {
    cityName: $("#searchcity").val(),
    province: $("#province-name").val()
  }
  searchHistory.push(city)
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  getCities();
  getGeoCode(city.province);
  showCityTitle(city);
  $("form").trigger("reset");
});

//Triggers when the search is clicked
$(".city-list").on("click", function (event) {
  var province = event.target.getAttribute("dataProvince");
  var cityName = event.target.textContent;
  city = {
    cityName: cityName,
    province: province
  }
  getGeoCode(city.province);
  showCityTitle(city);
});


// show city title
var showCityTitle = function(){
  $("#city-title").text(city.cityName+", "+ city.province);
}


//STATISTICS CANADA API STARTS HERE
var caApiUrl = "https://statcan-all-indicators-statcan-apicast-production.api.canada.ca/v1/ind-all.json";
var caOptions = {
  headers: {
    "user-key": "a48dba9596f7af379ff5df3c26ecc425"
  }
}

var indicators;
var unemployment;
var immigrants;
var crime;
var geoCode;

//fetch API data - all indicators
var fetchApi = function () {
  console.log("calling from onload");
  fetch(caApiUrl, caOptions)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Error: No results are found")
      }
    })
    .then(function (data) {
      indicators = data.results.indicators;
      getIndicators(data.results.indicators)
    })
}

//get three main indicators
var getIndicators = function (promise) {
  indicators = promise;
  unemployment = _.filter(indicators, { 'registry_number': 3587, 'indicator_number': 2 })
  console.log("unemploy", unemployment);
  immigrants = _.filter(indicators, { 'registry_number': 14428, 'indicator_number': 1 })
  console.log("immigrants", immigrants);
  crime = _.filter(indicators, { 'registry_number': 4751, 'indicator_number': 1 })
  console.log("crime", crime);
};

//display three main indicators  
var showIndicators = function (geoCode) {
  //show unemployment rate
  var theUnemployment = _.filter(unemployment, ['geo_code', geoCode]);
  theUnemployment = theUnemployment[0].value.en;
  console.log("unemployment rate", theUnemployment);
  $("#unemployment").text(theUnemployment);

  //show immigrants rate
  var theImmigrants = _.filter(immigrants, ['geo_code', geoCode]);
  theImmigrants = theImmigrants[0].value.en;
  console.log("immigrants rate", theImmigrants);
  $("#immigrants").text(theImmigrants + "%");

  //show crime severity index 
  var theCrime = _.filter(crime, ['geo_code', geoCode]);
  theCrime = theCrime[0].value.en;
  console.log("crime severity index", theCrime);
  $("#crime").text(theCrime);
}


//turn province name to geocode
var getGeoCode = function(province){
switch (province) {
  case "NL":
    geoCode = 1;
    showIndicators(geoCode);
    break;
  case "PE":
    geoCode = 2;
    showIndicators(geoCode);
    break;
  case "NS":
    geoCode = 3;
    showIndicators(geoCode);
    break;
  case "NB":
    geoCode = 4;
    showIndicators(geoCode);
    break;
  case "QC":
    geoCode = 5;
    showIndicators(geoCode);
    break;
  case "ON":
    geoCode = 6;
    showIndicators(geoCode);
    break;
  case "MB":
    geoCode = 7;
    showIndicators(geoCode);
    break;
  case "SK":
    geoCode = 8;
    showIndicators(geoCode);
    break;
  case "AB":
    geoCode = 9;
    showIndicators(geoCode);
    break;
  case "BC":
    geoCode = 10;
    showIndicators(geoCode);
    break;
  case "YT":
    geoCode = 11;
    showIndicators(geoCode);
    break;
  case "NT":
    geoCode = 12;
    showIndicators(geoCode);
    break;
  case "NU":
    geoCode = 13;
    showIndicators(geoCode);
    break;
  default:
    console.log("Not a Canadian Province");
    break;
}
}
//STATISTICS CANADA API ENDS HERE


//WALK SCORES API STARTS HERE
var walkScoreHeader = {
  headers: {
      "Origin": "https://siyanguo.github.io",
      'Access-Control-Allow-Origin': '*'
  }
}
var fetchWalkScore = function () {
  var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.walkscore.com/score?format=json&lat='+searchLat+'&lon='+searchLon+'&transit=1&bike=1&wsapikey=ba22f3ccf1824ce39c01839a42864c76';
  // var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.walkscore.com/score?format=json&lat=47.651070&lon=-79.347015&transit=1&bike=1&wsapikey=ba22f3ccf1824ce39c01839a42864c76';
  fetch(apiUrl, walkScoreHeader)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log("walkscore", data);
          displayScores(data)
      })
}

//display results 
var displayScores = function(data){
var walkScore = data.walkscore;
var walkDescription = data.description;
  $("#walkScore").text(walkScore);
  $("#walkDescription").text(walkDescription);

  var bikeScore = data.bike.score;
var bikeDescription = data.bike.description;
  $("#bikeScore").text(bikeScore);
  $("#bikeDescription").text(bikeDescription);

  var transitScore = data.transit.score;
var transitDescription = data.transit.description;
  $("#transitScore").text(transitScore);
  $("#transitDescription").text(transitDescription);
}


//WALK SCORES API ENDS HERE

//GOOGLE MAPS API STARTS HERE
var searchLon;
var searchLat;

function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 43.651070, lng: -79.347015 },
      zoom: 8,
      mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
          return;
      }
      // Clear out the old markers.
      markers.forEach((marker) => {
          marker.setMap(null);
      });
      markers = [];
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
              console.log("Returned place contains no geometry");
              return;
          }
          const icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25),
          };
          //save lat and lon and then fetch walk scores
          console.log("location", place.geometry);
          searchLon = place.geometry.viewport.Eb.g;
          searchLat = place.geometry.viewport.lc.g;
          fetchWalkScore();
          // Create a marker for each place.
          markers.push(
              new google.maps.Marker({
                  map,
                  icon,
                  title: place.name,
                  position: place.geometry.location,
              })
          );

          if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
          } else {
              bounds.extend(place.geometry.location);
          }
      });
      map.fitBounds(bounds);
  });
}

//GOOGLE MAPS API ENDS HERE

//fetch Statistics data when loading the page
document.onload = fetchApi();

//display google map when page is loaded
document.addEventListener("load", initAutocomplete);

// Will return city after browser is refreshed 
getCities();

