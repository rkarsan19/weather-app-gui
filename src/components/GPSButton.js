// NOTE: Part 1 of Extension.js.
// This is a toggle button that when pressed shows weather correpsoning to current location.
// When search is pressed, this button resets back to normal.
//
import locationIcon from "../assets/location.png";
import { useState } from "react";

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
            className="gps-button"
            id="GPSButton"
            aria-pressed={state}
            onClick={onGPSButtonPressed}
        >
            <img src={locationIcon} alt="use location" />
        </button>
    );
}

export default GPSButton;
