import { supabase } from "../supabaseClient";

/* ===============================
   📅 DATE HELPERS (LOCAL SAFE)
   =============================== */
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

/* ===============================
   🔥 UPDATE STREAK (CALL FROM MCQ)
   =============================== */
export async function updateSessionStreak(userId) {
  if (!userId) return null;

  const today = getLocalDateString();

  // 1️⃣ fetch existing streak
  const { data: existing } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  // 🚫 already counted today
  if (existing?.last_active_date === today) {
    return existing;
  }

  let newStreak = 1;

  if (existing?.last_active_date) {
    const diff =
      (new Date(today) - new Date(existing.last_active_date)) /
      (1000 * 60 * 60 * 24);

    newStreak = diff === 1 ? existing.streak + 1 : 1;
  }

  // 2️⃣ upsert
  const { data, error } = await supabase
    .from("user_streaks")
    .upsert({
      user_id: userId,
      streak: newStreak,
      last_active_date: today
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Streak update failed", error);
    return null;
  }

  return data;
}

/* ===============================
   🏠 READ STREAK FOR HOME
   =============================== */
export async function getSessionStreakStatus(userId) {
  if (!userId) {
    return { streak: 0, status: "inactive", message: "" };
  }

  const today = getLocalDateString();
  const yesterday = getYesterday();

  const { data } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) {
    return {
      streak: 0,
      status: "inactive",
      message: "Complete a session today to start your streak"
    };
  }

  // ❌ missed day
  if (
    data.last_active_date !== today &&
    data.last_active_date !== yesterday
  ) {
    return {
      streak: 0,
      status: "inactive",
      message: "Your streak was reset. Complete a session to start again."
    };
  }

  // ⚠️ yesterday only
  if (data.last_active_date === yesterday) {
    return {
      streak: data.streak,
      status: "inactive",
      message: "Complete a session today to continue your streak."
    };
  }

  // ✅ today
  return {
    streak: data.streak,
    status: "active",
    message: ""
  };
}
