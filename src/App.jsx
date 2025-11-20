import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import PreviewGrid from "./Components/PreviewGrid";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/analyze";

const App = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState([]);
  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  });

  const formatLatency = (value) => {
    if (value === undefined || value === null) return "—";
    const numeric = Number(value);
    return numeric >= 1000
      ? `${(numeric / 1000).toFixed(2)} s`
      : `${numeric.toFixed(0)} ms`;
  };

  const safeHostname = (target) => {
    if (!target) return "Unknown";
    try {
      return new URL(target).hostname;
    } catch (_) {
      return target;
    }
  };

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
      setFormError("Enter a valid URL");
      return;
    }

    // Normalize the URL
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `http://${normalizedUrl}`;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const response = await axios.post(API_URL, { url: normalizedUrl });
      const payload = {
        ...response.data,
        requestedUrl: normalizedUrl,
        checkedAt: new Date().toISOString(),
      };
      setStatus((prevStatus) => [payload, ...prevStatus].slice(0, 6));
      setActivePreviewUrl(normalizedUrl);

      // Check if the URL is secure
      if (!normalizedUrl.startsWith("https://")) {
        setFormError("The site is not secure (uses HTTP). Consider using HTTPS.");
      }
    } catch (error) {
      setStatus((prevStatus) => [
        {
          isUp: false,
          ipAddress: null,
          uptime: 0,
          latencyMs: 0,
          dnsLookupMs: 0,
          requestedUrl: normalizedUrl,
          checkedAt: new Date().toISOString(),
          error: error.response?.data?.error || "Unable to analyze the site right now.",
        },
        ...prevStatus,
      ]);
      setActivePreviewUrl(normalizedUrl);
    }
    setIsLoading(false);
  };


  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`App ${theme}`}>
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      <section className="analyzer-panel">
        <form onSubmit={handleSubmit} className="url-form">
          <label htmlFor="url">Test a public URL</label>
          <div className="input-row">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/"
              autoComplete="off"
              aria-label="Website URL to analyze"
            />
            <button type="submit" className={`button ${theme}`} disabled={isLoading}>
              {isLoading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
          {formError && <p className="error">{formError}</p>}
        </form>
        <div className="latency-hint">
          <p>
            Latency reflects full request timing, including DNS resolution and TLS negotiation.
            Multiple previews help surface content stability issues as the page loads.
          </p>
        </div>
      </section>
      <section className="results-panel">
        <header>
          <p className="eyebrow">Latest snapshots</p>
          <h2>Availability & latency history</h2>
        </header>
        {status.length === 0 ? (
          <div className="empty-state">
            <p>No analyses yet. Submit a URL to see live telemetry.</p>
          </div>
        ) : (
          <div className="status-grid">
            {status.map((statusObj, idx) => (
              <article
                key={`${statusObj.requestedUrl}-${statusObj.checkedAt}-${idx}`}
                className={`status-card ${statusObj.isUp ? "up" : "down"}`}
              >
                <div className="status-card__header">
                  <p className="eyebrow">{safeHostname(statusObj.requestedUrl)}</p>
                  <span className="badge">{statusObj.isUp ? "Up" : "Down"}</span>
                </div>
                <h3>{statusObj.requestedUrl || "Unknown target"}</h3>
                <dl>
                  <div>
                    <dt>Latency</dt>
                    <dd>{formatLatency(statusObj.latencyMs)}</dd>
                  </div>
                  <div>
                    <dt>DNS Lookup</dt>
                    <dd>{formatLatency(statusObj.dnsLookupMs)}</dd>
                  </div>
                  <div>
                    <dt>IP Address</dt>
                    <dd>{statusObj.ipAddress || "—"}</dd>
                  </div>
                  <div>
                    <dt>Status Code</dt>
                    <dd>{statusObj.statusCode || "—"}</dd>
                  </div>
                </dl>
                <footer>
                  <time dateTime={statusObj.checkedAt}>
                    {new Date(statusObj.checkedAt).toLocaleTimeString()}
                  </time>
                  {statusObj.error && <p className="error subtle">{statusObj.error}</p>}
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
      <PreviewGrid url={activePreviewUrl} />
      <Footer />
    </div>
  );
};

export default App;
