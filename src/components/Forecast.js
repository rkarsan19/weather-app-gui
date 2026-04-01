// Forecast displays the 5-day forecast cards
// Receives filteredForecast, formatForecastDate and isCelsius as props from App.js

import React from "react";

function Forecast({ filteredForecast, formatForecastDate, isCelsius }) {
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
                        {/* Date e.g. "Mon 3rd 2025" */}
                        <div className="forecast-date">
                            {formatForecastDate(item.dt_txt.split(" ")[0])}
                        </div>

                        {/* Weather icon from OpenWeatherMap */}
                        <img
                            src={iconUrl}
                            alt={item.weather[0].description}
                            className="forecast-icon"
                        />

                        {/* Temperature — switches between °C and °F based on the toggle */}
                        <div className="forecast-temp">
                            {isCelsius
                                ? `${Math.round(item.main.temp)}°C`
                                : `${Math.round((item.main.temp * 9) / 5 + 32)}°F`}
                        </div>

                        {/* Short weather description e.g. "Light rain" */}
                        <div className="forecast-desc">
                            {item.weather[0].description.charAt(0).toUpperCase() +
                                item.weather[0].description.slice(1)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Forecast;