export default function RegModules({ setScreen, setActiveModule }) {
  const modules = [
    { id: "M1", title: "Filing Requirements and Filing Status", mcqs: 25 },
    { id: "M2", title: "Gross Income: Part 1", mcqs: 40 },
    { id: "M3", title: "Gross Income: Part 2", mcqs: 35 },
    { id: "M4", title: "Adjustments", mcqs: 30 },
    { id: "M5", title: "Itemized Deductions", mcqs: 45 },
    { id: "M6", title: "Section 199A Qualified Business Income Deduction", mcqs: 20 },
    { id: "M7", title: "Tax Computations and Credits", mcqs: 50 }
  ];

  return (
    <div className="page">
      {/* HEADER */}
      <div className="reg-header-alt">
        <button className="back" onClick={() => setScreen("home")}>
          ← Home
        </button>

        <div className="reg-title-wrap">
          <h1 className="page-title">REG</h1>
          <p className="subtitle">Individual Taxation Modules</p>
        </div>

        {/* HISTORY BUTTON */}
        <button
          className="history-btn"
          onClick={() => setScreen("history")}
        >
          ⟲ History
        </button>
      </div>

      {/* TIMELINE */}
      <div className="timeline">
        {modules.map((m, idx) => (
          <div
            key={m.id}
            className={`timeline-item ${m.id !== "M1" ? "disabled" : ""}`}
            onClick={() => {
              if (m.id !== "M1") return;

              setActiveModule(m.id); // 🔑 CRITICAL
              setScreen("mcq");
            }}
          >
            <div className="timeline-left">
              <div className="module-badge">{m.id}</div>
              {idx !== modules.length - 1 && <div className="line" />}
            </div>

            <div className="timeline-card">
              <div className="timeline-title">{m.title}</div>
              <div className="timeline-meta">
                MCQs • {m.mcqs} questions
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
