export default function Summary({ sessionData, setScreen }) {
  if (!sessionData) return null;

  const {
    total,
    attempted,
    answered,        // backward safety
    correct,
    wrong,
    wrongIndexes
  } = sessionData;

  const attemptedCount = attempted ?? answered;
  const wrongCount = wrong ?? (wrongIndexes?.length || 0);
  const percent = ((correct / total) * 100).toFixed(0);

  return (
    <div className="page">
      <h1>Summary Report</h1>

      <div className="summary-card">
        <div>Number of questions: <strong>{total}</strong></div>
        <div>Attempted: <strong>{attemptedCount}</strong></div>
        <div>Correct: <strong>{correct}</strong></div>
        <div>Wrong: <strong>{wrongCount}</strong></div>
        <div>Percent correct: <strong>{percent}%</strong></div>
      </div>

      {/* REVIEW WRONG */}
      {wrongCount > 0 && (
  <button
    className="end-btn secondary"
    onClick={() => setScreen("retry")}
  >
    Retry Wrong Questions
  </button>
)}


      <button
        className="back"
        onClick={() => setScreen("home")}
      >
        Back to Home
      </button>
    </div>
  );
}
