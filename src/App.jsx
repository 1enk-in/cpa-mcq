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

import { useAuth } from "./context/AuthContext";
import Login from "./screens/Login";

const SESSION_KEY = "cpa_active_session";

export default function App() {
  /* ===============================
     🔑 ALL HOOKS FIRST
     =============================== */

  const {
    user,
    logout,
    needsReauth,
    reauthAttempts,
    reauthenticate
  } = useAuth();

  const [screen, setScreen] = useState("home");
  const [activeModule, setActiveModule] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [reviewSession, setReviewSession] = useState(null);

  // 🔐 Re-auth modal local state
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthError, setReauthError] = useState("");

  /* ===============================
     🔹 BOOTSTRAP ACTIVE MCQ SESSION
     =============================== */
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

  /* ===============================
     🔐 LOGIN GATE
     =============================== */
  if (!user) {
    return <Login setScreen={setScreen} />;
  }

  /* ===============================
     🔐 REAUTH HANDLER
     =============================== */
  function handleReauthSubmit(e) {
    e.preventDefault();

    const success = reauthenticate(reauthPassword);

    if (!success) {
      setReauthError(
        `Wrong password. ${Math.max(0, 3 - (reauthAttempts + 1))} attempts left`
      );
    } else {
      setReauthPassword("");
      setReauthError("");
    }
  }

  return (
    <>
      {/* 🔐 ARE YOU STILL ALIVE MODAL */}
      {needsReauth && (
        <div className="modal-overlay">
          <div className="modal-box danger">
            <h3>Are you still alive?</h3>
            <p>Please re-enter your password to continue.</p>

            <form onSubmit={handleReauthSubmit}>
              <input
                type="password"
                placeholder="Password"
                value={reauthPassword}
                onChange={e => setReauthPassword(e.target.value)}
                autoFocus
              />

              {reauthError && (
                <p className="error">{reauthError}</p>
              )}

              <button type="submit">Continue</button>
            </form>

            <p className="attempts">
              Attempts left: {3 - reauthAttempts}
            </p>
          </div>
        </div>
      )}

      {/* LOGOUT */}
      


      {/* HOME */}
      {screen === "home" && (
        <Home setScreen={setScreen} />
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
          activeSubject={activeSubject}
        />
      )}

      {/* RETRY MODE */}
      {screen === "retry" && sessionData && (
        <MCQ
          module={sessionData.module}
          retryIndexes={sessionData.wrongIndexes}
          setScreen={setScreen}
          setSessionData={setSessionData}
          activeSubject={activeSubject}
        />
      )}

      {/* SUMMARY */}
      {screen === "summary" && sessionData && (
        <Summary
          sessionData={sessionData}
          setScreen={setScreen}
        />
      )}

      {/* HISTORY */}
      {screen === "history" && (
        <History
          setScreen={setScreen}
          setReviewSession={setReviewSession}
          activeSubject={activeSubject}
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
