import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ setScreen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // ✅ Firebase AuthContext will auto-update
      setScreen("home"); // optional if routing already handles this
    } catch (err) {
      console.error(err);
      setError("Invalid user ID or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

        <label>USER ID</label>
        <input
          type="email"
          placeholder="ENTER USER ID"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>PASSWORD</label>
        <input
          type="password"
          placeholder="ENTER PASSWORD"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* 🔴 KEEP ERROR EXACTLY */}
        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
}
