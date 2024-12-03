/**
 * @param {string} query
 * @returns {{
 * location: string,
 * description: string,
 * tempCelsius: number,
 * cloudCoverPercent: number,
 * windKmh: number,
 * windDegrees: number,
 * precipMilimiters: number,
 * precipProbPercent: number
 * snowDepth: number,
 * uvIndex: number,
 * timeHour: string,
 * timeEpoch: number,
 * sunriseEpoch: number,
 * sunsetEpoch: number,
 * }} Weather data
 */
export default async function getWeatherData(query) {
    const encodedQuery = encodeURI(query);
    const response = await callWeatherAPI(encodedQuery);
    const data = extractData(response);
    return data;
}

async function callWeatherAPI(query) {
    try {
        return fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}/today?unitGroup=metric&include=current&key=UBL9CLWY4JCV5ZZYVBPEWYYN5`,
            { mode: "cors" },
        );
    } catch (error) {
        console.error(`Failed to contact weather API:`, error);
        throw error;
    }
}

async function extractData(response) {
    try {
        const json = await response.json();
        const location = json.resolvedAddress;
        const rawData = json.currentConditions;
        const data = {
            location,
            description: rawData.conditions,
            tempCelsius: rawData.temp,
            cloudCoverPercent: rawData.cloudcover,
            windKmh: rawData.windspeed,
            windDegrees: rawData.winddir,
            precipLiters: rawData.precip,
            precipProbPercent: rawData.precipprob,
            snowDepth: rawData.snowdepth,
            uvIndex: rawData.uvindex,
            timeHour: rawData.datetime,
            timeEpoch: rawData.datetimeEpoch,
            sunriseEpoch: rawData.sunriseEpoch,
            sunsetEpoch: rawData.sunsetEpoch,
        };
        return data;
    } catch (error) {
        console.error("Failed to parse response:", error);
        throw error;
    }
}
