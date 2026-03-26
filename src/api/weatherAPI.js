import axios from "axios";

const API_KEY = "a7657251c60511e39d11ef6d7415af29";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const REVERSE_GEOCODE_URL = "http://api.openweathermap.org/geo/1.0/reverse";

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

// NOTE: Extension (33 Marks).
// 1. Get the Weather/Forecast using the users location.
// 2. Show nearby areas.

export const getWeatherAndForecastByLocation = async () => {
    if (!navigator.geolocation) {
        return null;
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;

                    const response = await axios.get(REVERSE_GEOCODE_URL, {
                        params: {
                            lat: lat,
                            lon: lon,
                            appid: API_KEY,
                        },
                    });
                    const city = response.data[0].name;
                    console.log(city);
                    const forecastdata = await getForecastByCity(city);
                    const weatherdata = await getWeatherByCity(city);

                    // Calls get Forecast by City
                    resolve({
                        weatherdata,
                        forecastdata,
                    });
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                reject(error);
            },
        );
    });
};
