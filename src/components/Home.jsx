export default function Home({ setScreen }) {
  const subjects = [
    { name: "REG", color: "#784f6e" },
    { name: "AUD", color: "#d93717" },
    { name: "FAR", color: "#004896" },
    { name: "ISC", color: "#A71D4F" },
    { name: "TCP", color: "#A847A8" },
    { name: "BAR", color: "#146E8A" }
  ];

  return (
    <div className="page">
      <h1 className="page-title">CPA Practice</h1>

      <div className="home-grid">
        {subjects.map(sub => (
          <div
            key={sub.name}
            className="home-card"
            style={{ backgroundColor: sub.color }}
            onClick={() => sub.name === "REG" && setScreen("reg")}
          >
            {sub.name}
          </div>
        ))}
      </div>
    </div>
  );
}
