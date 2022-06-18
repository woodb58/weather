const apiKey = "9cbde179534e3e754dd9b9f3dc27539a"
const citySearch = document.getElementById("city-search")
const searchBtn = document.getElementById("search-btn")
const previousCities = document.getElementById("previous-cities")
const currentCity = document.getElementById("city-name")
const currentTemp = document.getElementById("temp")
const currentWind = document.getElementById("wind")
const currentHumidity = document.getElementById("humidity")
const currentUVIndex = document.getElementById("uv-index")
const fiveDayForecast = document.querySelector(".five-day")

const displayCurrentWeather = function(weatherData) {
    let icon = document.createElement('img')
    let iconId = weatherData.current.weather[0].icon
    icon.setAttribute("src", `http://openweathermap.org/img/w/${iconId}.png`)
    currentCity.appendChild(icon)
    currentTemp.innerText = weatherData.current.temp
    currentWind.innerText = weatherData.current.wind_speed
    currentHumidity.innerText = weatherData.current.humidity
    UVIndex = weatherData.current.uvi
    currentUVIndex.style.opacity = 1
    if (UVIndex < 3) {
        currentUVIndex.style.backgroundColor = "green"
    }
    else if (UVIndex < 6) {
        currentUVIndex.style.backgroundColor = "yellow"
    }
    else if (UVIndex < 8) {
        currentUVIndex.style.backgroundColor = "orange"
    }
    else {
        currentUVIndex.style.backgroundColor = "red"
    }
    currentUVIndex.innerText = UVIndex
}

const cityClickHandler = function(event) {
    let cityName = event.target.getAttribute("data-city")
    getLocationData(cityName)
}

const loadCities = function() {
    loadedCities = localStorage.getItem("Cities")
    if (!loadedCities) {
        return;
    }
    loadedCities = JSON.parse(loadedCities)
    for (var i = 0; i < loadedCities.length; i++) {
        generateSearchBtn(loadedCities[i])
    }
}

const saveCity = function(city) {
    let savedCities = localStorage.getItem("Cities")
    if (!savedCities){
        localStorage.setItem("Cities", JSON.stringify([city]))
        return;
    }
    savedCities = JSON.parse(savedCities)
    savedCities.push(city)
    localStorage.setItem("Cities", JSON.stringify(savedCities))
}

const generateSearchBtn = function(city) {
    newButton = document.createElement("button")
    newButton.setAttribute("type", "button")
    newButton.setAttribute("data-city", city)
    newButton.innerText = city
    previousCities.appendChild(newButton)
    newButton.addEventListener("click", cityClickHandler)
}
  
const getLocationData = function(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
    .then(function(response) {
        return response.json()
    })
    .then(function(locationData) {
        console.log(locationData)
        getCurrentWeather(locationData[0].lat, locationData[0].lon)
        currentCity.innerText = locationData[0].name + " (" + dayjs().format('MM/DD/YYYY') + ")"
})
}

const getCurrentWeather = function(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function(response) {
        return response.json()
    })
    .then(function(weatherData) {
        console.log(weatherData)
        displayCurrentWeather(weatherData)
    })
}

const getCity = function() {
    const newCity = citySearch.value
    getLocationData(newCity)
    generateSearchBtn(newCity)
    saveCity(newCity)
    citySearch.value = ""
}

loadCities();
searchBtn.addEventListener("click", getCity) 