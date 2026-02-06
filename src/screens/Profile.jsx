import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setUsername(snap.data().username || "");
      }
    };

    fetchUser();
  }, [user]);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(doc(db, "users", user.uid), {
        username: username.trim(),
      });

      alert("Username updated ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Profile</h2>

      <div className="card">
        <label>Username</label>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button onClick={handleUpdateUsername} disabled={loading}>
          {loading ? "Updating..." : "Update Username"}
        </button>
      </div>
    </div>
  );
}
