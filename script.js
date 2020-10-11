//array of cities
var cityArray;

//after the page loads
function init() {
  cityArray = JSON.parse(localStorage.getItem("cities"));
  if (cityArray === null) {
    cityArray = [];
  }
  createCityRow();
}
init();

//event listener on search button
$("#search-btn").on("click", function () {
  var cityNameInput = $("#search-input-box").val();
  if (cityNameInput != "") {
    //push the city names in cityArray
    if (!cityArray.includes(cityNameInput)) {
      cityArray.push(cityNameInput);
      //adding o local storage
      localStorage.setItem("cities", JSON.stringify(cityArray));
    }
    //call function to display city row
    createCityRow();
    $("#search-input-box").val("");
    //call function invoke API and show data
    showWeatherData(cityNameInput);
  }
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

function showWeatherData(cityNameInput) {
  var geoQueryURL =
    "https://api.geocod.io/v1.6/geocode?q=" +
    cityNameInput +
    "&api_key=a3b545f33b7513f1aa5a508a505f7ba0f7f88f1";
  //to get latitude and longitude of provided city.

  $.ajax({
    url: geoQueryURL,
    method: "GET",
  }).then(function (response) {
    var lat = response.results[0].location.lat;
    var long = response.results[0].location.lng;

    //get data from weather api
    var weatherURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      long +
      "&exclude=minutely,hourly,alerts&appid=d8cebcf8331bd9f62eee21d496dc4a09&units=imperial";
    $.ajax({
      url: weatherURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      showCurrentWeatherDetails(response, cityNameInput);
      showForecastDetails(response);
    });
  });
}

function showCurrentWeatherDetails(response, cityNameInput) {
  $("main").attr("style", "display:block;");
  $("#current-city-name").text(cityNameInput);
  var formattedDate = getFormattedDate(response.current.dt);
  $("#current-date").text(formattedDate);
  $("#temperature").text(response.current.temp);
  $("#humidity").text(response.current.humidity);
  $("#wind-speed").text(response.current.wind_speed);
  $("#UV-Index").text(response.current.uvi);
}

function getFormattedDate(epochDate) {
  var date = new Date(epochDate * 1000);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var fullDate = month + 1 + "/" + day + "/" + year;
  return fullDate;
}

function showForecastDetails(response) {
  $("#five-day-forecast").empty();
  for (i = 0; i < 5; i++) {
    var forecastDivRow = $("<div>");
    forecastDivRow.attr("class", "col-sm");

    var cardDiv = $("<div>");
    cardDiv.attr("class", "card bg-primary text-white text-left p-3");

    var paraDate = $("<h5>");
    var formattedDate = getFormattedDate(response.daily[i].dt);
    paraDate.text(formattedDate);

    var paraImg = $("<img>");
    paraImg.attr("src", "./Assets/images/cloudy.png");
    paraImg.attr("height", "30");
    paraImg.attr("width", "30");

    var paraTemp = $("<p>");
    paraTemp.text("Temp: " + response.daily[i].temp.day + " °F");

    var paraHumi = $("<p>");
    paraHumi.text("Humidity: " + response.daily[i].humidity + "%");

    cardDiv.append(paraDate, paraImg, paraTemp, paraHumi);

    forecastDivRow.append(cardDiv);

    $("#five-day-forecast").append(forecastDivRow);
  }
}

//adding event listener to the cities present on the "citylist"
// row so that when user clicks a particular city its details gets displayed on "main".
$("#city-list-container").on("click", ".city-row", function(){

  var clickCityName = $(this).attr("city");
  //call function invoke API and show data
  showWeatherData(clickCityName);

});
