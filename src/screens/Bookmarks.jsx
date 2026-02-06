import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Bookmarks({ setScreen, setActiveModule, setStartIndex }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data().bookmarks || {};
        setBookmarks(
  Object.values(data).map(b => ({
    ...b,
    baseIndex: Number.isInteger(b.baseIndex) ? b.baseIndex : null
  }))
);
      }
    }
    load();
  }, [user]);

  return (
    <div className="page">
      <h2>⭐ Bookmarked Questions</h2>

      {bookmarks.length === 0 && <p>No bookmarks yet.</p>}

      {bookmarks.map((b, i) => (
        <div
          key={i}
          className="bookmark-card"
          onClick={() => {
            setActiveModule(b.module);
            setStartIndex(
  Number.isInteger(b.baseIndex) ? b.baseIndex : 0
);
setScreen("mcq-review");

          }}
        >
          <strong>{b.module}</strong>
          <div>Question ID: {b.questionId}</div>
        </div>
      ))}

      <button onClick={() => setScreen("home")}>← Back</button>
    </div>
  );
}
