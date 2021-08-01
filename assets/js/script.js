//Search bar starts here- Creating an error
//$(document).foundation();

$(function() {
  $('.search')
    .bind('click', function(event) {
      $(".search-field").toggleClass("expand-search");

      // if the search field is expanded, focus on it
      if ($(".search-field").hasClass("expand-search")) {
        $(".search-field").focus();
      }
    })
});
//Empty List until given an event
let searchHistory =[];
//Triggers when the search is clicked.
$(".city-list").on("click", "li", function(event){
    event.preventDefault();
    let previousCityName = $(this).text();
    //console.log("Previous city : "+ previousCityName);
    
    //call trigger functions;

});

// function to store and populate search history
function getCities(){
    let reverseHistory=searchHistory.reverse();
    let storedCities= JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null){
        reverseHistory=storedCities
    };
    $(".city-list").html("");
    //lists up to 4 city locations
    for (i=0;i<searchHistory.length; i++){
    reverseHistory.unshift("storedCities");
    //break at the 4th array 
      if ( i===4){
        break;
    }       
    //populate new lists  
    let listitem=$("<a>").attr({
        class:"list-group-item previousCity button-group",
        href: "#"
    });
    listitem.text(searchHistory[i]);
    $(".city-list").append(listitem);
    //let listitem=$("<li>").addClass("list-group-item previousCity").text(searchHistory[i]);
    //$(".city-list").append(listitem);
}
}
//searches and adds to local storage 
$("#searchButton").click(function(event){
    let city= $("#searchcity").val();
    searchHistory.push(city)
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    getCities();
});
