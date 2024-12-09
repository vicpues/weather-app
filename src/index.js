import "./styles/main.css";
import getWeatherData from "./data-fetching";
import updateWeatherCard from "./weather-card";

// State variables
let units = getUnitsValue();
let data;

// Cache dom
const dom = cacheDom();

// Bind events
dom.locationForm.addEventListener("submit", searchSubmitHandler);
dom.unitSwitch.addEventListener("click", unitSwitchHandler);

function cacheDom() {
    return {
        locationForm: document.querySelector("form#location-search"),
        weatherCard: document.querySelector("article.weather-card"),
        unitSwitch: document.querySelector("fieldset#units"),
    };
}

/**@param {SubmitEvent} event */
async function searchSubmitHandler(event) {
    try {
        event.preventDefault();
        const card = dom.weatherCard;
        const formData = new FormData(dom.locationForm);
        data = await getWeatherData(formData.get("query"));
        updateWeatherCard(card, data, units);
    } catch (error) {
        const errorNotification = "There was a problem fetching weather data";
        console.error(errorNotification, error);
        alert(errorNotification);
    }
}

function unitSwitchHandler() {
    units = getUnitsValue();
    if (data) {
        const card = dom.weatherCard;
        updateWeatherCard(card, data, units);
    }
}

function getUnitsValue() {
    return document.querySelector('input[name="units"]:checked').value;
}
