import { useEffect, useState } from "react";

import Home from "./components/Home";
import RegModules from "./components/RegModules";
import AudModules from "./components/AudModules";
import FarModules from "./components/FarModules";
import BarModules from "./components/BarModules";
import IscModules from "./components/IscModules";
import TcpModules from "./components/TcpModules";
import MCQ from "./components/MCQ";
import Summary from "./components/Summary";
import History from "./components/History";
import Review from "./components/Review";

const SESSION_KEY = "cpa_active_session";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeModule, setActiveModule] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null); // 🔑 IMPORTANT
  const [sessionData, setSessionData] = useState(null);
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
      {/* HOME */}
      {screen === "home" && (
        <Home
          setScreen={setScreen}
        />
      )}

      {/* REG */}
      {screen === "reg" && (
        <RegModules
          setScreen={setScreen}
          setActiveModule={setActiveModule}
          setActiveSubject={setActiveSubject}
        />
      )}

      {/* AUD */}
      {screen === "aud" && (
        <AudModules
          setScreen={setScreen}
          setActiveModule={setActiveModule}
          setActiveSubject={setActiveSubject}
        />
      )}

      {/* FAR */}
      {screen === "far" && (
        <FarModules
          setScreen={setScreen}
          setActiveModule={setActiveModule}
          setActiveSubject={setActiveSubject}
        />
      )}

      {/* BAR */}
      {screen === "bar" && (
        <BarModules
          setScreen={setScreen}
          setActiveModule={setActiveModule}
          setActiveSubject={setActiveSubject}
        />
      )}

      {/* ISC */}
      {screen === "isc" && (
        <IscModules
          setScreen={setScreen}
          setActiveModule={setActiveModule}
          setActiveSubject={setActiveSubject}
        />
      )}

      {/* TCP */}
      {screen === "tcp" && (
        <TcpModules
          setScreen={setScreen}
          setActiveModule={setActiveModule}
          setActiveSubject={setActiveSubject}
        />
      )}

      {/* MCQ */}
      {screen === "mcq" && activeModule && (
  <MCQ
    module={activeModule}
    setScreen={setScreen}
    setSessionData={setSessionData}
    activeSubject={activeSubject}   // 🔑 ADD THIS
  />
)}


      {/* RETRY MODE */}
      {screen === "retry" && sessionData && (
  <MCQ
    module={sessionData.module}
    retryIndexes={sessionData.wrongIndexes}
    setScreen={setScreen}
    setSessionData={setSessionData}
    activeSubject={activeSubject}   // 🔑 ADD THIS
  />
)}


      {/* SUMMARY */}
      {screen === "summary" && sessionData && (
        <Summary
          sessionData={sessionData}
          setScreen={setScreen}
        />
      )}

      {/* HISTORY (SUBJECT-AWARE) */}
      {screen === "history" && (
        <History
          setScreen={setScreen}
          setReviewSession={setReviewSession}
          activeSubject={activeSubject} // ✅ REAL SUBJECT CONTEXT
        />
      )}

      {/* REVIEW */}
      {screen === "review" && reviewSession && (
        <Review
          reviewSession={reviewSession}
          setScreen={setScreen}
        />
      )}
    </>
  );
}
