// Attach event listener to the form submission
document.querySelector('form').addEventListener('submit', handleSubmit);

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const cityName = document.getElementById('city-name').value;
  getWeather(cityName);
}

// Function to fetch weather and forecast data from the OpenWeather API
function getWeather(city) {
    const apiKey = '4cef8dc4543a33a89130377d5cf7d04b';
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentUrl)
      .then(response => {
        if (!response.ok) {
          alert("Location invalid.");
          throw new Error("Location invalid.");
        }
        return response.json();
      })
      .then(currentData => {currentWeather(currentData); })

    fetch(forecastUrl)
      .then(forecastResponse => forecastResponse.json())
      .then(forecastData => {forecastWeather(forecastData); })
}

// Function to update the weather information on the webpage
function currentWeather(data) {
    const info = document.getElementById('info');
    info.innerHTML = `
    <div class="container main-info">
    <!-- Date, time, temperature-->
      <section class="info-container">
          <div class="city fw-bolder" id="city">
          </div>
          <div class="current-weather">
              <img src="" class="w-icon "id="w-icon" alt="Weather icon">
              <span id="temp"></span>
              <span class="temp-unit">°C</span>
          </div>
          <div class="w-info fw-bold" id="w-info">
          </div>
      </section>
      <!-- City and weather icon -->
      <section class="weather-container">
          <div style="font-weight:bold; margin-bottom:20px; margin-left:20px;">
              Current details
          </div>
          <div class="row ms-2 me-2 gap-2">
              <div class="col-3">
                  <div class="w-items">
                      Humidity
                  </div>
                  <div class="w-items">
                      Pressure
                  </div>
                  <div class="w-items">
                      Wind
                  </div>
              </div>
              <div class="col-2" style="border-right: 2px solid rgba(255, 255, 255);">
                  <div class="w-items"> <span id="humidity">100</span> %</div>
                  <div class="w-items"> <span id="pressure">1000</span> hPa</div>
                  <div class="w-items"> <span id="wind">1</span> m/s</div>
              </div>
              <div class="col-4">
                  <div class="w-items">
                      Cloudiness
                  </div>
                  <div class="w-items">
                      Visibility
                  </div>
                  <div class="w-items">
                      Feels like
                  </div>
              </div>
              <div class="col-2">
                  <div class="w-items"> <span id="clouds"></span> %</div>
                  <div class="w-items"> <span id="visibility"></span> km</div>
                  <div class="w-items"> <span id="feelsLike"></span> °C </div>
              </div>
          </div>
      </section>
    </div>
    `
    // Main info
    const dateElement = document.getElementById('date');
    const tempElement = document.getElementById('temp');
    const weatherIconElement = document.getElementById('w-icon');
    const weatherInfoElement = document.getElementById('w-info');

    // Current items
    const cityElement = document.getElementById('city');
    const humidityElement = document.getElementById('humidity');
    const pressureElement = document.getElementById('pressure');
    const windElement = document.getElementById('wind');
    const cloudsElement = document.getElementById('clouds');
    const visibilityElement = document.getElementById('visibility');
    const feelsLikeElement = document.getElementById('feelsLike');

    tempElement.textContent = Math.round(data.main.temp);
    cityElement.textContent = data.name;
    humidityElement.textContent = data.main.humidity;
    pressureElement.textContent = data.main.pressure;
    cloudsElement.textContent = data.clouds.all;
    visibilityElement.textContent = data.visibility/1000;
    feelsLikeElement.textContent = Math.round(data.main.feels_like);
    windElement.textContent = Math.round(data.wind.speed);

    weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherInfoElement.textContent = data.weather[0].description;

    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + data.weather[0].description + "')";
}

// Function to update forecast data from openweather API
function forecastWeather(data) {
  const forecastContainer = document.getElementById('future-forecast');
  forecastContainer.innerHTML = ''; // Clear existing forecast data

  const {list : forecastList} = data;

  for (let i = 7, len = forecastList.length; i < len; i+= 8) {
    const { weather, dt_txt} = forecastList[i];
    const [{ description, icon }] = weather;
    const date = new Date(dt_txt);

    const forecastElement = document.createElement('div');
    forecastElement.classList.add('col', 'future-forecast');
    forecastElement.innerHTML = `
      <div class="day">${getDayOfWeek(date)}</div>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-icon">
      <div class="w-info">${description}</div>
    `;
    forecastContainer.appendChild(forecastElement);
  }
}

function getDayOfWeek(date) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[date.getUTCDay()];
}