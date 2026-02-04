import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";


const USERS = ["Naved", "Faiz", "Afzal"];

export default function AdminHistory({ setScreen }) {
    const { logout } = useAuth();

  const [selectedUser, setSelectedUser] = useState("Naved");
  const [history, setHistory] = useState([]);

  /* ===============================
     🔄 LOAD HISTORY FOR USER
     =============================== */
  useEffect(() => {
    const key = `cpa_history_${selectedUser}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];
    setHistory(data);
  }, [selectedUser]);

  /* ===============================
     🧹 CLEAR USER HISTORY
     =============================== */
  function clearHistory() {
    if (!window.confirm(`Clear history for ${selectedUser}?`)) return;

    localStorage.removeItem(`cpa_history_${selectedUser}`);
    setHistory([]);
  }

  /* ===============================
     📊 TOTAL STATS
     =============================== */
  const totalAttempts = history.length;
  const totalCorrect = history.reduce((sum, h) => sum + h.correct, 0);
  const totalQuestions = history.reduce((sum, h) => sum + h.total, 0);
  const accuracy =
    totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;

  return (
    <div className="page admin-page">
      <h2>Admin History Dashboard</h2>

      <button className="logout-btn" onClick={logout}>
  Logout
</button>


      {/* USER SELECT */}
      <div className="admin-user-select">
        <label>Select User:</label>
        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          {USERS.map(u => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <h4>Total Sessions</h4>
          <p>{totalAttempts}</p>
        </div>

        <div className="admin-stat-card">
          <h4>Total Questions</h4>
          <p>{totalQuestions}</p>
        </div>

        <div className="admin-stat-card">
          <h4>Total Correct</h4>
          <p>{totalCorrect}</p>
        </div>

        <div className="admin-stat-card">
          <h4>Accuracy</h4>
          <p>{accuracy}%</p>
        </div>
      </div>

      {/* CLEAR HISTORY */}
      <button
        className="admin-clear-btn"
        onClick={clearHistory}
      >
        Clear {selectedUser} History
      </button>

      {/* HISTORY LIST */}
      <div className="admin-history-list">
        {history.length === 0 && (
          <p className="admin-empty">
            No history for this user.
          </p>
        )}

        {history.map((h, i) => (
          <div key={i} className="history-card">
            <p><strong>Module:</strong> {h.module}</p>
            <p><strong>Score:</strong> {h.correct}/{h.total}</p>
            <p><strong>Percent:</strong> {h.percent}%</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(h.completedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
