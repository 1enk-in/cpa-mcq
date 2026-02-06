import { useEffect, useState } from "react";
import Profile from "./screens/Profile";


import Home from "./components/Home";
import AdminHistory from "./components/AdminHistory";
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
     🔑 AUTH
     =============================== */
  const { user, loading, logout } = useAuth();
  console.log("AUTH USER:", user);
console.log("ROLE:", user?.role);

  console.log("AUTH STATE:", { user, loading });



  const [screen, setScreen] = useState("home");

  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light"
);

  /* ===============================
   👑 FORCE ADMIN TO DASHBOARD
================================ */
useEffect(() => {
  if (user?.role === "admin") {
    setScreen("admin-history");
  }
}, [user]);

useEffect(() => {
  const saved = localStorage.getItem("cpa_active_mcq");
  if (!saved) return;

  const { screen, module } = JSON.parse(saved);

  if (screen === "mcq" && module) {
    setActiveModule(module);
    setScreen("mcq");
  }
}, []);



useEffect(() => {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}, [theme]);


  const [activeModule, setActiveModule] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [reviewSession, setReviewSession] = useState(null);
  const [startIndex, setStartIndex] = useState(0);


  /* ===============================
     🔐 REAUTH MODAL STATE
     =============================== */
  /* const [reauthPassword, setReauthPassword] = useState("");
  const [reauthError, setReauthError] = useState(""); */

  /* ===============================
     🔁 RESTORE ACTIVE MCQ SESSION
     =============================== */
  

  /* ===============================
     🔐 LOGIN GATE
     =============================== */
  if (loading) {
  return null;
}

if (!user) {
  return <Login />;
}


  /* ===============================
     🔐 REAUTH HANDLER
     =============================== */
  /* function handleReauthSubmit(e) {
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
  } */

  return (
    <>
      <>
  {/* 🔐 REAUTH MODAL */}
  {/* {needsReauth && (
    <div className="modal-overlay">
      <div className="modal-box danger">
        <h3>Are you still alive?</h3>
        <p>Please re-enter your password.</p>

        <form onSubmit={handleReauthSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={reauthPassword}
            onChange={e => setReauthPassword(e.target.value)}
            autoFocus
          />

          {reauthError && <p className="error">{reauthError}</p>}

          <button type="submit">Continue</button>
        </form>

        <p className="attempts">
          Attempts left: {3 - reauthAttempts}
        </p>
      </div>
    </div>
  )} */}

  {/* 👑 ADMIN — HARD LOCK */}
  {user.role === "admin" ? (
  <AdminHistory setScreen={setScreen} />
) : (

    <>
      {/* HOME */}
      {screen === "home" && (
  <Home
  setScreen={setScreen}
  screen={screen}
  theme={theme}
  setTheme={setTheme}
/>

)}
{/* PROFILE */}
{screen === "profile" && (
  <Profile setScreen={setScreen} />
)}






      {/* MODULE SCREENS */}
      {screen === "reg" && (
        <RegModules setScreen={setScreen} setActiveModule={setActiveModule} setActiveSubject={setActiveSubject} />
      )}
      {screen === "aud" && (
        <AudModules setScreen={setScreen} setActiveModule={setActiveModule} setActiveSubject={setActiveSubject} />
      )}
      {screen === "far" && (
        <FarModules setScreen={setScreen} setActiveModule={setActiveModule} setActiveSubject={setActiveSubject} />
      )}
      {screen === "bar" && (
        <BarModules setScreen={setScreen} setActiveModule={setActiveModule} setActiveSubject={setActiveSubject} />
      )}
      {screen === "isc" && (
        <IscModules setScreen={setScreen} setActiveModule={setActiveModule} setActiveSubject={setActiveSubject} />
      )}
      {screen === "tcp" && (
        <TcpModules setScreen={setScreen} setActiveModule={setActiveModule} setActiveSubject={setActiveSubject} />
      )}

      {/* MCQ */}
      {screen === "mcq" && activeModule && (
        <MCQ
          module={activeModule}
          setScreen={setScreen}
          setSessionData={setSessionData}
          activeSubject={activeSubject}
          user={user}
        />
      )}

      {/* RETRY */}
      {screen === "retry" && sessionData && (
        <MCQ
          module={sessionData.module}
          retryIndexes={sessionData.wrongIndexes}
          setScreen={setScreen}
          setSessionData={setSessionData}
          activeSubject={activeSubject}
          user={user}
        />
      )}


      {/* SUMMARY */}
      {screen === "summary" && sessionData && (
        <Summary sessionData={sessionData} setScreen={setScreen} />
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
        <Review reviewSession={reviewSession} setScreen={setScreen} />
      )}
    </>
  )}
</>
    </>
  );
}
