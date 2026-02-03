import regM1 from "../data/reg_m1.json";

const questions = regM1.questions;

export default function Review({ reviewSession, setScreen }) {
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

  const wrongQuestions = questions.filter((q, i) => {
    const userAnswer = reviewSession.answers[i];
    return userAnswer !== null && userAnswer !== q.correctIndex;
  });

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="top-bar">
        <button className="back" onClick={() => setScreen("history")}>
          ← History
        </button>
      </div>

      <h2 className="page-title">Review Wrong Answers</h2>

      {wrongQuestions.length === 0 ? (
        <p className="empty-history">
          🎉 No wrong answers in this session!
        </p>
      ) : (
        wrongQuestions.map((q, i) => {
          const userAnswer =
            reviewSession.answers[questions.indexOf(q)];

          return (
            <div key={q.id} className="mcq-card">
              <div className="mcq-id">{q.id}</div>
              <div className="mcq-question">{q.question}</div>

              {q.options.map((opt, idx) => {
                let cls = "option";

                if (idx === q.correctIndex) cls += " correct";
                else if (idx === userAnswer) cls += " wrong";

                return (
                  <div key={idx} className={cls}>
                    <strong>
                      {String.fromCharCode(65 + idx)}.
                    </strong>{" "}
                    {opt}
                  </div>
                );
              })}

              <div className="explanation">
                <h4>Explanation</h4>
                <p>
                  <strong>
                    Choice "{q.explanation.correct.choice}" is
                    correct.
                  </strong>{" "}
                  {q.explanation.correct.text}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
