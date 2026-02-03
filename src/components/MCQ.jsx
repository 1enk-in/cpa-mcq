import { useEffect, useState } from "react";

import regM1 from "../data/reg_m1.json";
import regM2 from "../data/reg_m2.json";

const MODULE_DATA = {
  M1: regM1,
  M2: regM2
};

const SESSION_KEY = "cpa_active_session";
const HISTORY_KEY = "cpa_reg_history";

export default function MCQ({ module, setScreen, setSessionData }) {
  /* 🔒 SAFETY GUARD */
  if (!module) return null;

  const data = MODULE_DATA[module];
  if (!data) return null;

  const questions = data.questions;
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(total).fill(null));
  const [confirmType, setConfirmType] = useState(null);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  /* ===============================
     🔹 RESTORE SESSION
     =============================== */
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (
        parsed.module === module &&
        parsed.answers?.length === total
      ) {
        setAnswers(parsed.answers);
        setIndex(parsed.index ?? 0);
      }
    }

    setHydrated(true);
  }, [module, total]);

  /* ===============================
     🔹 AUTO SAVE
     =============================== */
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        module,
        answers,
        index
      })
    );
  }, [answers, index, hydrated, module]);

  const q = questions[index];
  const selected = answers[index];

  const answeredCount = answers.filter(a => a !== null).length;
  const allAnswered = answeredCount === total;

  /* ===============================
     🔹 ANSWER SELECT (LOCKED)
     =============================== */
  function selectOption(i) {
    if (selected !== null) return;

    const copy = [...answers];
    copy[index] = i;
    setAnswers(copy);
  }

  /* ===============================
     🔹 GENERATE REPORT + SAVE HISTORY
     =============================== */
  function generateReport() {
  const correct = answers.filter(
    (a, i) => a === questions[i].correctIndex
  ).length;

  const report = {
    module,
    total,
    answered: answeredCount,
    correct,
    percent: Math.round((correct / total) * 100),
    completedAt: new Date().toISOString(),
    answers
  };

  const history =
    JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

  history.unshift(report);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  localStorage.removeItem(SESSION_KEY);

  setSessionData(report);   // 🔑 THIS WAS MISSING
  setScreen("summary"); 
}


  /* ===============================
     🔹 END SESSION (CONFIRM)
     =============================== */
  function handleEndSession() {
    if (answeredCount < 2) {
      setError("Answer at least 2 questions to end session.");
      return;
    }
    setConfirmType("end");
  }

  /* ===============================
     🔹 SUBMIT (NO CONFIRM)
     =============================== */
  function handleSubmit() {
    if (answeredCount < 2) {
      setError("Answer at least 2 questions to submit.");
      return;
    }
    generateReport();
  }

  function confirmAction() {
    if (confirmType === "exit") {
      localStorage.removeItem(SESSION_KEY);
      setScreen("reg");
    }

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

        {/* EXPLANATION */}
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
          <div className="modal-box danger">
            <p>
              {confirmType === "exit"
                ? "Leave without submitting?"
                : "End session and view report?"}
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
