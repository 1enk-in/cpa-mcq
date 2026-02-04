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
          {history.map((s, i) => {
            const attempted =
              s.attempted ?? s.answered ?? s.total;

            const wrong =
              s.wrong ?? Math.max(attempted - s.correct, 0);

            return (
              <div key={i} className="history-card">
                {/* SCORE BLOCK */}
                <div className="history-score">
                  {s.correct}/{attempted}
                </div>

                {/* INFO */}
                <div
                  className="history-info"
                  onClick={() => {
                    setReviewSession(s);
                    setScreen("review");
                  }}
                >
                  <div className="history-percent">
  {s.module}
  {s.isRetry && (
    <span
      style={{
        marginLeft: "8px",
        padding: "2px 6px",
        fontSize: "12px",
        background: "#ffe0b2",
        borderRadius: "6px"
      }}
    >
      Retry
    </span>
  )}
  • {s.percent}% Correct
</div>


                  <div className="history-stats">
                    Attempted: {attempted} | Correct: {s.correct} | Wrong: {wrong}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
