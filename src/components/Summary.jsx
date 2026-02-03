export default function Summary({ sessionData, setScreen }) {
  const { total, answered, correct } = sessionData;
  const percent = ((correct / total) * 100).toFixed(0);

  return (
    <div className="page">
      <h1>Summary Report</h1>

      <div className="summary-card">
        <div>Number of questions: <strong>{total}</strong></div>
        <div>Number answered: <strong>{answered}</strong></div>
        <div>Answered correctly: <strong>{correct}</strong></div>
        <div>Percent correct: <strong>{percent}%</strong></div>
      </div>

      <button className="end-btn" onClick={() => setScreen("home")}>
        Back to Home
      </button>
    </div>
  );
}
