import { useEffect, useState } from "react";

import Home from "./components/Home";
import RegModules from "./components/RegModules";
import MCQ from "./components/MCQ";
import Summary from "./components/Summary";
import History from "./components/History";
import Review from "./components/Review";

const SESSION_KEY = "cpa_active_session";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeModule, setActiveModule] = useState(null);
  const [sessionData, setSessionData] = useState(null); // ✅ ADD THIS
  const [reviewSession, setReviewSession] = useState(null);

  /* 🔹 BOOTSTRAP ACTIVE SESSION */
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.module) {
        setActiveModule(parsed.module);
        setScreen("mcq");
      }
    }
  }, []);

  return (
    <>
      {screen === "home" && <Home setScreen={setScreen} />}

      {screen === "reg" && (
        <RegModules
          setScreen={setScreen}
          setActiveModule={setActiveModule}
        />
      )}

      {screen === "mcq" && activeModule && (
        <MCQ
          module={activeModule}
          setScreen={setScreen}
          setSessionData={setSessionData}   
        />
      )}

      {screen === "summary" && sessionData && (
        <Summary
          sessionData={sessionData}        
          setScreen={setScreen}
        />
      )}

      {screen === "history" && (
        <History
          setScreen={setScreen}
          setReviewSession={setReviewSession}
        />
      )}

      {screen === "review" && reviewSession && (
        <Review
          reviewSession={reviewSession}
          setScreen={setScreen}
        />
      )}
    </>
  );
}
