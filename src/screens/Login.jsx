import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ setScreen }) {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const success = login(username.trim(), password);

    if (!success) {
      setError("Invalid username or password");
      return;
    }

    setError("");
    setScreen("home"); // or whatever your default screen is
  }

  return (
    <div className="page login-page">
  <form onSubmit={handleSubmit} className="login-form">
    <h2>Login</h2>

    <label>USER ID</label>
    <input
      type="text"
      placeholder="ENTER USER ID"
      value={username}
      onChange={e => setUsername(e.target.value)}
    />

    <label>PASSWORD</label>
    <input
      type="password"
      placeholder="ENTER PASSWORD"
      value={password}
      onChange={e => setPassword(e.target.value)}
    />

    {/* 🔴 KEEP ERROR EXACTLY */}
    {error && <p className="error">{error}</p>}

    <button type="submit">LOGIN</button>
  </form>
</div>

  );
}
