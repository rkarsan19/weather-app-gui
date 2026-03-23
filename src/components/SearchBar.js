// SearchBar.js  handles user input
// This component lets the user type a city name and submit it.
// It hands the city name back to App.js.

import React, { useState } from 'react';

// onSearch is a prop — a function passed in from App.js
// When we call onSearch(city), it runs the app.js handleSearch function
function SearchBar({ onSearch }) {
 
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    // e.preventDefault() stops the browser from refreshing the page on form submit
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter a city name..."
        value={inputValue}
        // Every keystroke updates inputValue in state
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSubmit} className="search-button">
        Get Weather
      </button>
    </div>
  );
}

export default SearchBar;
