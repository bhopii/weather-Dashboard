//array of cities
var cityArray;

//after the page loads
function init() {
  //fetch items stored in local storage
  cityArray = JSON.parse(localStorage.getItem("cities"));
  //if their is no items in local storage create a blank array
  if (cityArray === null) {
    cityArray = [];
  } else {
    //call function invoke API and show data
    showWeatherData(cityArray[cityArray.length - 1]);
  }
  createCityRow();
}
init();

//event listener on search button
$("#search-btn").on("click", function () {
  //fetch value from input box and store in a variable
  var cityNameInput = $("#search-input-box").val();
  //if the value entered is not blank
  if (cityNameInput != "") {
    //restrict duplication of city names in city array
    if (!checkDuplicate(cityNameInput)) {
      //push the city names in cityArray
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
//create rows to display the city in the list
function createCityRow() {
  //empty the list after every loop
  $("#city-list-container").empty();
  //set loop to repeat the process
  for (i = 0; i < cityArray.length; i++) {
    //create div for row
    var divRow = $("<div>");
    //set class for row
    divRow.attr("class", "row border city-row");
    //set id for row
    divRow.attr("city", cityArray[i]);
    //create div for colum
    var divCol = $("<div>");
    //set class to colum
    divCol.attr("class", "col-12");
    //create a paragraph tag
    var para = $("<p>");
    //insert city name in the paragraph tag
    para.text(cityArray[i]);
    //append paragraph tag in colum
    divCol.append(para);
    //append colum in row
    divRow.append(divCol);
    //append row in container
    $("#city-list-container").append(divRow);
  }
}

//Function to check duplicate
function checkDuplicate(cityName) {
  for (i = 0; i < cityArray.length; i++) {
    if (cityName.toLowerCase() === cityArray[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}

//function to show current weather details
function showWeatherData(cityNameInput) {
  //API call to get latitude & longitude of the city passed in parameter
  var geoQueryURL =
    "https://geocode.xyz/" +
    cityNameInput +
    "?json=1&auth=787471314802816619931x117746";

  //ajax call to receive the response
  $.ajax({
    url: geoQueryURL,
    method: "GET",
  }).then(function (response) {
    var lat = response.latt;
    var long = response.longt;

    //API call to receive weather data
    var weatherURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      long +
      "&exclude=minutely,hourly,alerts&appid=d8cebcf8331bd9f62eee21d496dc4a09&units=imperial";

    //ajax call to receive response
    $.ajax({
      url: weatherURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      //call function to display current day weather details
      showCurrentWeatherDetails(response, cityNameInput);
      //call function to display 5days forecast
      showForecastDetails(response);
    });
  });
}

//function to show the selected city's weather details on for the current day
function showCurrentWeatherDetails(response, cityNameInput) {
  //set attribute to show the display from hide
  $("main").attr("style", "display:block;");
  //display city name
  $("#current-city-name").text(cityNameInput);
  //call function to display the date in mm/dd/yy format & store it in a variable
  var formattedDate = getFormattedDate(response.current.dt);
  //display date
  $("#current-date").text(formattedDate);
  //get icon code from API response and set in a variable
  var imageIcon = response.current.weather[0].icon;
  console.log(imageIcon);
  //set the icon code in url to get the image
  var imageUrl = "http://openweathermap.org/img/wn/" + imageIcon + "@2x.png";
  console.log(imageUrl);
  //set attribute to display the image
  $("#current-date-weather-pic").attr("src", imageUrl);
  //get temperature from API response and set the value in assigned location
  $("#temperature").text(response.current.temp);
  //get humidity from API response and set the value in assigned location
  $("#humidity").text(response.current.humidity);
  //get wind-speed from API response and set the value in assigned location
  $("#wind-speed").text(response.current.wind_speed);
  //get uvi and store it in a variable
  var uvIndex = response.current.uvi;
  //call function to display the back-ground color for uvi according to response
  showUvIndex(uvIndex);
}

//function to display in date in epoch format
function getFormattedDate(epochDate) {
  var date = new Date(epochDate * 1000);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var fullDate = month + 1 + "/" + day + "/" + year;
  return fullDate;
}

//function to display 5days forecast
function showForecastDetails(response) {
  //empty the div before you start loop for the next city
  $("#five-day-forecast").empty();
  // set loop to repeat the forecast for 5days
  for (i = 0; i < 5; i++) {
    var forecastDivRow = $("<div>");
    forecastDivRow.attr("class", "col-sm");

    var cardDiv = $("<div>");
    cardDiv.attr("class", "card bg-primary text-white text-left p-3");

    var paraDate = $("<h5>");
    var formattedDate = getFormattedDate(response.daily[i].dt);
    paraDate.text(formattedDate);

    var paraImg = $("<img>");
    var imageIcon = response.daily[i].weather[0].icon;
    var imageUrl = "http://openweathermap.org/img/wn/" + imageIcon + "@2x.png";

    paraImg.attr("src", imageUrl);
    paraImg.attr("height", "60");
    paraImg.attr("width", "60");

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

//set onclick on the container followed by event delegation to rows where the city names are present
$("#city-list-container").on("click", ".city-row", function () {
  // identify the city name with class attr()
  var clickCityName = $(this).attr("city");
  //call function invoke API and show data
  showWeatherData(clickCityName);
});
//function to display the back-ground color for uvi according to response
function showUvIndex(uvIndex) {
  console.log(uvIndex);
  //set uvi in assigned location
  $("#UV-Index").text(uvIndex);
  //set colors as per conditions
  if (uvIndex <= 2) {
    $("#UV-Index").attr("style", "background-color: green;");
  } else if ((uvIndex >= 3) & (uvIndex <= 5)) {
    $("#UV-Index").attr("style", "background-color: yellow;");
  } else if ((uvIndex >= 6) & (uvIndex <= 7)) {
    $("#UV-Index").attr("style", "background-color: orange;");
  } else if ((uvIndex >= 8) & (uvIndex <= 10)) {
    $("#UV-Index").attr("style", "background-color: red;");
  } else {
    $("#UV-Index").attr("style", "background-color: violet;");
  }
}
