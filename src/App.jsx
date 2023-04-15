// App.jsx - frontend

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSun, FiMoon } from "react-icons/fi";
import "./App.css";

import Header from "./Components/Header";

const App = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState({});
  const [formError, setFormError] = useState(null);
  const [theme, setTheme] = useState("light");

  // const apiUrl = process.env.REACT_APP_API_URL; // get the API URL from the environment variable

  useEffect(() => {
    let timer
    if(formError) {
      timer = setTimeout(() => {
        setFormError(null)
      }, 3000)
    }
    return() => {
      clearTimeout(timer)
    }
  }, [formError])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (url === '') {
      setFormError('Enter a valid url')
    }
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL, { url });
      setStatus(response.data);
    } catch (error) {
      console.error(error);
      setStatus({ isUp: false, ipAddress: null, uptime: 0 });
    }
  };

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`App ${theme}`}>
      {/* <div className="toggle-theme" onClick={handleToggleTheme}>
        {theme === "light" ? <FiMoon /> : <FiSun />}
      </div> */}
      <Header />
      <form onSubmit={handleSubmit}>
        <input type="text" id="url" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter a web page URL"/>
        <button type="submit">Analyze</button>
      </form>
      {formError && <p className="error">{formError}</p>}
      {url !== '' && status.isUp !== undefined && (
        <div className={`status ${status.isUp ? "up" : "down"}`}>
          <p>Status: {status.isUp ? "UP" : "DOWN"}</p>
          {status.ipAddress && <p>IP Address: {status.ipAddress}</p>}
          <p>Response Time: {status.uptime}%</p>
        </div>
      )}
    </div>
  );
};

export default App;
