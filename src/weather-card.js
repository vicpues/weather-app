import imgSnowHeavy from "./assets/pictures/snow-heavy.svg";
import imgSnowLight from "./assets/pictures/snow-light.svg";
import imgRainHeavy from "./assets/pictures/rainy-heavy.svg";
import imgRainDay from "./assets/pictures/rainy-day.svg";
import imgStorm from "./assets/pictures/stormy.svg";
import imgCold from "./assets/pictures/cold.svg";
import imgHot from "./assets/pictures/hot.svg";
import imgOvercast from "./assets/pictures/overcast.svg";
import imgCloudNight from "./assets/pictures/cloudy-night.svg";
import imgCloudDay from "./assets/pictures/cloudy-day.svg";
import imgClearNight from "./assets/pictures/clear-night.svg";
import imgClearDay from "./assets/pictures/clear-day.svg";
import imgLoading from "./assets/pictures/loading.svg";

/**
 * @param {Element} cardElement
 * @param {Object} data
 * @param {string} units Either "metric" or "us"
 */
export default function updateWeatherCard(cardElement, userData, userUnits) {
    dom = cacheDom(cardElement);
    data = userData;
    units = userUnits;
    console.log(data);
    startLoadingAnimation();
    updateTextFields();
    updateImageAttributes();
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
    dom.time.textContent = formatFunctions.time();
    dom.description.textContent = data.description;
    dom.temperature.textContent = formatFunctions.temperature();
    dom.cloudCover.textContent = `${data.cloudCoverPercent} %`;
    dom.wind.textContent = formatFunctions.wind();
    dom.rain.textContent = formatFunctions.rain();
    dom.snow.textContent = formatFunctions.snow();
    dom.uvIndex.textContent = data.uvIndex;
}

const formatFunctions = {
    time() {
        const timeHms = data.timeHour;
        const hours = Number(timeHms.slice(0, 2));
        const minutes = timeHms.slice(3, 5);
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
    wind() {
        let windKmh = data.windKmh;
        let windDegrees = data.windDegrees;
        let windLookup = [
            [23, "N"],
            [68, "NE"],
            [113, "E"],
            [158, "SE"],
            [203, "S"],
            [248, "SW"],
            [293, "W"],
            [338, "NW"],
            [360, "N"],
        ];
        const windArr = windLookup.find((arr) => arr[0] >= windDegrees);
        if (units === METRIC) {
            windKmh = Math.floor(windKmh);
            return `${windKmh} Km/h ${windArr[1]}`;
        }
        if (units === US) {
            let windMph = Math.floor(windKmh * 0.621371);
            return `${windMph} mph ${windArr[1]}`;
        }
    },
    rain() {
        const percentString = `${Math.ceil(data.precipProbPercent)} %`;
        let precipMm = data.precipMilimeters;
        if (units === METRIC) {
            precipMm = Math.ceil(precipMm);
            return `${percentString} of ${precipMm} mm`;
        }
        if (units === US) {
            let precipInches = Math.ceil(precipMm / 25.4);
            return `${percentString} of ${precipInches} in.`;
        }
    },
    snow() {
        let snowCm = data.snowDepthCentimeters;
        if (units === METRIC) {
            snowCm = Math.ceil(snowCm);
            return `${snowCm} cm`;
        }
        if (units === US) {
            let snowInches = Math.ceil(snowCm / 2.54);
            return `${snowInches} in.`;
        }
    },
};

function startLoadingAnimation() {
    dom.picture.src = imgLoading;
    dom.picture.classList.add("spin");
}

function updateImageAttributes() {
    const imgData = getImgData();
    dom.picture.classList.remove("spin");
    dom.picture.src = imgData.src;
    dom.picture.alt = imgData.alt;
}

function getImgData() {
    let src;
    let alt;
    const isNight =
        data.timeEpoch > data.sunsetEpoch || data.timeEpoch < data.sunriseEpoch;
    if (data.snowDepthCentimeters >= 10) {
        src = imgSnowHeavy;
        alt = "A cloud with heavy snow";
    } else if (data.snowDepthCentimeters > 0) {
        src = imgSnowLight;
        alt = "A cloud with light snow";
    } else if (
        data.precipMilimeters > 10 ||
        (data.precipMilimeters > 0 && isNight) ||
        (data.precipMilimeters > 0 && data.cloudCoverPercent > 80)
    ) {
        src = imgRainHeavy;
        alt = "A rainy cloud";
    } else if (data.precipMilimeters > 0) {
        src = imgRainDay;
        alt = "A rainy cloud with the sun peeking behind it";
    } else if (data.windKmh > 50 && data.cloudCoverPercent > 50) {
        src = imgStorm;
        alt = "A storm cloud with rain and lightning";
    } else if (
        data.tempCelsius < -10 ||
        (data.tempCelsius < 0 && data.cloudCoverPercent < 25)
    ) {
        src = imgCold;
        alt =
            "A blue thermometer showing a low temperature with snowflakes next to it";
    } else if (
        data.tempCelsius > 37 ||
        (data.tempCelsius > 32 && data.cloudCoverPercent < 25)
    ) {
        src = imgHot;
        alt =
            "A red thermometer showing a high temperature with a melting sun next to it";
    } else if (data.cloudCoverPercent > 85) {
        src = imgOvercast;
        alt = "A group of overcast clouds";
    } else if (data.cloudCoverPercent > 25 && isNight) {
        src = imgCloudNight;
        alt = "A cloud with the moon and some stars peeking behind it";
    } else if (data.cloudCoverPercent > 25) {
        src = imgCloudDay;
        alt = "A cloud with the sun peeking behind it";
    } else if (isNight) {
        src = imgClearNight;
        alt = "A large crescent moon with a star next to it";
    } else {
        src = imgClearDay;
        alt = "A clear, bright sun";
    }
    return {
        src,
        alt,
    };
}
