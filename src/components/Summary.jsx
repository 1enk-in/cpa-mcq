import { useEffect, useRef } from "react";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Summary({ sessionData, setScreen }) {
  if (!sessionData) return null;

  const { user } = useAuth();
  const hasSavedRef = useRef(false);


  const {
    module,
    total,
    attempted,
    answered,
    correct,
    wrong,
    wrongIndexes,
    answers,
    isRetry
  } = sessionData;

  const attemptedCount = attempted ?? answered ?? 0;
  const wrongCount = wrong ?? wrongIndexes?.length ?? 0;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  /* ===============================
     🔥 UPDATE STREAK (Firestore)
     =============================== */
  async function updateStreak() {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const { streak = 0, lastActiveDate } = snap.data();

    let newStreak = 1;

    if (lastActiveDate) {
      const diff =
        (new Date(today) - new Date(lastActiveDate)) /
        (1000 * 60 * 60 * 24);

      if (diff === 0) newStreak = streak;          // same day
      else if (diff === 1) newStreak = streak + 1; // consecutive
      else newStreak = 1;                          // broken
    }

    await updateDoc(userRef, {
      streak: newStreak,
      lastActiveDate: today
    });
  }

  /* ===============================
     📊 SAVE MCQ HISTORY (Firestore)
     =============================== */
  async function saveHistory() {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "mcqHistory");

    await addDoc(ref, {
      module,
      total,
      attempted: attemptedCount,
      correct,
      wrong: wrongCount,
      percent,

      // 🔥 REQUIRED FOR REVIEW & RETRY
      wrongIndexes: wrongIndexes ?? [],
      answers: answers ?? {},

      isRetry: isRetry === true,
      completedAt: serverTimestamp()
    });
  }

  /* ===============================
     🚀 SAVE ON SUMMARY LOAD (KEY FIX)
     =============================== */
  useEffect(() => {
  if (hasSavedRef.current) return;

  hasSavedRef.current = true;

  saveHistory();
  updateStreak();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  return (
    <div className="page">
      <h1>Summary Report</h1>

      <div className="summary-card">
        <div>
          Number of questions: <strong>{total}</strong>
        </div>
        <div>
          Attempted: <strong>{attemptedCount}</strong>
        </div>
        <div>
          Correct: <strong>{correct}</strong>
        </div>
        <div>
          Wrong: <strong>{wrongCount}</strong>
        </div>
        <div>
          Percent correct: <strong>{percent}%</strong>
        </div>
      </div>

      {/* 🔁 RETRY */}
      {wrongCount > 0 && (
        <button
          className="end-btn secondary"
          onClick={() => setScreen("retry")}
        >
          Retry Wrong Questions
        </button>
      )}

      {/* ⬅️ BACK */}
      <button
        className="back"
        onClick={() => setScreen("home")}
      >
        Back to Home
      </button>
    </div>
  );
}
