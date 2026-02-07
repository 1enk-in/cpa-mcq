// ===============================
// 📅 DATE HELPERS (LOCAL SAFE)
// ===============================
function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

// ===============================
// 🔥 UPDATE STREAK (CALL FROM MCQ)
// ===============================
export function updateSessionStreak(userId) {
  if (!userId) return null;

  const key = `cpa_streak_${userId}`;
  const today = getLocalDateString();

  const saved =
    JSON.parse(localStorage.getItem(key)) || {
      streak: 0,
      lastActiveDate: null
    };

  // 🚫 already counted today
  if (saved.lastActiveDate === today) {
    return saved;
  }

  let newStreak = 1;

  if (saved.lastActiveDate) {
    const diff =
      (new Date(today) - new Date(saved.lastActiveDate)) /
      (1000 * 60 * 60 * 24);

    // ✅ continue only if exactly yesterday
    newStreak = diff === 1 ? saved.streak + 1 : 1;
  }

  const updated = {
    streak: newStreak,
    lastActiveDate: today
  };

  localStorage.setItem(key, JSON.stringify(updated));

  // 🔔 notify Home immediately
  window.dispatchEvent(
    new CustomEvent("streak-updated", { detail: updated })
  );

  return updated;
}

// ===============================
// 🏠 READ STREAK FOR HOME SCREEN
// ===============================
export function getSessionStreakStatus(userId) {
  if (!userId) {
    return { streak: 0, status: "inactive", message: "" };
  }

  const raw = localStorage.getItem(`cpa_streak_${userId}`);

  if (!raw) {
    return {
      streak: 0,
      status: "inactive",
      message: "Complete a session today to start your streak"
    };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { streak: 0, status: "inactive", message: "" };
  }

  const today = getLocalDateString();
  const yesterday = getYesterday();

  // ❌ missed at least one full day → reset
  if (
    data.lastActiveDate !== today &&
    data.lastActiveDate !== yesterday
  ) {
    return {
      streak: 0,
      status: "inactive",
      message: "Your streak was reset. Complete a session to start again."
    };
  }

  // ⚠️ yesterday only → inactive but preserved
  if (data.lastActiveDate === yesterday) {
    return {
      streak: data.streak,
      status: "inactive",
      message: "Complete a session today to continue your streak."
    };
  }

  // ✅ completed today
  return {
    streak: data.streak,
    status: "active",
    message: ""
  };
}
