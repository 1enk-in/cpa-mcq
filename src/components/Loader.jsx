import { useEffect, useState } from "react";

const SECTIONS = ["REG", "AUD", "FAR", "BAR"];

export default function Loader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % SECTIONS.length);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-wrapper">
      <div className="loader-card">
        

        <h1 className="loader-title">
          CPA{" "}
          <span key={SECTIONS[index]} className="section-text">
            {SECTIONS[index]}
          </span>
        </h1>

        <div className="underline-track">
          <div className="underline-sweep" />
        </div>

        <p className="loader-sub">Preparing your session</p>

      </div>
    </div>
  );
}
