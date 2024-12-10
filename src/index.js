import "./styles/main.css";
import getWeatherData from "./data-fetching";
import updateWeatherCard from "./weather-card";

// State variables
let sessionUnits = getUnitsValue();
let sessionData;
let sessionQuery;
let storageAvailable;

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
        sessionData = await getWeatherData(formData.get("query"));
        updateWeatherCard(card, sessionData, sessionUnits);
    } catch (error) {
        const errorNotification = "There was a problem fetching weather data";
        console.error(errorNotification, error);
        alert(errorNotification);
    }
}

function unitSwitchHandler() {
    sessionUnits = getUnitsValue();
    if (sessionData) {
        const card = dom.weatherCard;
        updateWeatherCard(card, sessionData, sessionUnits);
    }
}

function getUnitsValue() {
    return document.querySelector('input[name="units"]:checked').value;
}

function updateFromStorage() {
    if (!storageAvailable) {
        return;
    }
    sessionUnits = window.localStorage.getItem("units");
    sessionQuery = window.localStorage.getItem("query");
}

function populateStorage(userUnits, userQuery) {
    if (!storageAvailable) {
        return;
    }
    window.localStorage.units = userUnits;
    window.localStorage.query = userQuery;
}

function checkLocalStorage() {
    let storage;
    try {
        storage = window.localStorage;
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            storage &&
            storage.length !== 0
        );
    }
}
