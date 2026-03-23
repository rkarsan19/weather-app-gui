// Forecast  displays the 5-day forecast cards
// Receives filteredForecast  and formatForecastDate as props from App.js

import React from "react";

function Forecast({ filteredForecast, formatForecastDate }) {
    if (!filteredForecast || filteredForecast.length === 0) {
        return <p>No forecast data available.</p>;
    }

    return (
        <div className="forecast-grid">
            {filteredForecast.map((item, index) => {
                const iconCode = item.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                return (
                    <div className="forecast-card" key={index}>
                        {/* date */}
                        <div className="forecast-date">
                            {formatForecastDate(item.dt_txt.split(" ")[0])}
                        </div>

                        {/* the weather icon */}
                        <img
                            src={iconUrl}
                            alt={item.weather[0].description}
                            className="forecast-icon"
                        />

                        {/* temp */}
                        <div className="forecast-temp">
                            {Math.round(item.main.temp)}°C
                        </div>

                        {/* desc for whether */}
                        <div className="forecast-desc">
                            {item.weather[0].description
                                .charAt(0)
                                .toUpperCase() +
                                item.weather[0].description.slice(1)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Forecast;

