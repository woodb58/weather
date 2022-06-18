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
const errorEl = document.getElementById("error")

// display current weather
const displayCurrentWeather = function(weatherData) {
    let icon = document.createElement('img')

    let iconId = weatherData.current.weather[0].icon
    icon.setAttribute("src", `http://openweathermap.org/img/w/${iconId}.png`)
    currentCity.appendChild(icon)
    currentTemp.innerText = weatherData.current.temp
    currentWind.innerText = weatherData.current.wind_speed
    currentHumidity.innerText = weatherData.current.humidity
    let UVIndex = weatherData.current.uvi
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
// 5 day forecast
const displayFiveDayWeather = function(weatherData) {

    const oldFiveDayContainer = document.getElementById("five-day")
    oldFiveDayContainer.remove()

    const newFiveDayContainer = document.createElement("div")
    newFiveDayContainer.setAttribute("id", "five-day")
    fiveDayForecast.appendChild(newFiveDayContainer)

    const fiveDayArr = weatherData.daily
    console.log(fiveDayArr)
    for (let i = 1; i < 6; i++) {
         let weatherCard = document.createElement("div")
         weatherCard.classList.add("card")
         let date = document.createElement("h3")
         date.innerText = dayjs().add(i, "day").format('MM/DD/YYYY')
         weatherCard.appendChild(date)
         let icon = document.createElement('img')
         let iconId = fiveDayArr[i].weather[0].icon
         icon.setAttribute("src", `http://openweathermap.org/img/w/${iconId}.png`)
         weatherCard.appendChild(icon)
         let tempEl = document.createElement('p')
         let temp = fiveDayArr[i].temp.day
         tempEl.innerHTML = `Temp: ${temp}&#8457;`
         weatherCard.appendChild(tempEl)
         let windEl = document.createElement('p')
         let wind = fiveDayArr[i].wind_speed
         windEl.innerHTML = `Wind: ${wind}mph`
         weatherCard.appendChild(windEl)
         let humidityEl = document.createElement('p')
         let humidity = fiveDayArr[i].humidity
         humidityEl.innerHTML = `Humidity: ${humidity}%`
         weatherCard.appendChild(humidityEl)
         newFiveDayContainer.appendChild(weatherCard)
    }
}

// checks to see if city is saved and does not generate button if it is
const checkSearchOrigin = function (city) {
    let loadedCities = localStorage.getItem("Cities")
    if (!loadedCities) {
        generateSearchBtn(city)
        saveCity(city)
        return
    }
    loadedCities = JSON.parse(loadedCities)
    for (let i = 0; i < loadedCities.length; i++) {
        if (city === loadedCities[i]) {
            return
        }
    }
    generateSearchBtn(city)
    saveCity(city)
}

const cityClickHandler = function(event) {
    let cityName = event.target.getAttribute("data-city")
    getLocationData(cityName)
}
// loads saved cities from local storage
const loadCities = function() {
    let loadedCities = localStorage.getItem("Cities")
    if (!loadedCities) {
        return;
    }
    loadedCities = JSON.parse(loadedCities)
    for (let i = 0; i < loadedCities.length; i++) {
        generateSearchBtn(loadedCities[i])
    }
}
// save cities
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
// generate searched city buttons
const generateSearchBtn = function(city) {
    let newButton = document.createElement("button")
    newButton.setAttribute("type", "button")
    newButton.setAttribute("data-city", city)
    newButton.innerText = city
    previousCities.appendChild(newButton)
    newButton.addEventListener("click", cityClickHandler)
}
// error handler
var handleError = function(response) {
    if (response.ok) {
        return response.json()
    }
    throw new Error('Failed to retrieve information: ' + response.status)
 }

// weather for city searched
const getLocationData = function(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
    .then(function(response) {
        return response.json()
    })
    .then(function(locationData) {
        console.log(locationData)
        if (locationData.length > 0) {
            getCurrentWeather(locationData[0].lat, locationData[0].lon)
            checkSearchOrigin(city)
            currentCity.innerText = locationData[0].name + " (" + dayjs().format('MM/DD/YYYY') + ")"
        }
        else {
            errorEl.style.display = "block"
            errorEl.innerText = "Not a valid city name"
        }
    })
    .catch(function(err) {
        console.log(err)
        errorEl.style.display = "block"
        errorEl.innerText = "Network error"
})
}
// fetch data for city based on lat & Lon
const getCurrentWeather = function(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function(response) {
        return response.json()
    })
    .then(function(weatherData) {
        console.log(weatherData)
        displayCurrentWeather(weatherData)
        displayFiveDayWeather(weatherData)
    })
}
// search button handler
var getCity = function(event) {
    event.preventDefault()
    errorEl.style.display = "none"
    var newCity = citySearch.value
    if (!newCity) {
        errorEl.style.display = "block"
        errorEl.innerText = "Please enter a city to search"
        return
    }
    getLocationData(newCity)
    citySearch.value = ""
}

loadCities();
searchBtn.addEventListener("click", getCity) 