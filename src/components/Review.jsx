import { useEffect, useState } from "react";

import regM1 from "../data/reg_m1.json";
import regM2 from "../data/reg_m2.json";

const MODULE_DATA = {
  M1: regM1,
  M2: regM2
};

export default function Review({ reviewSession, setScreen }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!reviewSession) {
    return (
      <div className="page">
        <p>No session selected.</p>
        <button onClick={() => setScreen("history")}>
          Back to History
        </button>
      </div>
    );
  }

  const { module, wrongIndexes = [], answers = [] } = reviewSession;
  const questions = MODULE_DATA[module]?.questions || [];

  /* 🔹 AUTO-SELECT FIRST WRONG MCQ */
  useEffect(() => {
    if (wrongIndexes.length > 0) {
      setActiveIndex(wrongIndexes[0]);
    }
  }, [wrongIndexes]);

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

      {wrongIndexes.length === 0 ? (
        <p className="empty-history">
          🎉 No wrong answers in this session!
        </p>
      ) : (
        <>
          {/* WRONG QUESTION NUMBER BOXES */}
          <div className="panel">
            {wrongIndexes.map((idx) => (
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

          {/* SELECTED QUESTION */}
          {activeIndex !== null && questions[activeIndex] && (() => {
            const q = questions[activeIndex];
            const userAnswer = answers[activeIndex];

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
                      <strong>
                        {String.fromCharCode(65 + i)}.
                      </strong>{" "}
                      {opt}
                    </div>
                  );
                })}

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
        </>
      )}
    </div>
  );
}
