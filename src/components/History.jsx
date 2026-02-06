import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     📥 LOAD HISTORY FROM FIRESTORE
     =============================== */
  useEffect(() => {
    if (!user) return;

    async function loadHistory() {
      try {
        const ref = collection(db, "users", user.uid, "mcqHistory");
        const q = query(ref, orderBy("completedAt", "desc"));
        const snap = await getDocs(q);

        const rows = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setHistory(rows);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user]);

  /* ===============================
     🎯 SUBJECT FILTER (SAFE)
     =============================== */
  const filteredHistory = activeSubject
  ? history.filter(h =>
      h.module?.startsWith(SUBJECT_PREFIX[activeSubject])
    )
  : history;


  /* ===============================
     ⏳ LOADING STATE
     =============================== */
  if (loading) {
    return <div className="page">Loading history…</div>;
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
          {filteredHistory.map(item => (
            <div key={item.id} className="history-card">
              <div className="history-score">
                {item.correct}/{item.total}
              </div>

              <div
                className="history-info"
                onClick={() => {
                  setReviewSession({
                    ...item,
                    wrongIndexes: item.wrongIndexes ?? []
                  });
                  setScreen("review");
                }}
              >
                <div className="history-percent">
                  <span>
                    {item.module?.toUpperCase()} • {item.percent}% Correct
                  </span>

                  {item.isRetry === true && (
                    <span className="retry-badge">Retry</span>
                  )}
                </div>

                <div className="history-stats">
                  Attempted: {item.attempted ?? item.total} |{" "}
                  Correct: {item.correct} |{" "}
                  Wrong: {item.wrong}
                </div>

                <div className="history-date">
                  {item.completedAt?.toDate().toLocaleDateString("en-GB")}{" "}
                  {item.completedAt?.toDate().toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
