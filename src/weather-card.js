/**
 * @param {Element} cardElement
 * @param {Object} data
 * @param {string} units Either "metric" or "us"
 */
export default function updateWeatherCard(cardElement, userData, userUnits) {
    dom = cacheDom(cardElement);
    data = userData;
    units = userUnits;
    updateTextFields();
}

let dom;
let data;
let units;
const METRIC = "metric";
const US = "us";

/**
 * @param {Element} cardElement
 * @return {Obj<Element>} Dom
 */
function cacheDom(cardElement) {
    const dom = {};
    const selectors = {
        location: "h3.location-info",
        time: "h4.time-info",
        picture: "img.card-picture",
        description: "figcaption.card-description",
        temperature: "li.temperature p.data-text",
        cloudCover: "li.cloud-cover p.data-text",
        wind: "li.wind p.data-text",
        rain: "li.rain p.data-text",
        snow: "li.snow p.data-text",
        uvIndex: "li.uv-index p.data-text",
    };
    for (let [property, selector] of Object.entries(selectors)) {
        dom[property] = cardElement.querySelector(selector);
    }
    return dom;
}

function updateTextFields() {
    dom.location.textContent = data.location;
    dom.time.textContent = textFormatFunctions.time();
    dom.description.textContent = data.description;
    dom.temperature.textContent = textFormatFunctions.temperature();
    dom.cloudCover.textContent = `${data.cloudCoverPercent} %`;
    dom.wind.textContent = `${data.windKmh} Km/h`;
    dom.rain.textContent = `${data.precipProbPercent}% of ${data.precipMilimeters}mm`;
    dom.snow.textContent = `${data.snowDepthCentimeters}cm`;
    dom.uvIndex.textContent = `${data.uvIndex}`;
}

const textFormatFunctions = {
    time() {
        const timeHms = data.timeHour;
        const hours = Number(timeHms.slice(0, 2));
        const minutes = Number(timeHms.slice(3, 5));
        if (units === METRIC) {
            return `At ${hours}:${minutes}`;
        }
        if (units === US) {
            const suffix = hours <= 13 ? "am" : "pm";
            const usHours = hours <= 13 ? hours : hours - 12;
            return `At ${usHours}:${minutes} ${suffix}`;
        }
    },
    temperature() {
        let celsius = data.tempCelsius;
        if (units === METRIC) {
            celsius = Math.floor(celsius);
            return `${celsius} ºC`;
        }
        if (units === US) {
            let fahrenheit = Math.floor(celsius * 1.8 + 32);
            return `${fahrenheit} ºF`;
        }
    },
    wind() {},
    rain() {},
    snow() {},
    uvIndex() {},
};
