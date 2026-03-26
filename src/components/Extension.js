// NOTE: This is part of the extension (33 Marks).
// The goal of this part is to give the user some options.
// 1. Choose to Use Browser GPS to show current location.
// 2. Make the dispaly responsive to the time of day (The styling will not be done by me prolly).
// 3. On GPS, shows nearby locations aswell cus why not.

import react from "react";
import GPSButton from "./GPSButton";

function Extension({ toggleOn, handleBackground: setBackground }) {
    const [timeOfDay, setTimeOfDay] = react.useState("");

    react.useEffect(() => {
        const hour = new Date().getHours();
        let currentTimeOfDay = "";

        if (hour > 7 && hour <= 12) {
            currentTimeOfDay = "morning";
        } else if (hour > 12 && hour <= 18) {
            currentTimeOfDay = "afternoon";
        } else if (hour > 18 && hour <= 22) {
            currentTimeOfDay = "evening";
        } else if (hour > 22 || hour <= 3) {
            currentTimeOfDay = "night";
        } else {
            currentTimeOfDay = "dawn";
        }

        setTimeOfDay(currentTimeOfDay);
        setBackground(currentTimeOfDay);
    }, [setBackground]);

    return (
        <div className="Extension">
            <GPSButton onToggleOn={toggleOn} />
            <label>{timeOfDay}</label>
        </div>
    );
}

export default Extension;
