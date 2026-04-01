// This is the main App component — it ties everything together.
// It handles fetching weather data, managing state, and deciding what to show.

import "./weather_styles/style.css";
import React, { useState, useEffect } from "react";
import {
    getWeatherByCity,
    getForecastByCity,
    getWeatherForCurrentLocation,
    getCommuteScore,
} from "./api/weatherAPI";
import SearchBar from "./components/SearchBar.js";
import WeatherCard from "./components/WeatherCard.js";
import GPSButton from "./components/GPSButton";
import Forecast from "./components/Forecast.js";

// These 4 cities show up by default before the user searches anything
const DEFAULT_CITIES = ["New York", "Tokyo", "London", "Paris"];

const App = () => {
    const [weather, setWeather] = useState(null);       // current weather for searched city
    const [error, setError] = useState("");             // any error message to show the user
    const [forecast, setForecast] = useState(null);     // 5-day forecast data
    const [selectedTime, setSelectedTime] = useState("12:00:00"); // which time to show in forecast, defaults to midday
    const [defaultCards, setDefaultCards] = useState([]);         // weather for the 4 default cities
    const [defaultForecasts, setDefaultForecasts] = useState([]); // forecasts for the 4 default cities
    const [loading, setLoading] = useState(false);      // shows a loading message while fetching
    const [background, setBackground] = useState("");   // tracks time of day for background styling
    const [isCelsius, setIsCelsius] = useState(true);  // toggles between °C and °F, defaults to celsius

    // When the app first loads, work out what time of day it is
    // and apply the right background class to match (morning, afternoon, etc.)
    useEffect(() => {
        const hour = new Date().getHours();
        let timeOfDay = "";

        if (hour > 7 && hour <= 12) timeOfDay = "morning";
        else if (hour > 12 && hour <= 18) timeOfDay = "afternoon";
        else if (hour > 18 && hour <= 22) timeOfDay = "evening";
        else if (hour > 22 || hour <= 3) timeOfDay = "night";
        else timeOfDay = "dawn";

        setBackground(timeOfDay);
        document.body.classList.remove("morning", "afternoon", "evening", "night", "dawn");
        document.body.classList.add(timeOfDay);
    }, []);

    // Also on load, fetch weather for the 4 default cities so the page
    // isn't empty when someone first opens the app.
    // We use Promise.allSettled so if one city fails it doesn't break the rest.
    useEffect(() => {
        const loadDefaults = async () => {
            const weatherResults = await Promise.allSettled(
                DEFAULT_CITIES.map((city) => getWeatherByCity(city))
            );
            const forecastResults = await Promise.allSettled(
                DEFAULT_CITIES.map((city) => getForecastByCity(city))
            );

            setDefaultCards(
                weatherResults
                    .filter((r) => r.status === "fulfilled")
                    .map((r) => r.value)
            );
            setDefaultForecasts(
                forecastResults
                    .filter((r) => r.status === "fulfilled")
                    .map((r) => r.value)
            );
        };
        loadDefaults();
    }, []);

    // Called when the user types a city and hits Search.
    // Fetches both the current weather and the 5-day forecast for that city.
    const handleSearch = async (city) => {
        try {
            setError("");
            setLoading(true);
            const data = await getWeatherByCity(city);
            const forecastData = await getForecastByCity(city);
            setForecast(forecastData);
            setWeather(data);
        } catch (err) {
            // Clear results and show the error if something goes wrong
            setWeather(null);
            setForecast(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Called when the user clicks the GPS button.
    // Asks the browser for the user's location then fetches weather for those coordinates.
    const findByLocation = async () => {
        try {
            setError("");
            setLoading(true);
            const { weather, forecast } = await getWeatherForCurrentLocation();
            setWeather(weather);
            setForecast(forecast);
        } catch (err) {
            setWeather(null);
            setForecast(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // The forecast API gives us data every 3 hours over 5 days.
    // We filter it down to just the entries matching the selected time (e.g. 12:00)
    // so we get one card per day instead of eight.
    const filteredForecast = forecast?.list.filter((item) =>
        item.dt_txt.includes(selectedTime)
    );

    // Turns a plain day number into something like "3rd" or "21st"
    const getDayWithOrdinal = (day) => {
        const j = day % 10;
        const k = day % 100;
        if (j === 1 && k !== 11) return `${day}st`;
        if (j === 2 && k !== 12) return `${day}nd`;
        if (j === 3 && k !== 13) return `${day}rd`;
        return `${day}th`;
    };

    // Formats the raw date string from the API (e.g. "2025-03-01") into
    // something readable like "Sat 1st 2025" for the forecast cards
    const formatForecastDate = (isoString) => {
        const date = new Date(isoString);
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
        const day = getDayWithOrdinal(date.getDate());
        const year = date.getFullYear();
        return `${weekday} ${day} ${year}`;
    };

    // Our extension feature — takes the current weather and returns a commute
    // score from 1 to 5, a colour, a label, and a list of practical tips.
    // We built this because our survey of 23 commuters showed they want
    // quick actionable advice, not just raw weather numbers.
    const commuteScore = weather ? getCommuteScore(weather) : null;

    // Used to decide whether to show the search result view or the default city grid
    const hasSearchResult = weather !== null;

    // Pull the coordinates out of the weather data for the map embed
    const coords = weather
        ? { lat: weather.coord.lat, lng: weather.coord.lon }
        : null;

    return (
        <div className={`app-container ${background}`}>

            {/* Top bar — dark mode and celsius/fahrenheit toggle grouped together
                as they are both app-wide settings so it makes sense to keep them in one place */}
            <div className="top-bar">
                <button
                    className="top-bar-btn"
                    onClick={() => document.body.classList.toggle("dark")}
                >
                    🌙 Dark Mode
                </button>
                <button
                    className="top-bar-btn"
                    onClick={() => setIsCelsius(prev => !prev)}
                >
                    {isCelsius ? "Switch to °F" : "Switch to °C"}
                </button>
            </div>

            <h1>Weather App</h1>

            {/* Search bar on the left, GPS button on the right */}
            <div className="search">
                <SearchBar onSearch={handleSearch} />
                <GPSButton onToggleOn={findByLocation} />
            </div>

            {/* Show an error if the city wasn't found or the API failed */}
            {error && <p className="error-message">{error}</p>}

            {/* Show a loading message while we're waiting for the API */}
            {loading && <p className="loading-message">⏳ Loading...</p>}

            {/* If the user has searched a city, show the full result layout.
                Otherwise show the default city grid. */}
            {hasSearchResult ? (
                <div className="result-layout">

                    {/* Left side: weather card and commute score */}
                    <div className="result-weather">
                        <WeatherCard weather={weather} forecast={forecast} isCelsius={isCelsius} />

                        {/* Commute score panel — our main extension feature.
                            Shows a 1-5 rating with colour coding and specific tips
                            for cyclists, walkers, and public transport users.
                            The score colour goes from green (great) to red (terrible). */}
                        {commuteScore && (
                            <div
                                className="commute-score-panel"
                                style={{ borderLeft: `4px solid ${commuteScore.colour}` }}
                            >
                                <div className="commute-score-header">
                                    <span
                                        className="commute-score-number"
                                        style={{ color: commuteScore.colour }}
                                    >
                                        {commuteScore.score}/5
                                    </span>
                                    <span className="commute-score-label">
                                        {commuteScore.label}
                                    </span>
                                </div>

                                {/* Each tip is a specific piece of advice e.g. "bring an umbrella" */}
                                <ul className="commute-advice-list">
                                    {commuteScore.advice.map((tip, i) => (
                                        <li key={i}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right side: map of the city + 5-day forecast */}
                    {forecast && (
                        <div className="forecast-section forecast-full">

                            {/* Map showing where the searched city is */}
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

                            {/* Let the user pick a time so they can check both
                                morning and evening conditions for their commute */}
                            <div className="forecast-header">
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
                            </div>

                            {/* 5-day forecast cards */}
                            <Forecast
                                filteredForecast={filteredForecast}
                                formatForecastDate={formatForecastDate}
                                isCelsius={isCelsius}
                            />
                        </div>
                    )}
                </div>
            ) : (
                // Default view — show 4 city cards before the user searches anything.
                // Clicking a card will search that city.
                <div className="default-cards-grid">
                    {defaultCards.map((w, i) => (
                        <div
                            key={i}
                            className="default-card-wrapper"
                            onClick={() => handleSearch(w.name)}
                        >
                            <WeatherCard
                                weather={w}
                                forecast={defaultForecasts[i]}
                                isCelsius={isCelsius}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;