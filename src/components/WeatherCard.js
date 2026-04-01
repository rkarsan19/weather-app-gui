// WeatherCard.js — shows all the current weather info for a city.
// It gets the weather and forecast data passed in from App.js as props.

import React from "react";
import sunriseImg from "../assets/sunrise.png";
import sunsetImg from "../assets/sunset.png";
import humidityIcon from "../assets/humidity.png";
import windIcon from "../assets/wind.png";
import rainIcon from "../assets/heavy-rain.png";

const WeatherCard = ({ weather, forecast, isCelsius }) => {
    // Don't render anything if there's no weather data yet
    if (!weather) return null;

    // Converts a celsius value to fahrenheit
    // We always store temps in celsius (from the API) and convert on display if needed
    const formatTemp = (tempC) => {
        if (isCelsius) return `${Math.round(tempC)}°C`;
        return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    };

    // The icon code comes from the API e.g. "10d" for rainy daytime
    // We use it to build the OpenWeatherMap icon URL
    const iconCode = weather.weather[0].icon;

    // Grabs the next 4 forecast entries (each 3 hours apart) for the hourly strip
    const getNextHours = () => {
        if (!forecast) return [];
        return forecast.list.slice(0, 4);
    };

    // The API gives us sunrise/sunset as UNIX timestamps (seconds since 1970)
    // This converts them into a readable time like "06:40 am"
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="weather-card">

            {/* City name and country code e.g. "London, GB" */}
            <h2>
                {weather.name}, {weather.sys.country}
            </h2>

            {/* Weather icon from OpenWeatherMap */}
            <img
                src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                alt="weather icon"
                className="weather-icon"
            />

            {/* Main temperature row — sunrise on the left, temp in the middle, sunset on the right.
                Commuters can see the daylight window at a glance without any extra clicks. */}
            <div className="temp-row">
                <div className="sun-card">
                    <img src={sunriseImg} alt="sunrise" />
                    <span>{formatTime(weather.sys.sunrise)}</span>
                </div>

                <div className="temp-main">
                    {formatTemp(weather.main.temp)}
                </div>

                <div className="sun-card">
                    <img src={sunsetImg} alt="sunset" />
                    <span>{formatTime(weather.sys.sunset)}</span>
                </div>
            </div>

            {/* Feels like is important for commuters — e.g. wind chill can make
                10°C feel like 5°C which changes what you'd wear */}
            <div className="feels-like">
                feels like {formatTemp(weather.main.feels_like)}
            </div>

            {/* Short description e.g. "broken clouds" or "light rain" */}
            <p className="desc">{weather.weather[0].description}</p>

            {/* Three info boxes: rainfall, humidity, wind speed.
                Wind speed is particularly useful for cyclists and delivery drivers. */}
            <div className="extra-info">
                <div className="info-box">
                    <img src={rainIcon} alt="rain" />
                    <span>
                        {/* rain["1h"] is rainfall in the last hour in mm — 
                            defaults to 0 mm if there's been no rain */}
                        {weather.rain ? `${weather.rain["1h"] || 0} mm` : "0 mm"}
                    </span>
                </div>

                <div className="info-box">
                    <img src={humidityIcon} alt="humidity" />
                    <span>{weather.main.humidity}%</span>
                </div>

                <div className="info-box">
                    <img src={windIcon} alt="wind" />
                    <span>{Math.round(weather.wind.speed)} m/s</span>
                </div>
            </div>

            {/* Hourly strip — shows the next 4 time slots from the forecast.
                Useful for commuters who want to know if it'll get worse later in the day. */}
            <div className="hourly">
                {getNextHours().map((item, index) => (
                    <div key={index} className="hour-box">
                        {/* Convert the UNIX timestamp to just the hour e.g. "14:00" */}
                        <span>{new Date(item.dt * 1000).getHours()}:00</span>

                        <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt="icon"
                        />

                        <span>{formatTemp(item.main.temp)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherCard;