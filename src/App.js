import "./weather_styles/style.css";
import React, { useState, useEffect } from "react";
import {
    getWeatherByCity,
    getForecastByCity,
    getWeatherForCurrentLocation,
} from "./api/weatherAPI";
import SearchBar from "./components/SearchBar.js";
import WeatherCard from "./components/WeatherCard.js";
import GPSButton from "./components/GPSButton";

const DEFAULT_CITIES = ["New York", "Tokyo", "London", "Paris"];

const App = () => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [forecast, setForecast] = useState(null);
    const [selectedTime, setSelectedTime] = useState("12:00:00"); // default to midday forecast
    const [defaultCards, setDefaultCards] = useState([]);
    const [defaultForecasts, setDefaultForcast] = useState([]);

    // Load default city cards on mount
    useEffect(() => {
        const loadDefaults = async () => {
            const results = await Promise.allSettled(
                DEFAULT_CITIES.map((city) => getWeatherByCity(city)),
            );
            const loaded = results
                .filter((r) => r.status === "fulfilled")
                .map((r) => r.value);
            setDefaultCards(loaded);
        };
        loadDefaults();
    }, []);

    useEffect(() => {
        const loadDefaults = async () => {
            const results = await Promise.allSettled(
                DEFAULT_CITIES.map((city) => getForecastByCity(city)),
            );
            const loaded = results
                .filter((r) => r.status === "fulfilled")
                .map((r) => r.value);
            setDefaultForcast(loaded);
        };
        loadDefaults();
    }, []);

    //Search for weather by city name
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

    const findbylocation = async () => {
        try {
            setError("");
            const { weather, forecast } = await getWeatherForCurrentLocation();
            console.log(weather);
            console.log(forecast);
            setWeather(weather);
            setForecast(forecast);
        } catch (err) {
            setWeather(null);
            setForecast(null);
            setError(err.message);
        }
    };

    //Search for weather by geolocation
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

    const getRecommendation = (w) => {
        const temp = w.main.temp;
        const condition = w.weather[0].main.toLowerCase();
        if (temp < 10) return "🥶 Cold weather today — wear a jacket";
        if (condition.includes("rain"))
            return "☔ Rain expected — take an umbrella";
        if (w.wind.speed > 10) return "💨 Windy — be careful outside";
        return "☀️ Sunny — Good cycling conditions";
    };

    const hasSearchResult = weather !== null;

    const coords = weather
        ? { lat: weather.coord.lat, lng: weather.coord.lon }
        : null;

    return (
        <div className="app-container">
            <div className="dark-mode-toggle">
                <button onClick={() => document.body.classList.toggle("dark")}>
                    🌙 Dark Mode
                </button>
            </div>
            <h1>Weather App</h1>

            <div className="search">
                <SearchBar onSearch={handleSearch} />
                <GPSButton onToggleOn={findbylocation} />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {hasSearchResult ? (
                <div className="result-layout">
                    <div className="reuslt-weather">
                        <WeatherCard weather={weather} forecast={forecast} />
                        <div className="recommendation">
                            {getRecommendation(weather)}
                        </div>
                    </div>

                    {forecast && (
                        <div className="forecast-section forecast-full">
                            {coords && (
                                <div className="result-map">
                                    <iframe
                                        key={`${coords.lat}-${coords.lng}`}
                                        title="map"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.15},${coords.lat - 0.15},${coords.lng + 0.15},${coords.lat + 0.15}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            border: "none",
                                            borderRadius: "16px",
                                        }}
                                    />
                                </div>
                            )}

                            <div className="forecast-header">
                                <div>
                                    <label>Select time: </label>
                                    <select
                                        onChange={(e) =>
                                            setSelectedTime(e.target.value)
                                        }
                                        value={selectedTime}
                                    >
                                        <option value="09:00:00">
                                            Morning (09:00)
                                        </option>
                                        <option value="12:00:00">
                                            Afternoon (12:00)
                                        </option>
                                        <option value="15:00:00">
                                            Late Afternoon (15:00)
                                        </option>
                                        <option value="18:00:00">
                                            Evening (18:00)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="forecast-grid">
                                {filteredForecast.map((item, index) => (
                                    <div className="forecast-card" key={index}>
                                        <div className="forecast-date">
                                            {formatForecastDate(
                                                item.dt_txt.split(" ")[0],
                                            )}
                                        </div>
                                        <img
                                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                            alt="icon"
                                            className="forecast-icon"
                                        />
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
            ) : (
                <div className="default-cards-grid">
                    {defaultCards.map((w, i) => (
                        <div
                            key={i}
                            className="default-card-wrapper"
                            onClick={() => {
                                handleSearch(w.name);
                            }}
                        >
                            <WeatherCard
                                weather={w}
                                forecast={defaultForecasts[i]}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
