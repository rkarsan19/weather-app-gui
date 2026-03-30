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
                units: "metric"
            }
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
                units: "metric"
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error("Forecast not found");
        }
        throw new Error("Forecast Error");
    }
};
