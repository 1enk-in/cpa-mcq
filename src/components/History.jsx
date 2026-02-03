import { useEffect, useState } from "react";

const HISTORY_KEY = "cpa_reg_history";

export default function History({ setScreen, setReviewSession }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    setHistory(raw);
  }, []);

  function deleteSession(index) {
    if (!window.confirm("Delete this session?")) return;

    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  return (
    <div className="page">
      <div className="top-bar">
        <button className="back" onClick={() => setScreen("reg")}>
          ← Back to REG
        </button>
      </div>

      <h2 className="page-title">Practice History</h2>

      {history.length === 0 ? (
        <p className="empty-history">No practice sessions yet.</p>
      ) : (
        <div className="history-list">
          {history.map((s, i) => (
            <div key={i} className="history-card">
              <div className="history-score">
                {s.correct}/{s.total}
              </div>

              <div
                className="history-info"
                onClick={() => {
                  setReviewSession(s);
                  setScreen("review");
                }}
              >
                <div className="history-percent">
                  {s.module} • {s.percent}% Correct
                </div>

                <div className="history-date">
                  {new Date(s.completedAt).toLocaleDateString("en-GB")}{" "}
                  {new Date(s.completedAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  })}
                </div>
              </div>

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
