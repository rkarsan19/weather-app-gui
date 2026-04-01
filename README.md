# Group 17 — Commuter Weather App
ECS522U GUI Coursework 2025/26

A weather app built for daily commuters — students and working professionals who need quick, practical weather information before and during their journey.

---

## What the app does

- Search any city to get current weather conditions
- Displays temperature, feels like, humidity, wind speed, rain and sunrise/sunset times
- Hourly strip showing the next few hours of conditions
- GPS button to automatically detect your current location
- Commute Score panel — rates conditions from 1 to 5 with colour coding and specific tips for cyclists, walkers and public transport users
- Interactive map showing the searched city location
- 5-day forecast with a time-of-day selector (morning, afternoon, evening)
- Default city cards for New York, Tokyo, London and Paris shown on load
- Dark mode toggle
- Celsius/Fahrenheit toggle

---

## How to run it

Make sure you have **Node.js** installed. If not, download it from https://nodejs.org (use the LTS version).

**1. Clone the repository**
```
git clone https://github.com/rkarsan19/weather-app-gui.git
cd weather-app-gui
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
public/
├── favicon.ico              # App icon shown in browser tab
└── index.html               # HTML entry point, sets page title

src/
├── api/
│   └── weatherAPI.js        # API calls to OpenWeatherMap + commute score logic
├── assets/                  # Icons and images
├── components/
│   ├── SearchBar.js         # City search input
│   ├── WeatherCard.js       # Current weather display with hourly strip
│   ├── Forecast.js          # 5-day forecast grid
│   ├── GPSButton.js         # Location detection button
│   └── Extension.js         # Time of day detection
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
