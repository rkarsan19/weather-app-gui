// NOTE: Part 1 of Extension.js.
// This is a toggle button that when pressed shows weather correpsoning to current location.
// When search is pressed, this button resets back to normal.

import { useState } from "react";
import { getWeatherAndForecastByLocation } from "../api/weatherAPI";

function GPSButton({ onToggleOn }) {
    const [state, setState] = useState(false);

    function onGPSButtonPressed() {
        const nextState = !state;
        setState(nextState);

        if (nextState === true) {
            onToggleOn();
        }
        console.log(nextState);
    }

    return (
        <button
            className="toggleButton"
            id="GPSButton"
            aria-pressed={state}
            onClick={onGPSButtonPressed}
        >
            Use Location
        </button>
    );
}

export default GPSButton;
