import { useEffect, useMemo, useState } from "react";

const FRAME_COUNT = 6;
const FRAME_INTERVAL = 1200;

function getStatusLabel(state) {
  switch (state) {
    case "loading":
      return "Loading…";
    case "ready":
      return "Rendered";
    case "error":
      return "Blocked";
    default:
      return "Queued";
  }
}

function PreviewFrame({ url, index, delayMs }) {
  const [source, setSource] = useState("");
  const [state, setState] = useState("queued");
  const [startedAt, setStartedAt] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);

  useEffect(() => {
    if (!url) {
      setSource("");
      setState("idle");
      setStartedAt(null);
      setLoadedAt(null);
      return;
    }

    setState("queued");
    const timer = setTimeout(() => {
      setSource(url);
      setStartedAt(performance.now());
      setState("loading");
    }, delayMs);

    return () => {
      clearTimeout(timer);
      setSource("");
      setState("queued");
      setStartedAt(null);
      setLoadedAt(null);
    };
  }, [url, delayMs]);

  const handleLoad = () => {
    setState("ready");
    setLoadedAt(performance.now());
  };

  const handleError = () => {
    setState("error");
  };

  const deltaMs =
    startedAt && loadedAt ? Math.max(0, loadedAt - startedAt).toFixed(0) : null;

  return (
    <div className={`preview-frame ${state}`}>
      {source ? (
        <iframe
          src={source}
          title={`preview-${index}`}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-same-origin allow-scripts allow-forms"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="preview-placeholder">Awaiting snapshot…</div>
      )}
      <footer>
        <div>
          <span>Frame {index + 1}</span>
          <small>{getStatusLabel(state)}</small>
        </div>
        <div className="latency-badge">{deltaMs ? `${deltaMs} ms` : "—"}</div>
      </footer>
    </div>
  );
}

export default function PreviewGrid({ url }) {
  const frames = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, idx) => idx),
    []
  );

  if (!url) {
    return null;
  }

  return (
    <section className="preview-grid">
      <header>
        <div>
          <p className="eyebrow">Live stability preview</p>
          <h2>How does the page settle?</h2>
        </div>
        <p>
          We reload the site multiple times in quick succession to surface
          layout shifts, blocking assets, and other instability indicators.
        </p>
      </header>
      <div className="preview-grid__frames">
        {frames.map((idx) => (
          <PreviewFrame
            key={`${url}-${idx}`}
            url={url}
            index={idx}
            delayMs={idx * FRAME_INTERVAL}
          />
        ))}
      </div>
    </section>
  );
}

