export default function BarModules({
  setScreen,
  setActiveModule,
  setActiveSubject
}) {
  const modules = [
    { id: "B1", title: "Financial Statement Analysis", mcqs: 30 },
    { id: "B2", title: "Ratio Analysis", mcqs: 25 },
    { id: "B3", title: "Forecasting & Projections", mcqs: 20 },
    { id: "B4", title: "Business Valuation", mcqs: 25 }
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
          <h1 className="page-title">BAR</h1>
          <p className="subtitle">Business Analysis & Reporting</p>
        </div>

        <button
          className="history-btn"
          onClick={() => {
            setActiveSubject("bar");
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
              setActiveSubject("bar");
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
