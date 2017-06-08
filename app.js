var locationData = {};
var weatherData;
var currentTemp;

function getCoords() {
  document.getElementById("condition-container").innerHTML = 'Getting weather information';
  // var request = new XMLHttpRequest();
  // var url = "http://ip-api.com/json";

  // request.open("GET", url, true);


  // request.onreadystatechange = function() {
  //   if (request.readyState == 4 && request.status == 200) {
  //     locationData = JSON.parse(request.responseText);


  //     getWeatherData();
  //   }
  // };
  // request.send();

  function success(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    locationData.lat = position.coords.latitude;
    locationData.lon = position.coords.longitude;
    getWeatherData();
  }

  function error() {
    console.log('Could not retrieve your location');
  }

  navigator.geolocation.getCurrentPosition(success, error);
}

function getWeatherData() {
  var request = new XMLHttpRequest();
  var url = "https://api.apixu.com/v1/current.json" +
            "?q=" + locationData.lat + ','+ locationData.lon +
            "&key=56806ae8efcc4f2aa1e61036170706";

  request.open("GET", url, true);


  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      weatherData = JSON.parse(request.responseText);
      currentTemp = weatherData.current.temp_f.toFixed(0);
      displayData();
    }
  };
  request.send();
}

function displayData() {
  document.getElementById("city-container").innerHTML = weatherData.location.name + ', ' + weatherData.location.region;
  document.getElementById("temp-container").innerHTML = currentTemp + "&deg;" +
    "<span class='scale' onclick='convertToCels()'> F</span>";;
    // convertToFahr();

  document.getElementById("condition-container").innerHTML = weatherData.current.condition.text;
 /*
  // dayOrNight() is called to provide either the daytime or nighttime version of the icon
  document.getElementById("icon-container").innerHTML = "<i class='wi wi-owm-" + dayOrNight() + "-" + (weatherData.current.condition.code) + "'></i>";
  weatherData.weather[0].id
  */
  document.getElementById("icon-container").innerHTML = "<img src=https:" + weatherData.current.condition.icon + ">";

}

// returns the string "day" or "night"
// by comparing current time with the sunset time provided
// by the open weather api
// inserts the correct string so the correct icon displays
function dayOrNight() {
  var dateObject = new Date();
  var currentTime = dateObject.getTime();

  if (currentTime < weatherData.sys.sunset) {
    return "day";
  } else {
    return "night"
  }
}


function convertToFahr() {
  currentTemp = currentTemp * (9 / 5) + 32;
  document.getElementById("temp-container").innerHTML = (currentTemp).toFixed(0) + "&deg;" +
          "<span class='scale' onclick='convertToCels()'> F</span>";
}

function convertToCels() {
  currentTemp = (currentTemp - 32) * (5 / 9);
  document.getElementById("temp-container").innerHTML = (currentTemp).toFixed(0) + "&deg;" +
          "<span class='scale' onclick='convertToFahr()''> C</span>";
}



/*
This will create a cloud every so often, randomly chooseing from an array
of cloud objects. The larger the cloud, the higher it's
z-index, and the faster it will move. Hopefully creating a parralax
effect
*/


function populateClouds() {
  var numberOfClouds = Math.floor(Math.random() * 4) + 1;

  for (var i = 0; i < numberOfClouds; i++) {
    createCloud();
  }

}

// this function is called when a cloud finishes its
// animation style in order to keep the DOM reasonable
function destroyCloud(e) {
  e.target.remove()
}


function createCloud() {

  // define clouds and store in an array
  var largeCloud = {
    size: 18,
    speed: 12,
    zIndex: -1
  };

  var mediumCloud = {
    size: 10,
    speed: 20,
    zIndex: -2
  };

  var smallCloud = {
  size: 4,
  speed: 28,
  zIndex: -3
  };

  var cloudArray = [smallCloud, mediumCloud, largeCloud];

  var cloudElement = document.createElement("div");
  cloudElement.addEventListener("animationend", destroyCloud);

  // picks random number from 0 - length of cloudArray
  var randomCloud = Math.floor(Math.random() * cloudArray.length);
  var randomPosition = Math.floor(Math.random() * 101);
  var randomDelay = Math.floor(Math.random() * 3);

  var cloud = cloudArray[randomCloud];

  cloudElement.setAttribute("class", "cloud");

  var cloudStyle = "top: " + randomPosition + "%; " +
                    "font-size: " + cloud.size +"em; " +

                   "z-index: " + cloud.zIndex + "; " +
                   "animation: myanimation " + cloud.speed + "s linear " +
                              randomDelay + "s;"

  // create a 1 in 3 chance the next cloud will
  // be colored
  var randomNumber = Math.floor(Math.random() * 3);
    if (randomNumber == 0) {
      cloudStyle += "color: #" + generateColor() + ";";
    }

  cloudElement.setAttribute("style", cloudStyle);

  document.body.appendChild(cloudElement);
}

// Creates one large cloud in the foreground the clips the lower
// part of the info window - for dramatic effect
function createForeGroundCloud() {
  var cloudElement = document.createElement("div");
  var cloudStyle = "bottom: 20%; left: -200%; font-size: 25em; z-index: 5; " +
              "animation: myanimation 8s linear;"


  cloudElement.addEventListener("animationend", destroyCloud);

  cloudElement.setAttribute("class", "cloud");
  cloudElement.setAttribute("style", cloudStyle);
  document.body.appendChild(cloudElement);

  var container = document.getElementsByTagName("section");
  container[0].appendChild(cloudElement);

}

function generateColor() {
  var colors = [
              "b6f3df",
              "b6e9f3",
              "b6caf3",
              "c1b6f3",
              "dfb6f3",
              "f3b6e8"]

  var randomNumber = Math.floor(Math.random() * colors.length);

  return colors[randomNumber];
}

setInterval(populateClouds, 5000);
setInterval(createForeGroundCloud, 7000);

onload = populateClouds;

getCoords();