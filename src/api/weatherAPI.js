// weatherAPI.js — handles all the calls to the OpenWeatherMap API.
// Everything that touches the API lives here so the components stay clean.

import axios from "axios";

// Our OpenWeatherMap API key — needed for every request
const API_KEY = "a7657251c60511e39d11ef6d7415af29";

// The two API endpoints we use:
// BASE_URL for current weather, FORECAST_URL for the 5-day / 3-hour forecast
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Fetches current weather for a city name e.g. "London".
// Returns the full weather object or throws an error if the city isn't found.
export const getWeatherByCity = async (city) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: "metric", // gives us celsius instead of kelvin
            },
        });
        return response.data;
    } catch (error) {
        // 404 means the city name didn't match anything in the API
        if (error.response && error.response.status === 404) {
            throw new Error("City not found");
        }
        throw new Error("Failed to fetch weather data");
    }
};

// Fetches the 5-day forecast for a city, broken into 3-hour intervals.
// We use this to build both the hourly strip and the 5-day forecast grid.
export const getForecastByCity = async (city) => {
    try {
        const response = await axios.get(FORECAST_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: "metric",
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error("Forecast not found");
        }
        throw new Error("Forecast Error");
    }
};

// Same as getWeatherByCity but takes coordinates instead of a city name.
// Used when the user clicks the GPS button — we get lat/lon from the browser
// and pass them straight to the API.
export const getWeatherByCoords = async (lat, lon) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: { lat, lon, appid: API_KEY, units: "metric" },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch weather for your location");
    }
};

// Same idea as getForecastByCity but using coordinates instead of a city name
export const getForecastByCoords = async (lat, lon) => {
    try {
        const response = await axios.get(FORECAST_URL, {
            params: { lat, lon, appid: API_KEY, units: "metric" },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch forecast for your location");
    }
};

// Called when the user clicks the GPS button.
// First asks the browser for the user's coordinates, then fetches both
// the current weather and forecast for that location in one go.
// Returns { weather, forecast } or throws if location access is denied.
export const getWeatherForCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
        // Check the browser actually supports geolocation before trying
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const { latitude: lat, longitude: lon } = coords;
                    // Fetch both at the same time to save a bit of load time
                    const [weather, forecast] = await Promise.all([
                        getWeatherByCoords(lat, lon),
                        getForecastByCoords(lat, lon),
                    ]);
                    resolve({ weather, forecast });
                } catch (error) {
                    reject(error);
                }
            },
            () => {
                // This fires if the user clicks "Block" on the location popup
                reject(new Error("Location access denied"));
            },
        );
    });
};

// Filters the full 3-hourly forecast list down to one entry per day
// at a specific time e.g. "12:00:00". Used for the 5-day forecast grid.
export const filterForecastByTime = (forecastData, timeString = "12:00:00") => {
    if (!forecastData?.list) return [];
    return forecastData.list.filter((item) => item.dt_txt.includes(timeString));
};

// Our extension feature — takes a weather object and works out how good
// the commute conditions are on a scale of 1 to 5.
//
// It checks rain, snow, wind, temperature, visibility and humidity,
// deducting points for bad conditions and building up a list of specific tips.
// The result is a score, a label, a colour and an array of advice strings
// which App.js renders in the commute score panel.
//
// We built this because our survey of 23 commuters showed they want
// practical advice tailored to their journey — not just raw weather numbers.
export const getCommuteScore = (weatherData) => {
    if (!weatherData) return null;

    const description = weatherData.weather[0].description.toLowerCase();
    const windSpeedMs = weatherData.wind.speed;
    const windSpeedKph = windSpeedMs * 3.6; // convert m/s to km/h for easier thresholds
    const temp = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const visibility = weatherData.visibility ?? 10000; // defaults to 10km if API doesn't return it

    // Start at 5 and deduct points for bad conditions
    let score = 5;
    const advice = [];

    // Rain — biggest concern from our data gathering.
    // Thunderstorms are worst (-3), heavy rain is bad (-2), light rain just gets a tip
    if (description.includes("thunderstorm")) {
        score -= 3;
        advice.push("⛈️ Thunderstorm — avoid cycling or walking, use covered transport");
    } else if (description.includes("heavy rain") || description.includes("heavy shower")) {
        score -= 2;
        advice.push("🌧️ Heavy rain — waterproof jacket and umbrella essential");
    } else if (
        description.includes("rain") ||
        description.includes("drizzle") ||
        description.includes("shower")
    ) {
        score -= 1;
        advice.push("☂️ Carry an umbrella — rain expected during your commute");
    }

    // Snow and ice — major disruption risk especially for public transport
    if (description.includes("snow") || description.includes("blizzard")) {
        score -= 2;
        advice.push("🌨️ Snow expected — allow extra travel time and dress warmly");
    } else if (description.includes("sleet") || description.includes("freezing")) {
        score -= 2;
        advice.push("🧊 Icy conditions — watch your footing and drive carefully");
    }

    // Wind — particularly important for cyclists and delivery drivers
    if (windSpeedKph > 50) {
        score -= 2;
        advice.push("💨 Dangerous winds — avoid cycling, expect transport delays");
    } else if (windSpeedKph > 28) {
        score -= 1;
        advice.push("🚴 Strong headwinds — cyclists allow extra time");
    } else if (windSpeedKph > 20) {
        advice.push("🌬️ Breezy conditions — secure loose items");
    }

    // Temperature — we use feels like here since that's what actually matters
    // for deciding what to wear, which commuters told us is a top concern
    if (feelsLike < 0) {
        score -= 1;
        advice.push("🥶 Below freezing — wear a heavy coat, hat and gloves");
    } else if (feelsLike < 5) {
        advice.push("🧣 Very cold — layer up before heading out");
    } else if (temp > 32) {
        score -= 1;
        advice.push("🥵 Extreme heat — stay hydrated and wear sunscreen");
    } else if (temp > 26) {
        advice.push("☀️ Hot day — light clothing and water recommended");
    }

    // Visibility — important for cyclists and drivers, especially in fog
    if (visibility < 200) {
        score -= 2;
        advice.push("🌫️ Very poor visibility — avoid driving if possible");
    } else if (visibility < 1000) {
        score -= 1;
        advice.push("🌁 Foggy — drive slowly and use fog lights");
    }

    // Humidity — only flag it if it's not already raining (redundant otherwise)
    if (humidity > 90 && !description.includes("rain")) {
        advice.push("💦 Very humid — lightweight breathable clothing recommended");
    }

    // Don't let the score go below 1
    if (score < 1) score = 1;

    // Map the final score to a label and colour
    // Green for good, yellow/orange for moderate, red for bad
    const scoreMap = {
        5: { label: "Great commute conditions", colour: "#22c55e" },
        4: { label: "Good commute conditions", colour: "#84cc16" },
        3: { label: "Manageable — come prepared", colour: "#f59e0b" },
        2: { label: "Difficult — plan carefully", colour: "#f97316" },
        1: { label: "Poor — consider alternatives", colour: "#ef4444" },
    };

    // If nothing was flagged, give a positive confirmation instead of an empty list
    if (advice.length === 0) {
        advice.push("✅ No issues expected — good conditions for your commute");
    }

    return {
        score,
        ...scoreMap[score],
        advice,
    };
};