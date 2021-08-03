//Search bar starts here- Creating an error
//$(document).foundation();

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
let searchHistory = [];
let city = [];

// function to store and populate search history
function getCities() {

  let reverseHistory = searchHistory.reverse();
  let storedCities = JSON.parse(localStorage.getItem("searchHistory"));
  if (storedCities !== null) {
    reverseHistory = storedCities
  };
  $(".city-list").html("");
  let name = $("<h3> <small>").html("History");
  $(".city-list").prepend(name);
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
      href: "#",
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


//fetch data when loading the page
document.onload = fetchApi();


