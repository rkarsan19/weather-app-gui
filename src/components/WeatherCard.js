// WeatherCard.js — shows the weather results for a given city
// This component has one job:display the weather data it receives as a prop.

import React from "react";

function WeatherCard({ data }) {
    if (!data) return <p>No data yet</p>;

    return (
        // below is the logic of what will be outputted for every input we receive from the API.
        // we output:
        // temp
        // pressure
        // Wind speed
        // humidity
        // "feels like" temp

        // Weather card starts from her
        <div className="weather-card">
            <h2 className="city-name">
                {data.name}, {data.sys.country}
            </h2>

            <p className="temperature">{Math.round(data.main.temp)}°C</p>
            <p className="description">
                {data.weather[0].description.charAt(0).toUpperCase() +
                    data.weather[0].description.slice(1)}
            </p>

            <div className="weather-details">
                <div className="detail-item">
                    <span className="detail-label">Feels like</span>
                    <span className="detail-value">
                        {Math.round(data.main.feels_like)}°C
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{data.main.humidity}%</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Pressure</span>
                    <span className="detail-value">
                        {data.main.pressure} hPa
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Wind speed</span>
                    <span className="detail-value">{data.wind.speed} m/s</span>
                </div>
            </div>
        </div>
    );
}

export default WeatherCard;
