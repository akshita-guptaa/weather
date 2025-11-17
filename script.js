let apiKey = "YOUR_API_KEY_HERE";

let ip = document.getElementById("ip");
let sbtn = document.getElementById("sbtn");
let output = document.getElementById("weatherinfo");
const loader = document.getElementById("loader");

sbtn.addEventListener("click", getWeather);
ip.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = ip.value.trim();
    if (city === "") {
        output.innerText = "Please enter a city name";
        output.classList.add('active');
        return;

    }

    const fullUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    loader.classList.add('active');
    output.classList.remove('active');
    output.innerHTML = "";
    try {

        const res = await fetch(fullUrl);
        if (!res.ok) { // Good practice to check if the response is valid
            throw new Error("City not found or API key is invalid.");
        }

        const data = await res.json();
        localStorage.setItem('lastCity', data.name);

        displayWeatherData(data);

    } catch (err) {
        displayError(err.message); // Call function to display error
    } finally {
        loader.classList.remove('active'); // Always hide spinner afterward
    }
}

function displayWeatherData(data) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    // Get current date and time
    const now = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    };
    
    const currentDate = now.toLocaleDateString('en-US', dateOptions);
    const currentTime = now.toLocaleTimeString('en-US', timeOptions);

    const weatherHtml = `
        <div class="weather-container">
            <div class="left-section">
                <div class="weather-icon">
                    <img src="${iconUrl}" alt="Weather icon">
                </div>
                <div class="datetime-info">
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p class="date-time">${currentDate}</p>
                    <p class="current-time">${currentTime}</p>
                </div>
            </div>
            <div class="right-section">
                <p class="weather-desc">${data.weather[0].description}</p>
                <div class="weather-info">
                    <span>Temperature: ${data.main.temp}°C</span>
                    <span>Feels Like: ${data.main.feels_like}°C</span>
                    <span>Today's High: ${data.main.temp_max}°C</span>
                    <span>Today's Low: ${data.main.temp_min}°C</span>
                    <span>Humidity: ${data.main.humidity}%</span>
                    <span>Wind Speed: ${data.wind.speed} m/s</span>
                </div>
            </div>
        </div>
    `;
    output.innerHTML = weatherHtml;
    output.classList.add('active'); // Show the results box
}

// --- Function to Display an Error ---
function displayError(message) {
    output.innerHTML = `<p style="color: red;">${message}</p>`;
    output.classList.add('active'); // Show the error box
}

// --- Function to Load Last City on Page Load ---
function loadLastCity() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        ip.value = lastCity;
        getWeather();
    }
}

// --- Run on page load ---
loadLastCity();







