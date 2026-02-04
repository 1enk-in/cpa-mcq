export default function TcpModules({
  setScreen,
  setActiveModule,
  setActiveSubject
}) {
  const modules = [
    { id: "T1", title: "Individual Taxation", mcqs: 35 },
    { id: "T2", title: "Property Transactions", mcqs: 30 },
    { id: "T3", title: "Entity Taxation", mcqs: 40 },
    { id: "T4", title: "Tax Planning & Strategy", mcqs: 25 }
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
          <h1 className="page-title">TCP</h1>
          <p className="subtitle">Tax Compliance & Planning</p>
        </div>

        <button
          className="history-btn"
          onClick={() => {
            setActiveSubject("tcp");
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
              setActiveSubject("tcp");
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
