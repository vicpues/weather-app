/**
 * @param {Element} cardElement
 * @param {Object} data
 * @param {string} units Either "metric" or "us"
 */
export default function updateWeatherCard(cardElement, data, userUnits) {
    units = userUnits;
    const dom = cacheDom(cardElement);
    updateTextFields(dom, data);
}

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

function updateTextFields(dom, data) {
    dom.location.textContent = textFormatFunctions.location(data);
    dom.time.textContent = textFormatFunctions.time(data);
    dom.description.textContent = data.description;
    dom.temperature.textContent = `${data.tempCelsius}ºC`;
    dom.cloudCover.textContent = `${data.cloudCoverPercent}%`;
    dom.wind.textContent = `${data.windKmh} Km/h`;
    dom.rain.textContent = `${data.precipProbPercent}% of ${data.precipMilimeters}mm`;
    dom.snow.textContent = `${data.snowDepthCentimeters}cm`;
    dom.uvIndex.textContent = `${data.uvIndex}`;
}

const textFormatFunctions = {
    location(data) {
        return data.location;
    },
    time(data) {
        const timeHms = data.timeHour;
        const hours = Number(timeHms.slice(0, 2));
        const minutes = Number(timeHms.slice(3, 5));
        return `At ${unitConversions.time(hours, minutes)}`;
    },
    description(data) {},
    temperature(data) {},
    cloudCover(data) {},
    wind(data) {},
    rain(data) {},
    snow(data) {},
    uvIndex(data) {},
};

const unitConversions = {
    time(hours, minutes) {
        if (units === METRIC) {
            return `${hours}:${minutes}`;
        }
        if (units === US) {
            const suffix = hours <= 13 ? "am" : "pm";
            const usHours = hours <= 13 ? hours : (hours - 12);
            return `${usHours}:${minutes} ${suffix}`
        }
    },
};
