import "./styles/main.css";
import getWeatherData from "./data-fetching";
import updateWeatherCard from "./weather-card";

// State variables
let units = "us";
let data;

// Cache dom
const dom = cacheDom();

// Bind events
dom.form.addEventListener("submit", searchSubmitHandler);

function cacheDom() {
    return {
        form: document.querySelector("form#location-search"),
    };
}

/**@param {SubmitEvent} event */
async function searchSubmitHandler(event) {
    try {
        event.preventDefault();
        const card = document.querySelector("article.weather-card");
        const formData = new FormData(dom.form);
        data = await getWeatherData(formData.get("query"));
        updateWeatherCard(card, data, units);
    } catch (error) {
        const errorNotification = "There was a problem fetching weather data";
        console.error(errorNotification, error);
        alert(errorNotification);
    }
}
