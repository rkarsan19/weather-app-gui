import React from 'react';

const WeatherCard = ({ data }) => {
    if (!data) return <p>No data yet</p>;

    return (
        <div>
            <h2>{data.name}</h2>
            <p>{data.main.temp}°C</p>
            <p>{data.weather[0].description}</p>
        </div>
    );
};

export default WeatherCard;