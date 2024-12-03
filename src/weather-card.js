/**
 * @param {Element} cardElement
 * @param {Object} data
 * @param {string} units Either "metric" or "us"
 */
export default function updateWeatherCard(cardElement, data, units) {
    const dom = cacheDom(cardElement);
    dom.location.textContent = data.location;
    dom.description.textContent = data.description;
    dom.temperature.textContent = `${data.tempCelsius}ºC`;
    dom.cloudCover.textContent = `${data.cloudCoverPercent}%`;
    dom.wind.textContent = `${data.windKmh} Km/h`;
    dom.rain.textContent = `${data.precipProbPercent}% of ${data.precipMilimeters}mm`;
    dom.snow.textContent = `${data.snowDepthCentimeters}cm`;
    dom.uvIndex.textContent = `${data.uvIndex}`;
}

/**
 * @param {Element} cardElement
 * @return {Obj<Element>} Dom
 */
function cacheDom(cardElement) {
    const dom = {};
    const selectors = {
        location: "h3.location-info",
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
