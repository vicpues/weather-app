import "./styles/main.css";
import getWeatherData from "./data-fetching";
import updateWeatherCard from "./weather-card";

// State variables
let sessionUnits;
let sessionData;
let sessionQuery;
let storageAvailable = checkLocalStorage();

// Cache dom
const dom = cacheDom();

// Bind events
window.addEventListener("load", windowLoadedHandler);
dom.locationForm.addEventListener("submit", searchSubmitHandler);
dom.unitSwitch.addEventListener("click", unitSwitchHandler);

// Event Handlers
function windowLoadedHandler() {
    if (!storageAvailable) {
        return;
    }
    updateStateFromStorage();
    const units = sessionUnits ? sessionUnits : "metric";
    document.querySelector(`input[value="${units}"]`).checked = true;
    if (sessionQuery) {
        makeRequest();
    }
}

function searchSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(dom.locationForm);
    sessionQuery = formData.get("query");
    populateStorage();
    makeRequest();
}

function unitSwitchHandler() {
    sessionUnits = document.querySelector('input[name="units"]:checked').value;
    populateStorage();
    if (sessionData) {
        const card = dom.weatherCard;
        updateWeatherCard(card, sessionData, sessionUnits);
    }
}

// Utility functions
function cacheDom() {
    return {
        locationForm: document.querySelector("form#location-search"),
        weatherCard: document.querySelector("article.weather-card"),
        unitSwitch: document.querySelector("fieldset#units"),
    };
}

async function makeRequest() {
    try {
        const card = dom.weatherCard;
        sessionData = await getWeatherData(sessionQuery);
        updateWeatherCard(card, sessionData, sessionUnits);
    } catch (error) {
        const errorNotification = "There was a problem fetching weather data";
        console.error(errorNotification, error);
        alert(errorNotification);
    }
}

function updateStateFromStorage() {
    if (!storageAvailable) {
        return;
    }
    sessionUnits = window.localStorage.getItem("units");
    sessionQuery = window.localStorage.getItem("query");
}

function populateStorage() {
    if (!storageAvailable) {
        return;
    }
    if (sessionUnits) {
        window.localStorage.units = sessionUnits;
    }
    if (sessionQuery) {
        window.localStorage.query = sessionQuery;
    }
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
