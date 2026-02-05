// src/utils/streak.js

function getTodayDate() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function updateUserStreak(username) {
  if (!username) return;

  const key = `cpa_streak_${username}`;
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  const saved =
    JSON.parse(localStorage.getItem(key)) || {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null
    };

  // 🛑 Already counted today → do nothing
  if (saved.lastActiveDate === today) {
    return saved;
  }

  let newStreak = 1;

  // 🔥 Continue streak
  if (saved.lastActiveDate === yesterday) {
    newStreak = saved.currentStreak + 1;
  }

  const updated = {
    currentStreak: newStreak,
    longestStreak: Math.max(saved.longestStreak, newStreak),
    lastActiveDate: today
  };

  localStorage.setItem(key, JSON.stringify(updated));

  return updated;
}

export function getUserStreak(username) {
  if (!username) return null;

  return (
    JSON.parse(localStorage.getItem(`cpa_streak_${username}`)) || {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null
    }
  );
}
