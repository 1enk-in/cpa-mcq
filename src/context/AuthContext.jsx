import { createContext, useContext, useEffect, useRef, useState } from "react";

const AuthContext = createContext();

const SESSION_DURATION = 30 * 1000; // 🔁 TEST: 30 sec (change to 2h later)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  const [needsReauth, setNeedsReauth] = useState(false);
  const [reauthAttempts, setReauthAttempts] = useState(0);

  const timerRef = useRef(null); // 🔑 SINGLE timer source of truth

  /* ===============================
     🔁 RESTORE SESSION ON LOAD
     =============================== */
  useEffect(() => {
    const saved = localStorage.getItem("activeSession");
    if (!saved) return;

    const session = JSON.parse(saved);

    if (Date.now() < session.expiresAt) {
      setUser(session.username);
      setExpiresAt(session.expiresAt);
    } else {
      localStorage.removeItem("activeSession");
    }
  }, []);

  /* ===============================
     ⏱️ SESSION TIMER (NO INTERVAL RACE)
     =============================== */
  useEffect(() => {
    // Clear any previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!user || !expiresAt) return;
    if (needsReauth) return;

    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      setNeedsReauth(true);
      return;
    }

    timerRef.current = setTimeout(() => {
      setNeedsReauth(true);
    }, remaining);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [user, expiresAt, needsReauth]);

  /* ===============================
     🔐 LOGIN
     =============================== */
  function login(username, password) {
    // seed test user
    if (!localStorage.getItem("users")) {
      localStorage.setItem(
        "users",
        JSON.stringify({
          naved: { password: "1234" }
        })
      );
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (!users[username]) return false;
    if (users[username].password !== password) return false;

    const expiry = Date.now() + SESSION_DURATION;

    localStorage.setItem(
      "activeSession",
      JSON.stringify({
        username,
        expiresAt: expiry
      })
    );

    setUser(username);
    setExpiresAt(expiry);
    setNeedsReauth(false);
    setReauthAttempts(0);

    return true;
  }

  /* ===============================
     🔁 REAUTHENTICATE
     =============================== */
  function reauthenticate(password) {
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (!users[user]) {
      logout();
      return false;
    }

    // ✅ correct password
    if (users[user].password === password) {
      const newExpiry = Date.now() + SESSION_DURATION;

      localStorage.setItem(
        "activeSession",
        JSON.stringify({
          username: user,
          expiresAt: newExpiry
        })
      );

      setExpiresAt(newExpiry);
      setNeedsReauth(false);
      setReauthAttempts(0);
      return true;
    }

    // ❌ wrong password
    const next = reauthAttempts + 1;
    setReauthAttempts(next);

    if (next >= 3) {
      logout();
    }

    return false;
  }

  /* ===============================
     🚪 LOGOUT
     =============================== */
  function logout() {
    localStorage.removeItem("activeSession");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setUser(null);
    setExpiresAt(null);
    setNeedsReauth(false);
    setReauthAttempts(0);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        expiresAt,
        needsReauth,
        reauthAttempts,
        login,
        reauthenticate,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
