export default function RegModules({ setScreen }) {
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
      {/* Header */}
      <div className="reg-header-alt">
        <button className="back" onClick={() => setScreen("home")}>
          ← Home
        </button>
        <div>
          <h1 className="page-title">REG</h1>
          <p className="subtitle">Individual Taxation Modules</p>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="timeline">
        {modules.map((m, idx) => (
          <div
            key={m.id}
            className="timeline-item"
            onClick={() => m.id === "M1" && setScreen("mcq")}
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
