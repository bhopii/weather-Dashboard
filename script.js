//array of cities
var cityArray;


//after the page loads
function init() {
    cityArray = JSON.parse(localStorage.getItem("cities"));
    if(cityArray === null){
        cityArray =[];
  
    }
    createCityRow();

  }
  init();

//event listener on search button
$("#search-btn").on("click", function () {
  var cityNameInput = $("#search-input-box").val();
  //push the city names in cityArray
  cityArray.push(cityNameInput);
  //adding o local storage
  localStorage.setItem("cities", JSON.stringify(cityArray));
  //call function to display city row
  createCityRow();
  $("#search-input-box").val("");
  //call function invoke API and show data
  showWeatherData(cityNameInput); 

});

function createCityRow() {
  $("#city-list-container").empty();
  for (i = 0; i < cityArray.length; i++) {
    //create div for row
    var divRow = $("<div>");
    divRow.attr("class", "row border city-row");
    divRow.attr("city", cityArray[i]);
    var divCol = $("<div>");
    divCol.attr("class", "col-12");
    var para = $("<p>");
    para.text(cityArray[i]);
    divCol.append(para);
    divRow.append(divCol);
    $("#city-list-container").append(divRow);
  }
}

function showWeatherData(cityNameInput){
    var geoQueryURL = "https://api.geocod.io/v1.6/geocode?q="+cityNameInput+"&api_key=a3b545f33b7513f1aa5a508a505f7ba0f7f88f1";
    //to get latitude and longitude of provided city.

    $.ajax({
        url : geoQueryURL,
        method :"GET"
    }).then(function(response){
       var lat = response.results[0].location.lat;
       var long = response.results[0].location.lng;

        //get data from weather api
       var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude=minutely,hourly,alerts&appid=d8cebcf8331bd9f62eee21d496dc4a09&units=imperial";
       $.ajax({
           url : weatherURL,
           method :"GET"
       }).then(function(response){
           console.log(response);
           showCurrentWeatherDetails(response,cityNameInput);
        //    showForecastDetails(response);

       });
    });


};


function showCurrentWeatherDetails(response,cityNameInput){
    $("main").attr("style", "display:block;");
    $("#current-date-city-name").text(cityNameInput);
    

}


