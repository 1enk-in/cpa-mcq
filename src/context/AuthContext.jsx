import { createContext, useContext, useEffect, useRef, useState } from "react";

const AuthContext = createContext();

// 🔁 TEST: 30 sec (change to 2 * 60 * 60 * 1000 for 2 hours)
const SESSION_DURATION = 3000 * 1000;

// 🔐 FIXED USERS (LOCAL ONLY)
const USERS = {
  admin: {
    password: "admin123",
    role: "admin"
  },
  Naved: {
    password: "naved",
    role: "user"
  },
  Faiz: {
    password: "faiz",
    role: "user"
  },
   Afzal: {
    password: "afzal",
    role: "user"
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  const [needsReauth, setNeedsReauth] = useState(false);
  const [reauthAttempts, setReauthAttempts] = useState(0);

  const timerRef = useRef(null);

  /* ===============================
     🔁 RESTORE SESSION ON LOAD
     =============================== */
  useEffect(() => {
    const saved = localStorage.getItem("activeSession");
    if (!saved) return;

    const session = JSON.parse(saved);

    if (
      session.username &&
      session.expiresAt &&
      Date.now() < session.expiresAt &&
      USERS[session.username]
    ) {
      setUser(session.username);
      setRole(USERS[session.username].role);
      setExpiresAt(session.expiresAt);
    } else {
      localStorage.removeItem("activeSession");
    }
  }, []);

  /* ===============================
     ⏱️ SESSION TIMER (SINGLE SOURCE)
     =============================== */
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!user || !expiresAt || needsReauth) return;

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
    const record = USERS[username];
    if (!record) return false;
    if (record.password !== password) return false;

    const expiry = Date.now() + SESSION_DURATION;

    localStorage.setItem(
      "activeSession",
      JSON.stringify({
        username,
        expiresAt: expiry
      })
    );

    setUser(username);
    setRole(record.role);
    setExpiresAt(expiry);
    setNeedsReauth(false);
    setReauthAttempts(0);

    return true;
  }

  /* ===============================
     🔁 REAUTHENTICATE
     =============================== */
  function reauthenticate(password) {
    if (!user || !USERS[user]) {
      logout();
      return false;
    }

    // ✅ correct password
    if (USERS[user].password === password) {
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
    setRole(null);
    setExpiresAt(null);
    setNeedsReauth(false);
    setReauthAttempts(0);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
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
