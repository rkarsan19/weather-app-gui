import "./weather_styles/style.css";
import React, { useState, useEffect } from "react";
import { getWeatherByCity, getForecastByCity } from "./api/weatherAPI";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";

const App = () => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [forecast, setForecast] = useState(null);
    const [selectedTime, setSelectedTime] = useState("12:00:00"); // default to midday forecast

    const handleSearch = async (city) => {
        try {
            setError("");

            const data = await getWeatherByCity(city);
            const forecastData = await getForecastByCity(city);

            setForecast(forecastData);
            setWeather(data);
        } catch (err) {
            setWeather(null);
            setForecast(null);
            setError(err.message);
        }
    };

    const filteredForecast = forecast?.list.filter((item) =>
        item.dt_txt.includes(selectedTime),
    );

    const getDayWithOrdinal = (day) => {
        const j = day % 10,
            k = day % 100;
        if (j === 1 && k !== 11) return `${day}st`;
        if (j === 2 && k !== 12) return `${day}nd`;
        if (j === 3 && k !== 13) return `${day}rd`;
        return `${day}th`;
    };

    const formatForecastDate = (isoString) => {
        const date = new Date(isoString);
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
        const day = getDayWithOrdinal(date.getDate());
        const year = date.getFullYear();
        return `${weekday} ${day} ${year}`;
    };

    return (
        <div className="App">
            <h1>Weather App</h1>
            <SearchBar onSearch={handleSearch} />
            <WeatherCard data={weather} />
            <Forecast
                filteredForecast={filteredForecast}
                formatForecastDate={formatForecastDate}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}

            {forecast && (
                <div>
                    <h3>5-Day Forecast</h3>

                    <label>Select time: </label>
                    <select
                        onChange={(e) => setSelectedTime(e.target.value)}
                        value={selectedTime}
                    >
                        <option value="09:00:00">Morning (09:00)</option>
                        <option value="12:00:00">Afternoon (12:00)</option>
                        <option value="15:00:00">Late Afternoon (15:00)</option>
                        <option value="18:00:00">Evening (18:00)</option>
                    </select>

                    <div className="forecast-grid">
                        {filteredForecast.map((item, index) => (
                            <div className="forecast-card" key={index}>
                                <div className="forecast-date">
                                    {formatForecastDate(
                                        item.dt_txt.split(" ")[0],
                                    )}
                                </div>
                                <div className="forecast-temp">
                                    {Math.round(item.main.temp)}°C
                                </div>
                                <div className="forecast-desc">
                                    {item.weather[0].description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
