import { useState } from "react";
import questions from "../data/reg_m1.json";

export default function MCQ({ setScreen, setSessionData }) {
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(total).fill(null));
  const [confirmType, setConfirmType] = useState(null);
  const [error, setError] = useState("");

  const q = questions[index];
  const selected = answers[index];

  const answeredCount = answers.filter(a => a !== null).length;
  const allAnswered = answeredCount === total;

  function selectOption(i) {
    if (selected !== null) return;
    const copy = [...answers];
    copy[index] = i;
    setAnswers(copy);
  }

  function generateReport() {
    const correct = answers.filter(
      (a, i) => a === questions[i].correctIndex
    ).length;

    setSessionData({
      total,
      answered: answeredCount,
      correct
    });

    setScreen("summary");
  }

  function handleEndSession() {
    if (answeredCount < 2) {
      setError("At least 2 questions must be answered to generate a report.");
      return;
    }
    setConfirmType("end");
  }

  function handleSubmit() {
    setConfirmType("end");
  }

  function confirmAction() {
    if (confirmType === "exit") setScreen("reg");
    if (confirmType === "end") generateReport();
  }

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="top-bar">
        <button className="back" onClick={() => setConfirmType("exit")}>
          ← Modules
        </button>
        <button className="end-btn" onClick={handleEndSession}>
          END SESSION
        </button>
      </div>

      {/* QUESTION PANEL */}
      <div className="panel">
        {questions.map((_, i) => {
          let cls = "panel-box";
          if (answers[i] !== null) {
            cls +=
              answers[i] === questions[i].correctIndex
                ? " correct"
                : " wrong";
          }
          if (i === index) cls += " active";

          return (
            <div key={i} className={cls} onClick={() => setIndex(i)}>
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* MCQ CARD */}
      <div className="mcq-card">
        <div className="mcq-id">{q.id}</div>
        <div className="mcq-question">{q.question}</div>

        {q.options.map((opt, i) => {
          let cls = "option";
          if (selected !== null) {
            if (i === q.correctIndex) cls += " correct";
            else if (i === selected) cls += " wrong";
          }

          return (
            <div key={i} className={cls} onClick={() => selectOption(i)}>
              <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
            </div>
          );
        })}

        {selected !== null && (
          <div className="explanation">
            <h4>Explanation</h4>

            <p>
              <strong>
                Choice "{q.explanation.correct.choice}" is correct.
              </strong>{" "}
              {q.explanation.correct.text}
            </p>

            {Object.entries(q.explanation.incorrect).map(
              ([choice, text]) => (
                <p key={choice}>
                  <strong>Choice "{choice}" is incorrect.</strong> {text}
                </p>
              )
            )}
          </div>
        )}

        {/* NAVIGATION */}
        <div className="nav">
          <button
            onClick={() => setIndex(i => Math.max(i - 1, 0))}
            disabled={index === 0}
          >
            Previous
          </button>

          <span>{index + 1} / {total}</span>

          <button
            onClick={() => setIndex(i => Math.min(i + 1, total - 1))}
            disabled={index === total - 1}
          >
            Next
          </button>
        </div>

        {/* SUBMIT */}
        {allAnswered && (
          <button className="submit-btn" onClick={handleSubmit}>
            SUBMIT
          </button>
        )}

        {error && <p className="error">{error}</p>}
      </div>

      {/* CONFIRM MODAL */}
      {confirmType && (
        <div className="modal-overlay">
          <div className={`modal-box ${confirmType === "end" ? "danger" : ""}`}>
            <p>
              {confirmType === "exit"
                ? "Are you sure you want to leave this session without submitting?"
                : "Are you sure you want to end this session and view the report?"}
            </p>

            <div className="modal-actions">
              <button onClick={() => setConfirmType(null)}>Cancel</button>
              <button onClick={confirmAction}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
