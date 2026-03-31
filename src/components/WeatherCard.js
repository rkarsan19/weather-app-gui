import React from "react";
import sunCloud from "../assets/sunCloudWeatherApp.png";
import rain from "../assets/rainyWeatherApp.png";
import sunriseImg from "../assets/sunrise.png";
import sunsetImg from "../assets/sunset.png";
import humidityIcon from "../assets/humidity.png";
import windIcon from "../assets/wind.png";
import rainIcon from "../assets/heavy-rain.png";
import feelsIcon from "../assets/shrug.png";

const WeatherCard = ({ weather, forecast }) => {
    if (!weather) return null;

    const iconCode = weather.weather[0].icon;

    const getNextHours = () => {
        if (!forecast) return [];
        return forecast.list.slice(0, 4);
    };

    // convert UNIX → readable time
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="weather-card">
            <h2>
                {weather.name}, {weather.sys.country}
            </h2>

            <img
                src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                alt="weather icon"
                className="weather-icon"
            />

            <div className="temp-row">
                <div className="sun-card">
                    <img src={sunriseImg} alt="sunrise" />
                    <span>{formatTime(weather.sys.sunrise)}</span>
                </div>

                <div className="temp-main">
                    {Math.round(weather.main.temp)}°C
                </div>

                <div className="sun-card">
                    <img src={sunsetImg} alt="sunset" />
                    <span>{formatTime(weather.sys.sunset)}</span>
                </div>
            </div>

            <div className="feels-like">
                feels like {Math.round(weather.main.feels_like)}°C
            </div>

            <p className="desc">{weather.weather[0].description}</p>
            <div className="extra-info">
                <div className="info-box">
                    <img src={rainIcon} alt="rain" />
                    <span>
                        {weather.rain
                            ? `${weather.rain["1h"] || 0} mm`
                            : "0 mm"}
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

            <div className="hourly">
                {getNextHours().map((item, index) => (
                    <div key={index} className="hour-box">
                        <span>{new Date(item.dt * 1000).getHours()}:00</span>

                        <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt="icon"
                        />

                        <span>{Math.round(item.main.temp)}°C</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherCard;
