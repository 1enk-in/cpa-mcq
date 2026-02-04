export default function AudModules({
  setScreen,
  setActiveModule,
  setActiveSubject
}) {
  const modules = [
    { id: "A1", title: "Audit Reports", mcqs: 30 },
    { id: "A2", title: "Professional Responsibilities", mcqs: 25 },
    { id: "A3", title: "Audit Planning", mcqs: 20 },
    { id: "A4", title: "Internal Control", mcqs: 35 }
  ];

  return (
    <div className="page">
      {/* HEADER */}
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
          <h1 className="page-title">AUD</h1>
          <p className="subtitle">Auditing & Attestation</p>
        </div>

        <button
          className="history-btn"
          onClick={() => {
            setActiveSubject("aud"); // 🔑 REQUIRED
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
              setActiveSubject("aud"); // 🔑 REQUIRED
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
