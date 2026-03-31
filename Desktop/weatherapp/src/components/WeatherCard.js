import React from 'react';
import sunCloud from "../assets/sunCloudWeatherApp.png";
import rain from "../assets/rainyWeatherApp.png";
import sunriseImg from '../assets/sunrise.png';
import sunsetImg from '../assets/sunset.png';
import humidityIcon from '../assets/humidity.png';
import windIcon from '../assets/wind.png';
import rainIcon from '../assets/heavy-rain.png';
const WeatherCard = ({ data, forecast }) => {
    if (!data) return null;

    const iconCode = data.weather[0].icon;


    const getNextHours = () => {
        if (!forecast) return [];
        return forecast.list.slice(0, 4);
    };

    // convert UNIX → readable time
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        

    
    };

    return (
        <div className="weather-card">

            <h2>{data.name}</h2>

            <img
                src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                alt="weather icon"
                className="weather-icon"
            />

            <div className="temp-row">
                
               <div className="sun-card">
                    <img src={sunriseImg} alt="sunrise" />
                    <span>{formatTime(data.sys.sunrise)}</span>
                    </div>

                    <div className="temp-main">
                    {Math.round(data.main.temp)}°C
                    </div>

                    <div className="sun-card">
                    <img src={sunsetImg} alt="sunset" />
                    <span>{formatTime(data.sys.sunset)}</span>
                    </div>

            </div>

            <p className="feels-like">
            Feels like {Math.round(data.main.feels_like)}°C
            </p>

            <p className="desc">{data.weather[0].description}</p>
            <div className="extra-info">

                <div className="info-box">
                    <img src={rainIcon} alt="rain" />
                    <span>
                    {data.rain ? `${data.rain["1h"] || 0} mm` : "0 mm"}
                    </span>
                </div>

                <div className="info-box">
                    <img src={humidityIcon} alt="humidity" />
                    <span>{data.main.humidity}%</span>
                </div>

                <div className="info-box">
                    <img src={windIcon} alt="wind" />
                    <span>{Math.round(data.wind.speed)} m/s</span>
                </div>

                </div>

           <div className="hourly">
            {getNextHours().map((item, index) => (
                <div key={index} className="hour-box">
                <span>
                    {new Date(item.dt * 1000).getHours()}:00
                </span>

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