# Group 17 — Commuter Weather App
ECS522U GUI Coursework 2025/26

A weather app built for daily commuters — students and working professionals who need quick, practical weather information before and during their journey.

---

## What the app does

- Search any city to get current weather conditions
- Displays temperature, feels like, humidity, wind speed, and sunrise/sunset times
- Smart commuter tip that gives practical advice based on current conditions (e.g. "Heavy rain — bring an umbrella, cycling not recommended today")
- 5-day forecast with a time-of-day selector so you can check morning and evening conditions separately
- Dark mode toggle

---

## How to run it

Make sure you have **Node.js** installed. If not, download it from https://nodejs.org (use the LTS version).

**1. Clone the repository**
```
git clone https://github.com/your-repo-link-here
cd weather-app-gui-main
```

**2. Install dependencies**
```
npm install
```

**3. Start the app**
```
npm start
```

The app will open automatically at http://localhost:3000 in your browser.

---

## Dependencies

All dependencies are listed in `package.json` and installed via `npm install`. The main ones are:

- React 19
- Axios (for API requests)
- OpenWeatherMap API (live weather data)

---

## API Key

The app uses the OpenWeatherMap API. The API key is already included in `src/api/weatherAPI.js`. No extra setup needed.

---

## Project Structure

```
src/
├── api/
│   └── weatherAPI.js        # API calls to OpenWeatherMap
├── assets/                  # Icons and images
├── components/
│   ├── SearchBar.js         # City search input
│   ├── WeatherCard.js       # Current weather display
│   └── Forecast.js          # Forecast component
├── weather_styles/
│   └── style.css            # Main stylesheet
└── App.js                   # Root component, main logic
```

---

## Group 17 Members
- Boluwatife Abiodun Temitope Akinmade
- Ishan Singh Jhaj
- Reece Karsan
- Aman Husain Nagarwala
- Hussein Omar