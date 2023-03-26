import React, { useState } from "react";
import useFetch from "use-http";
import "./App.css";

function UrlChecker() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const { get, response } = useFetch("");

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleCheckUrl = async () => {
    if (url.startsWith("http")) {
      await get(url);
      if (response.ok) {
        setStatus("UP");
      } else {
        setStatus("DOWN");
      }
    } else {
      setStatus("INVALID_URL");
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
          Check Status
        </button>
      </div>
      {status && status !== "INVALID_URL" && (
        <div className={`status ${status.toLowerCase()}`}>
          Status: {status}
        </div>
      )}
      {status === "INVALID_URL" && (
        <div className="invalid-url">Invalid URL. Please enter a valid URL.</div>
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
