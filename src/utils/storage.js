const ACTIVE_KEY = "cpa_active_session";
const HISTORY_KEY = "cpa_session_history";

export function saveActiveSession(data) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(data));
}

export function loadActiveSession() {
  const raw = localStorage.getItem(ACTIVE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearActiveSession() {
  localStorage.removeItem(ACTIVE_KEY);
}

export function saveSessionToHistory(session) {
  const raw = localStorage.getItem(HISTORY_KEY);
  const history = raw ? JSON.parse(raw) : [];
  history.unshift(session);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadSessionHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}
