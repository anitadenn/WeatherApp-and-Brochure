const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherCard = document.querySelector('.weather-card');
const displayCityImage = document.querySelector('.display-city-image');
const image = document.getElementById('image');
const placeholderP = document.querySelector('.display-city-image p');
const cityImage = document.querySelector('.display-city-image img');
const displayFact = document.querySelector('.display-fact');
const loader = document.getElementById("loader");
const weatherApiKey = "33c1c35145c123426b62b56a72cc7358";
const ImageApiAccessKey = "ffxo__QfUzR5oEOahY-I_7iWlB_kOBj4Z-kScbo0Eyc";
const infoApiKey = "oFzD9GBOnlvUtIuLwd/TYQ==73HOll6iTznArrXU"


searchBtn.addEventListener('click', async (event) => {
    const city = cityInput.value.trim();
    if(city){
        try{ 
            
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            await getCityImage(city);
            await getCityInfo(city)


        }
        catch(error){
            console.error(error);
            displayError(error); 
        }

    }
    else{
        displayError("Please Enter a city");
    }
})


async function getWeatherData(city){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`
    const response = await fetch(apiUrl);
    
    if(!response.ok){
        throw new Error("could not fetch weather data")
    }
    return await response.json(); 

}

function displayWeatherInfo(data){
        const {name: city, 
           main: {temp, humidity}, 
           weather: [{description, id}]} = data; 
    

    weatherCard.textContent = "";
    // weatherCard.style.display = "flex";
    // weatherCard.style.flexDirection


    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const emojiDisplay = document.createElement("p");

    cityDisplay.textContent = city;
    cityDisplay.classList.add("city-display");
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    tempDisplay.classList.add("temp-display");
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add('humidity-display');
    descDisplay.textContent = description;
    descDisplay.classList.add('description-display');
    emojiDisplay.textContent = getWeatherEmoji(id);
    emojiDisplay.classList.add('emoji');



    weatherCard.appendChild(cityDisplay);
    weatherCard.appendChild(tempDisplay);
    weatherCard.appendChild(humidityDisplay);
    weatherCard.appendChild(descDisplay);
    weatherCard.appendChild(emojiDisplay);
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 500):
            return "🌦️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❔";
    }
}

async function getCityImage(city){
    const ImageApiUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${ImageApiAccessKey}`;

    try {

        image.style.display = "none";
        loader.style.display = "block";

        const response = await fetch(ImageApiUrl);

        if (!response.ok) {
            throw new Error(`Could not fetch photo`);
        }

        const data = await response.json();
        console.log(data);


        const imageUrl = data.urls.regular;

        const photographer = data.user.name;
        const photographerUrl = data.user.links.html;
        const attribution = `Photo by ${photographer} on Unsplash`;

        placeholderP.style.display = 'none';
        image.src = data.urls.regular + `&t=${Date.now()}`;
        image.title = attribution
        image.style.display = "flex";

        image.onload = () => {
            loader.style.display = "none"; 
            image.style.display = "flex";   
        };


    } 
    catch (error) {
        console.error(error);
        placeholderP.textContent = `Could not fetch image for ${city}`
    }
}


async function getCityInfo(city){

    const infoApiUrl = `https://api.api-ninjas.com/v1/city?name=${city}`;
    try{
        const response = await fetch(infoApiUrl, {method: "GET", headers: { "X-Api-Key": `${infoApiKey}`}})

        if (!response.ok) {
            throw new Error(`Could not fetch city Info`);
        }

        const data = await response.json();
        console.log(data);

        const [citydeets] = data;
        const { name, country, population } = citydeets;

        const info = document.createElement('p');
        displayFact.textContent = ""
        info.textContent = `${name} is located in ${country} and has a population of ${population}`
        displayFact.appendChild(info);
    }
    catch(error){
        console.error(error)
        displayFact.textContent = `Could not fetch info for ${city}, maybe because it's a country and i only used a city api lmao`
    }
        

}


function displayError(message){
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    weatherCard.textContent = "";
    weatherCard.style.display = "flex";
    weatherCard.appendChild(errorDisplay);
}



















































