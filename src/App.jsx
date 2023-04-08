// App.jsx - frontend

import React, { useState } from "react";
import axios from "axios";
import { FiSun, FiMoon } from "react-icons/fi";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState({});
  const [theme, setTheme] = useState("light");

  // const apiUrl = process.env.REACT_APP_API_URL; // get the API URL from the environment variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL, { url });
      setStatus(response.data);
    } catch (error) {
      console.error(error);
      setStatus({ isUp: false, ipAddress: null, uptime: 0, responseTime: 0 });
    }
  };

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`App ${theme}`}>
      <div className="toggle-theme" onClick={handleToggleTheme}>
        {theme === "light" ? <FiMoon /> : <FiSun />}
      </div>
      <h1>LogIQ</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Enter URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>
      {status.isUp !== undefined && (
        <div className={`status ${status.isUp ? "up" : "down"}`}>
          <p>Status: {status.isUp ? "UP" : "DOWN"}</p>
          {status.ipAddress && <p>IP Address: {status.ipAddress}</p>}
          <p>Uptime: {status.uptime}%</p>
          <p>Response Time: {status.responseTime}</p>
        </div>
      )}
    </div>
  );
};

export default App;
