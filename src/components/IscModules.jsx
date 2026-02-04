export default function IscModules({
  setScreen,
  setActiveModule,
  setActiveSubject
}) {
  const modules = [
    { id: "I1", title: "Information Systems & Controls", mcqs: 30 },
    { id: "I2", title: "IT Governance", mcqs: 25 },
    { id: "I3", title: "Security & Access Controls", mcqs: 20 },
    { id: "I4", title: "System Development & Change Management", mcqs: 25 }
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
          <h1 className="page-title">ISC</h1>
          <p className="subtitle">Information Systems & Controls</p>
        </div>

        <button
          className="history-btn"
          onClick={() => {
            setActiveSubject("isc");
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
              setActiveSubject("isc");
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
