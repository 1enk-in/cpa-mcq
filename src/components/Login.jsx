import { useState } from "react";

const USERS = [
  { id: "user1", password: "pass123", role: "user" },
  { id: "user2", password: "pass123", role: "user" },
  { id: "user3", password: "pass123", role: "user" },
  { id: "admin", password: "admin123", role: "admin" }
];

export default function Login({ setCurrentUser, setScreen }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    const user = USERS.find(
      u => u.id === id && u.password === password
    );

    if (!user) {
      setError("Invalid ID or password");
      return;
    }

    localStorage.setItem("cpa_current_user", JSON.stringify(user));
    setCurrentUser(user);
    setScreen("home");
  }

  return (
    <div className="page login-page">
      <h1>CPA Practice Login</h1>

      <input
        placeholder="User ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
