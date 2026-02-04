import { useEffect, useState } from "react";

import regM1 from "../data/reg/reg_m1.json";
import regM2 from "../data/reg/reg_m2.json";
import regM3 from "../data/reg/reg_m3.json";
import regM4 from "../data/reg/reg_m4.json";
import regM5 from "../data/reg/reg_m5.json";
import regM6 from "../data/reg/reg_m6.json";
import regM7 from "../data/reg/reg_m7.json";

import audA1 from "../data/aud/aud_a1.json";
import audA2 from "../data/aud/aud_a2.json";
import audA3 from "../data/aud/aud_a3.json";
import audA4 from "../data/aud/aud_a4.json";

import farF1 from "../data/far/far_f1.json";
import farF2 from "../data/far/far_f2.json";
import farF3 from "../data/far/far_f3.json";
import farF4 from "../data/far/far_f4.json";

import barB1 from "../data/bar/bar_b1.json";
import barB2 from "../data/bar/bar_b2.json";
import barB3 from "../data/bar/bar_b3.json";
import barB4 from "../data/bar/bar_b4.json";

import iscI1 from "../data/isc/isc_i1.json";
import iscI2 from "../data/isc/isc_i2.json";
import iscI3 from "../data/isc/isc_i3.json";
import iscI4 from "../data/isc/isc_i4.json";

import tcpT1 from "../data/tcp/tcp_t1.json";
import tcpT2 from "../data/tcp/tcp_t2.json";
import tcpT3 from "../data/tcp/tcp_t3.json";
import tcpT4 from "../data/tcp/tcp_t4.json";





const MODULE_DATA = {
  M1: regM1,
  M2: regM2,
  M3: regM3,
  M4: regM4,
  M5: regM5,
  M6: regM6,
  M7: regM7,

  A1: audA1,
  A2: audA2,
  A3: audA3,
  A4: audA4,

  F1: farF1,
  F2: farF2,
  F3: farF3,
  F4: farF4,

  B1: barB1,
  B2: barB2,
  B3: barB3,
  B4: barB4,

  I1: iscI1,
  I2: iscI2,
  I3: iscI3,
  I4: iscI4,

  T1: tcpT1,
  T2: tcpT2,
  T3: tcpT3,
  T4: tcpT4
};


const SESSION_KEY = "cpa_active_session";
const HISTORY_KEY = "cpa_reg_history";

/* 🔀 SHUFFLE HELPER */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MCQ({
  module,
  setScreen,
  setSessionData,
  retryIndexes = null,
  activeSubject       // 🔑 NEW
}) {

  /* 🔒 SAFETY GUARD */
  if (!module) return null;

  const data = MODULE_DATA[module];
  if (!data) return null;

  const baseQuestions = data.questions;

  const [hydrated, setHydrated] = useState(false);

  /* 🔹 BUILD QUESTION SET */
  const rawQuestions = retryIndexes
    ? retryIndexes.map(i => baseQuestions[i])
    : baseQuestions;

  const [questions, setQuestions] = useState(rawQuestions);

  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(total).fill(null));
  const [confirmType, setConfirmType] = useState(null);
  const [error, setError] = useState("");

  /* ===============================
     🔹 RESTORE SESSION (NO SHUFFLE)
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
        setQuestions(parsed.questions); // 🔑 restore exact order
        setHydrated(true);
        return;
      }
    }

    /* 🔹 NEW SESSION → SHUFFLE */
    setQuestions(shuffleArray(rawQuestions));
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
        index,
        questions // 🔑 save order
      })
    );
  }, [answers, index, hydrated, module, questions]);

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
    const wrongIndexes = [];
    let correct = 0;

    answers.forEach((a, i) => {
      if (a === null) return;
      if (a === questions[i].correctIndex) {
        correct++;
      } else {
        wrongIndexes.push(i);
      }
    });

    const report = {
      module,
      isRetry: !!retryIndexes,
      retryOf: retryIndexes ?? null,
      total,
      attempted: answeredCount,
      correct,
      wrong: wrongIndexes.length,
      wrongIndexes,
      percent: Math.round((correct / total) * 100),
      completedAt: new Date().toISOString(),
      answers
    };

    const history =
      JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

    history.unshift(report);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    localStorage.removeItem(SESSION_KEY);

    setSessionData(report);
    setScreen("summary");
  }

  /* ===============================
     🔹 END SESSION (CONFIRM)
     =============================== */
  function handleEndSession() {
    if (answeredCount < 1) {
      setError("Answer at least 1 question to end session.");
      return;
    }
    setConfirmType("end");
  }

  /* ===============================
     🔹 SUBMIT
     =============================== */
  function handleSubmit() {
    if (answeredCount < 1) {
      setError("Answer at least 1 question to submit.");
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
