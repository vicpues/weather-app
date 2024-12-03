import "./styles/main.css";
import getWeatherData from "./data-fetching";
import updateWeatherCard from "./weather-card";

const exampleData = {
    location: "Madrid, Comunidad de Madrid, España",
    description: "Overcast",
    tempCelsius: 15.3,
    cloudCoverPercent: 100,
    windKmh: 7.9,
    windDegrees: 171,
    precipMilimeters: 0,
    precipProbPercent: 0,
    snowDepthCentimeters: 0,
    uvIndex: 4,
    timeHour: "15:15:00",
    timeEpoch: 1733235300,
    sunriseEpoch: 1733210463,
    sunsetEpoch: 1733244502,
};

const weatherCard = document.querySelector(".weather-card");
updateWeatherCard(weatherCard, exampleData, "metric");
