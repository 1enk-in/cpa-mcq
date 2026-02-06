import { useEffect, useState } from "react";

/* ===============================
   📚 MODULE QUESTION BANKS
   =============================== */
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

/* ===============================
   🧠 MODULE MAP
   =============================== */
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

export default function Review({ reviewSession, setScreen }) {
  const [activeIndex, setActiveIndex] = useState(null);

  /* ===============================
     🛑 SAFETY CHECK
     =============================== */
  if (!reviewSession) {
    return (
      <div className="page">
        <p>No session selected.</p>
        <button onClick={() => setScreen("history")}>
          ← Back to History
        </button>
      </div>
    );
  }

  /* ===============================
     🔒 BACKWARD-SAFE DESTRUCTURE
     =============================== */
  const module = reviewSession.module;
  const wrongIndexes = reviewSession.wrongIndexes ?? [];
  const answers = reviewSession.answers ?? [];

  const questions = MODULE_DATA[module]?.questions || [];

  /* ===============================
     🔹 AUTO-SELECT FIRST WRONG MCQ
     =============================== */
  useEffect(() => {
    if (wrongIndexes.length > 0) {
      setActiveIndex(wrongIndexes[0]);
    }
  }, [wrongIndexes]);

  /* ===============================
     🎉 NO WRONG QUESTIONS
     =============================== */
  if (wrongIndexes.length === 0) {
    return (
      <div className="page">
        <div className="top-bar">
          <button className="back" onClick={() => setScreen("history")}>
            ← History
          </button>
        </div>

        <h2 className="page-title">Review</h2>
        <p className="empty-history">
          🎉 No wrong questions in this session!
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="top-bar">
        <button className="back" onClick={() => setScreen("history")}>
          ← History
        </button>
      </div>

      <h2 className="page-title">
        Review Wrong Answers ({module})
      </h2>

      {/* WRONG QUESTION SELECTOR */}
      <div className="panel">
        {wrongIndexes.map(idx => (
          <div
            key={idx}
            className={`panel-box ${
              activeIndex === idx ? "active" : ""
            }`}
            onClick={() => setActiveIndex(idx)}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {/* ACTIVE QUESTION */}
      {activeIndex !== null && questions[activeIndex] && (() => {
        const q = questions[activeIndex];
        const userAnswer = answers?.[activeIndex];
        return (
          <div className="mcq-card">
            <div className="mcq-id">{q.id}</div>
            <div className="mcq-question">{q.question}</div>

            {q.options.map((opt, i) => {
              let cls = "option";
              if (i === q.correctIndex) cls += " correct";
              else if (i === userAnswer) cls += " wrong";

              return (
                <div key={i} className={cls}>
                  <strong>{String.fromCharCode(65 + i)}.</strong>{" "}
                  {opt}
                </div>
              );
            })}

            {/* EXPLANATION */}
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
                    <strong>
                      Choice "{choice}" is incorrect.
                    </strong>{" "}
                    {text}
                  </p>
                )
              )}
            </div>
          </div>
        );
      })()}

      {/* 🔁 RETRY WRONG QUESTIONS */}
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button
          className="end-btn"
          onClick={() => setScreen("retry")}
        >
          Retry These Questions
        </button>
      </div>
    </div>
  );
}
