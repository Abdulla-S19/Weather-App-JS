const userinput = document.getElementById("userinput");
const result1 = document.getElementById("result1");
const result2 = document.getElementById("result2");
const getDetailsButton = document.getElementById("getDetailsButton");

result1.style.display = "none";
result2.style.display = "none";

const countryStatus = async () => {
    console.log(userinput.value);
    if (userinput.value) {
        let geocodeResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userinput.value}&limit=1&appid=0949f6f524fa5ee6e5981309bc89fde9`);
        let locationData = await geocodeResponse.json();

        if (locationData.length > 0) {
            const { name, state, country } = locationData[0];

            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=0949f6f524fa5ee6e5981309bc89fde9&units=metric`);
            if (response.status == 200) {
                let WeatherDetails = await response.json();

                const tempInCelsius = WeatherDetails.main.temp;
                const tempInFahrenheit = Math.round((tempInCelsius * 1.8) + 32);

                const selectedUnit = document.getElementById('unit-select').value;
                const displayTemp = selectedUnit === "fahrenheit" ? `${tempInFahrenheit}°F` : `${Math.round(tempInCelsius)}°C`;

                result1.innerHTML = `
                    <div class="date-place">
                        <h4 class="place">
                            <i class="fa-solid fa-location-dot"></i>
                            ${name}, ${state ? `${state}, ` : ''}<span>${country}</span>
                        </h4>
                    </div>
                    <h1 class="degree">
                        <span id="degree-value">${displayTemp}</span>
                    </h1>
                    <h4 class="mood">
                        <i class="fa-solid fa-cloud"></i>
                        ${WeatherDetails.weather[0].main}
                    </h4>`;

                result2.innerHTML = `
                    <div class="additional-content">
                        <div class="add-items">
                            <h1><span>${WeatherDetails.main.pressure} hPa</span></h1>
                            <p>PRESSURE</p>
                        </div>
                        <div class="add-items">
                            <h1><span>${WeatherDetails.wind.speed} MP/S</span></h1>
                            <p>WIND</p>
                        </div>
                        <div class="add-items">
                            <h1><span>${WeatherDetails.main.humidity} %</span></h1>
                            <p>HUMIDITY</p>
                        </div>
                        <div class="add-items">
                            <h1><span>${WeatherDetails.clouds.all} %</span></h1>
                            <p>CLOUDINESS</p>
                        </div>
                    </div>`;

                result1.style.display = "block";
                result2.style.display = "block";
            } else {
                result1.innerHTML = `<p class="error">City not found. Please try again.</p>`;
                result2.innerHTML = "";
                result1.style.display = "block";
                result2.style.display = "none";
            }
        } else {
            result1.innerHTML = `<p class="error">Invalid location. Please try again.</p>`;
            result2.innerHTML = "";
            result1.style.display = "block";
            result2.style.display = "none";
        }
    }
};

userinput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        countryStatus();
    }
});

document.getElementById('unit-select').addEventListener('change', () => {
    countryStatus();
});

getDetailsButton.addEventListener('click', () => {
    countryStatus();
});
