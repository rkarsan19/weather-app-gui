import './weather_styles/style.css';
import React, { useState } from 'react';
import {
    getWeatherByCity,
    getForecastByCity,
    getWeatherAndForecastByLocation,
} from './api/weatherAPI';
import SearchBar from './components/SearchBar.js';
import WeatherCard from './components/WeatherCard.js';
import Forecast from './components/Forecast.js';
import Extension from './components/Extension.js';


const App = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [forecast, setForecast] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00:00");// default to midday forecast
  const [background, setBackground] = useState("");

  //Search for weather by city name
  const handleSearch = async (city) => {
    try {
      setError('');

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

  // Search by GPS location
    const findByLocation = async () => {
        try {
            setError('');
            const { weatherdata, forecastdata } = await getWeatherAndForecastByLocation();
            setWeather(weatherdata);
            setForecast(forecastdata);
        } catch (err) {
            setWeather(null);
            setForecast(null);
            setError(err.message);
        }
    };
   
  //Search for weather by geolocation
  const filteredForecast = forecast?.list.filter(item =>
    item.dt_txt.includes(selectedTime)
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
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const day = getDayWithOrdinal(date.getDate());
    const year = date.getFullYear();
    return `${weekday} ${day} ${year}`;
  };
  
  return (
    <div className={`app-container ${background}`}>
      <h1>Weather App</h1>

      <Extension 
        toggleOn={findByLocation} 
        handleBackground={setBackground} 
      />

      <SearchBar onSearch={handleSearch} />
      <WeatherCard data={weather} />

      {weather && (
        <div className="recommendation">
          {(() => {
            const temp = weather.main.temp;
            const condition = weather.weather[0].main.toLowerCase();
            if (temp < 10) {
              return "🥶 Cold weather today — wear a jacket";
            }
            if (condition.includes("rain")) {
              return "☔ Rain expected — take an umbrella";
            }
            if (weather.wind.speed > 10) {
              return "💨 Windy — be careful outside";
            }
            return "☀️ Sunny  — Good cycling conditions";
          })()}
        </div>
      )}

      <div className="dark-mode-toggle">
        <button onClick={() => document.body.classList.toggle("dark")}>
          🌙 Dark Mode
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {forecast && (
        <div className="forecast-section">
      
          <h3>5-Day Forecast</h3>

          <label>Select time: </label>
          <select onChange={(e) => setSelectedTime(e.target.value)} value={selectedTime}>
            <option value="09:00:00">Morning (09:00)</option>
            <option value="12:00:00">Afternoon (12:00)</option>
            <option value="15:00:00">Late Afternoon (15:00)</option>
            <option value="18:00:00">Evening (18:00)</option>
          </select>

          <div className="forecast-grid">
            {filteredForecast.map((item, index) => (
              <div className="forecast-card" key={index}>
                <div className="forecast-date">
                  {formatForecastDate(item.dt_txt.split(" ")[0])}
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
  );
}


export default App;
