export default function RegModules({
  setScreen,
  setActiveModule,
  setActiveSubject
}) {
  const modules = [
    { id: "M1", title: "Filing Requirements and Filing Status", mcqs: 25 },
    { id: "M2", title: "Gross Income: Part 1", mcqs: 53 },
    { id: "M3", title: "Gross Income: Part 2", mcqs: 30 },
    { id: "M4", title: "Adjustments", mcqs: 15 },
    { id: "M5", title: "Itemized Deductions", mcqs: 46 },
    {
      id: "M6",
      title: "Section 199A Qualified Business Income Deduction",
      mcqs: 18
    },
    { id: "M7", title: "Tax Computations and Credits", mcqs: 24 }
  ];

  return (
    <div className="page">
      {/* HEADER */}
      <div className="reg-header-alt">
        <button
          className="back"
          onClick={() => {
            setActiveSubject(null); // reset context
            setScreen("home");
          }}
        >
          ← Home
        </button>

        <div className="reg-title-wrap">
          <h1 className="page-title">REG</h1>
          <p className="subtitle">Individual Taxation Modules</p>
        </div>

        <button
          className="history-btn"
          onClick={() => {
            setActiveSubject("reg"); // 🔑 IMPORTANT
            setScreen("history");
          }}
        >
          ⟲ History
        </button>
      </div>

      {/* TIMELINE */}
      <div className="timeline">
        {modules.map((m, idx) => (
          <div
            key={m.id}
            className="timeline-item"
            onClick={() => {
              setActiveSubject("reg"); // 🔑 REQUIRED
              setActiveModule(m.id);
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
