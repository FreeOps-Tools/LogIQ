import React, { useState } from "react";
import useFetch from "react-fetch-hook";
import "./App.css";

function UrlChecker() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleCheckUrl = async () => {
    try {
      const response = await fetch(`https://${url}`);
  
      if (response.status >= 200 && response.status < 300) {
        setStatus("UP");
      } else {
        setStatus("DOWN");
      }
    } catch (error) {
      setStatus("DOWN");
    }
  };

  const handleDarkMode = () => {
    document.body.classList.add("dark");
  };

  const handleLightMode = () => {
    document.body.classList.remove("dark");
  };

  return (
    <div className="url-checker-container">
      <label htmlFor="url-input" className="url-label">
        Enter a URL:
      </label>
      <div className="url-input-container">
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          id="url-input"
          className="url-input"
        />
        <button onClick={handleCheckUrl} className="url-button">
          Check URL
        </button>
      </div>
      {status && (
        <div className={`status ${status.toLowerCase()}`}>
          Status: {status}
        </div>
      )}
      <div className="mode-buttons-container">
        <button onClick={handleDarkMode} className="mode-button">
          Dark Mode
        </button>
        <button onClick={handleLightMode} className="mode-button">
          Light Mode
        </button>
      </div>
    </div>
  );
}

export default UrlChecker;
