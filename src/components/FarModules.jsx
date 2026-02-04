export default function FarModules({
  setScreen,
  setActiveModule,
  setActiveSubject
}) {
  const modules = [
    { id: "F1", title: "Conceptual Framework", mcqs: 30 },
    { id: "F2", title: "Financial Statements", mcqs: 40 },
    { id: "F3", title: "Revenue Recognition", mcqs: 35 },
    { id: "F4", title: "Inventory", mcqs: 25 }
  ];

  return (
    <div className="page">
      <div className="reg-header-alt">
        <button
          className="back"
          onClick={() => {
            setActiveSubject(null);
            setScreen("home");
          }}
        >
          ← Home
        </button>

        <div className="reg-title-wrap">
          <h1 className="page-title">FAR</h1>
          <p className="subtitle">Financial Accounting & Reporting</p>
        </div>

        <button
          className="history-btn"
          onClick={() => {
            setActiveSubject("far");
            setScreen("history");
          }}
        >
          ⟲ History
        </button>
      </div>

      <div className="timeline">
        {modules.map((m, idx) => (
          <div
            key={m.id}
            className="timeline-item"
            onClick={() => {
              setActiveSubject("far");
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
                MCQs • {m.mcqs}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
