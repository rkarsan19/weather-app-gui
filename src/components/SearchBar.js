// SearchBar.js — the search input at the top of the app.
// Takes an onSearch function from App.js and calls it when the user submits a city.

import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    // Tracks whatever the user is typing in the input box
    const [city, setCity] = useState('');

    // Called when the user clicks Search or presses Enter.
    // We use e.preventDefault() to stop the page from refreshing (default form behaviour).
    // We also trim the input so searching "   " (just spaces) doesn't trigger an API call.
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!city.trim()) return;
        onSearch(city);
    };

    return (
        // Using a form here so pressing Enter works naturally without extra code
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;