import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSun, FiMoon } from "react-icons/fi";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

const App = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState([]);
  const [formError, setFormError] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  });

  useEffect(() => {
    let timer;
    if (formError) {
      timer = setTimeout(() => {
        setFormError(null);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [formError]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (url === "") {
      setFormError("Enter a valid url");
    }
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL, { url });
      setStatus((prevStatus) => [response.data, ...prevStatus]);
    } catch (error) {
      setStatus((prevStatus) => [
        { isUp: false, ipAddress: null, uptime: 0, responseTime: 0 },
        ...prevStatus,
      ]);
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
      <Header theme={theme} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/"
        />
        <button type="submit" className={`button ${theme}`}>
          Analyze
        </button>
      </form>
      {formError && <p className="error">{formError}</p>}
      {
        <div>
          {status.map((statusObj, idx) => (
            <div
              key={idx}
              className={`status ${statusObj.isUp ? "up" : "down"}`}
            >
              <p>Status: {statusObj.isUp ? "UP" : "DOWN"}</p>
              {statusObj.ipAddress && <p>IP Address: {statusObj.ipAddress}</p>}
              {<p>Uptime: {statusObj.uptime}%</p>}
              {<p>Response Time: {statusObj.responseTime}s</p>}
            </div>
          ))}
        </div>
      }
      <Footer />
    </div>
  );
};

export default App;
