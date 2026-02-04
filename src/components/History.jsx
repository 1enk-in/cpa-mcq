import { useEffect, useState } from "react";

const HISTORY_KEY = "cpa_reg_history";

const SUBJECT_PREFIX = {
  reg: "M",
  aud: "A",
  far: "F",
  bar: "B",
  isc: "I",
  tcp: "T"
};

export default function History({
  setScreen,
  setReviewSession,
  activeSubject
}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    setHistory(raw);
  }, []);

  const prefix = SUBJECT_PREFIX[activeSubject];

  const filteredHistory = prefix
    ? history.filter(s => s.module?.startsWith(prefix))
    : history;

  function deleteSession(index) {
    if (!window.confirm("Delete this session?")) return;

    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="top-bar">
        <button
          className="back"
          onClick={() =>
            setScreen(activeSubject ? activeSubject : "home")
          }
        >
          ← Back
        </button>
      </div>

      <h2 className="page-title">
        Practice History
        {activeSubject && ` • ${activeSubject.toUpperCase()}`}
      </h2>

      {filteredHistory.length === 0 ? (
        <p className="empty-history">
          No practice sessions for this subject yet.
        </p>
      ) : (
        <div className="history-list">
          {filteredHistory.map((s, i) => (
            <div key={i} className="history-card">
              {/* SCORE */}
              <div className="history-score">
                {s.correct}/{s.total}
              </div>

              {/* INFO */}
              <div
                className="history-info"
                onClick={() => {
                  setReviewSession(s);
                  setScreen("review");
                }}
              >
                {/* MODULE + PERCENT */}
                <div className="history-percent">
                  <span>
                    {s.module} • {s.percent}% Correct
                  </span>

                  {s.isRetry === true && (
                    <span className="retry-badge">Retry</span>
                  )}
                </div>

                {/* ATTEMPT STATS */}
                <div className="history-stats">
                  Attempted: {s.attempted} | Correct: {s.correct} | Wrong: {s.wrong}
                </div>

                {/* DATE */}
                <div className="history-date">
                  {new Date(s.completedAt).toLocaleDateString("en-GB")}{" "}
                  {new Date(s.completedAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  })}
                </div>
              </div>

              {/* DELETE */}
              <button
                className="delete-btn"
                onClick={() => deleteSession(i)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
