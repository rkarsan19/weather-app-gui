import axios from "axios";

const API_KEY = "a7657251c60511e39d11ef6d7415af29";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

//get the current weather for a specific city
export const getWeatherByCity = async (city) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: "metric",
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error("City not found");
        }
        throw new Error("Failed to fetch weather data");
    }
};

//get the forecast for a specific city
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

// ─────────────────────────────────────────────
// BY COORDINATES (used for auto-detect on load)
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// GEOLOCATION HELPER
// Asks browser for user's position, then fetches
// both weather + forecast in one call.
// Returns: { weather, forecast } or throws.
// ─────────────────────────────────────────────

export const getWeatherForCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const { latitude: lat, longitude: lon } = coords;
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
                reject(new Error("Location access denied"));
            },
        );
    });
};

// ─────────────────────────────────────────────
// FORECAST FILTER HELPER
// Filters forecast list to one entry per day
// at a given time string e.g. "12:00:00"
// ─────────────────────────────────────────────

export const filterForecastByTime = (forecastData, timeString = "12:00:00") => {
    if (!forecastData?.list) return [];
    return forecastData.list.filter((item) => item.dt_txt.includes(timeString));
};

// ─────────────────────────────────────────────
// COMMUTE SCORE HELPER
//
// Takes a weather data object (from getWeatherByCity
// or getWeatherByCoords) and returns:
// {
//   score: number,     // 1 (terrible) to 5 (great)
//   label: string,     // e.g. "Good commute conditions"
//   advice: string[],  // list of actionable tips
//   colour: string     // CSS colour for the React guy to apply to the card
// }
//
// The React guy just calls this and renders the result —
// no scoring logic needed in his components.
// ─────────────────────────────────────────────

export const getCommuteScore = (weatherData) => {
    if (!weatherData) return null;

    const description = weatherData.weather[0].description.toLowerCase();
    const windSpeedMs = weatherData.wind.speed;
    const windSpeedKph = windSpeedMs * 3.6;
    const temp = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const visibility = weatherData.visibility ?? 10000; // metres, API default if missing

    let score = 5;
    const advice = [];

    // ── Rain / precipitation ──
    if (description.includes("thunderstorm")) {
        score -= 3;
        advice.push(
            "⛈️ Thunderstorm — avoid cycling or walking, use covered transport",
        );
    } else if (
        description.includes("heavy rain") ||
        description.includes("heavy shower")
    ) {
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

    // ── Snow / ice ──
    if (description.includes("snow") || description.includes("blizzard")) {
        score -= 2;
        advice.push(
            "🌨️ Snow expected — allow extra travel time and dress warmly",
        );
    } else if (
        description.includes("sleet") ||
        description.includes("freezing")
    ) {
        score -= 2;
        advice.push(
            "🧊 Icy conditions — watch your footing and drive carefully",
        );
    }

    // ── Wind ──
    if (windSpeedKph > 50) {
        score -= 2;
        advice.push(
            "💨 Dangerous winds — avoid cycling, expect transport delays",
        );
    } else if (windSpeedKph > 28) {
        score -= 1;
        advice.push("🚴 Strong headwinds — cyclists allow extra time");
    } else if (windSpeedKph > 20) {
        advice.push("🌬️ Breezy conditions — secure loose items");
    }

    // ── Temperature / feels like ──
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

    // ── Visibility / fog ──
    if (visibility < 200) {
        score -= 2;
        advice.push("🌫️ Very poor visibility — avoid driving if possible");
    } else if (visibility < 1000) {
        score -= 1;
        advice.push("🌁 Foggy — drive slowly and use fog lights");
    }

    // ── Humidity ──
    if (humidity > 90 && !description.includes("rain")) {
        advice.push(
            "💦 Very humid — lightweight breathable clothing recommended",
        );
    }

    // ── Floor at 1 ──
    if (score < 1) score = 1;

    // ── Label and colour based on final score ──
    const scoreMap = {
        5: { label: "Great commute conditions", colour: "#22c55e" },
        4: { label: "Good commute conditions", colour: "#84cc16" },
        3: { label: "Manageable — come prepared", colour: "#f59e0b" },
        2: { label: "Difficult — plan carefully", colour: "#f97316" },
        1: { label: "Poor — consider alternatives", colour: "#ef4444" },
    };

    // Positive note if nothing flagged
    if (advice.length === 0) {
        advice.push("✅ No issues expected — good conditions for your commute");
    }

    return {
        score,
        ...scoreMap[score],
        advice,
    };
};

