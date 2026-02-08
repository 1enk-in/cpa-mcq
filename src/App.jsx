import { useEffect, useState } from "react";
import Profile from "./screens/Profile";


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
import Loader from "./components/Loader";


import { useAuth } from "./context/AuthContext";
import Login from "./screens/Login";

const SESSION_KEY = "cpa_active_session";

export default function App() {
  const { user, loading, logout } = useAuth();
  console.log("AUTH USER:", user);
console.log("ROLE:", user?.role);

  console.log("AUTH STATE:", { user, loading });



  const [screen, setScreen] = useState("home");

  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light"
);



useEffect(() => {
  if (!user) return;

  const SESSION_KEY = `cpa_session_${user.uid}`;
  const savedSession = localStorage.getItem(SESSION_KEY);

  if (!savedSession) return; // ✅ nothing to restore

  try {
    const parsed = JSON.parse(savedSession);

    const hasProgress =
      Array.isArray(parsed.answers) &&
      parsed.answers.some(a => a !== null);

    if (parsed.module && hasProgress) {
      setActiveModule(parsed.module);
      setScreen("mcq");
    } else {
      // stale or completed session → cleanup
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("cpa_active_mcq");
    }
  } catch {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("cpa_active_mcq");
  }
}, [user]);





useEffect(() => {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}, [theme]);

useEffect(() => {
  if (loading) return;

  // Decide splash BEFORE rendering app
  if (user && user !== prevUser) {
    setShowSplash(true);
    setAppReady(false);

    const timer = setTimeout(() => {
      setShowSplash(false);
      setAppReady(true);
    }, 1200);

    return () => clearTimeout(timer);
  }

  // No splash needed
  setShowSplash(false);
  setAppReady(true);
  setPrevUser(user);
}, [loading, user]);

  const [activeModule, setActiveModule] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [reviewSession, setReviewSession] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
const [appReady, setAppReady] = useState(false);
const [prevUser, setPrevUser] = useState(null);

  

// 1️⃣ Wait for auth
if (loading) return null;

// 2️⃣ Show splash (blocks app render completely)
if (showSplash) return <Loader />;

// 3️⃣ App not ready yet (extra safety)
if (!appReady) return null;

// 4️⃣ Not logged in
if (!user) return <Login />;




  return (
    <>
      {/* HOME */}
      {screen === "home" && (
  <Home
  key="home" 
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
  <Review
    reviewSession={reviewSession}
    setScreen={setScreen}
    setSessionData={setSessionData}
  />
)}


      {screen !== "mcq" && screen !== "retry" && (
  <footer className="app-footer">
    <span>
      © {new Date().getFullYear()} · Built by <strong>Naved</strong>
    </span>
  </footer>
)}


    </>
  );
}
