import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { getUserStreak } from "../utils/streak";


export default function Home({ setScreen, theme, setTheme }) {
  function launchConfetti(isActive, event) {
  const emojis = isActive
    ? ["🔥", "🔥", "🥳", "🎉", "👍", "💪"]
    : ["💔", "💔", "🥀", "😢"];

  const rect = event.currentTarget.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  emojis.forEach((emoji) => {
    const el = document.createElement("div");
    el.className = "emoji-burst";
    el.textContent = emoji;

    // start exactly from badge center
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;

    // random blast direction
    const angle = Math.random() * 2 * Math.PI;
    const distance = 80 + Math.random() * 40;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);

    document.body.appendChild(el);

    setTimeout(() => el.remove(), 900);
  });
}


  const { user, role, logout } = useAuth();
  const [streak, setStreak] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const subjects = [
    { name: "REG", color: "#784f6e" },
    { name: "AUD", color: "#d93717" },
    { name: "FAR", color: "#004896" },
    { name: "ISC", color: "#A71D4F" },
    { name: "TCP", color: "#A847A8" },
    { name: "BAR", color: "#146E8A" }
  ];

  /* LOAD PROFILE IMAGE */
  useEffect(() => {
    const saved = localStorage.getItem(`profile_image_${user}`);
    if (saved) setProfileImage(saved);
  }, [user]);

  useEffect(() => {
  if (!user) return;

  const data = getUserStreak(user);
  setStreak(data);
}, [user]);


  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
      localStorage.setItem(`profile_image_${user}`, reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="page">
      {/* AVATAR */}
      {/* 🧊 GLASS TOP BAR */}
<div className="top-glass-bar">
  <div className="top-title">CPA PRACTICE</div>

{streak && (
  <div
  className={`streak-badge ${
    streak.currentStreak === 0 ? "inactive" : "active"
  }`}
  onClick={(e) =>
  launchConfetti(streak.currentStreak > 0, e)
}
>
    {streak.currentStreak === 0
      ? "💔"
      : `🔥 ${streak.currentStreak}`}
  </div>
)}


  <div
    className="top-profile"
    onClick={() => {
      setShowProfile(true);
      setShowSettings(false);
    }}
  >
    {profileImage ? (
      <img src={profileImage} alt="profile" />
    ) : (
      user.charAt(0).toUpperCase()
    )}
  </div>
</div>


      {/* PROFILE DRAWER */}
      {showProfile && (
        <>
          <div className="profile-backdrop" onClick={() => setShowProfile(false)} />

          <div className="profile-drawer">
            <button className="profile-close" onClick={() => setShowProfile(false)}>
              ✕
            </button>

            <div className="profile-big-avatar">
              {profileImage ? (
                <img src={profileImage} alt="profile" />
              ) : (
                user?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="profile-username">{user}</div>

            {/* 👑 ADMIN DASHBOARD */}
            {role === "admin" && (
              <button
                className="profile-action"
                onClick={() => {
                  setShowProfile(false);
                  setScreen("admin-history");
                }}
              >
                👑 Admin Dashboard
              </button>
            )}

            {!showSettings && (
              <button className="profile-action" onClick={() => setShowSettings(true)}>
                ⚙️ Settings
              </button>
            )}

            {showSettings && (
              <div className="profile-settings">
                <label className="profile-image-label">
                  <div className="pencil-icon">
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
                <div className="profile-setting-row">
  <span>Dark Mode</span>

  <label className="theme-switch">
    <input
      type="checkbox"
      checked={theme === "dark"}
      onChange={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
    />
    <span className="slider" />
  </label>
</div>


                <button className="profile-action" onClick={() => setShowSettings(false)}>
                  ← Back
                </button>
              </div>
            )}

            <button className="profile-action logout" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </>
      )}

      

      <div className="home-grid">
        {subjects.map(sub => (
          <div
            key={sub.name}
            className="home-card"
            style={{ backgroundColor: sub.color }}
            onClick={() => setScreen(sub.name.toLowerCase())}
          >
            {sub.name}
          </div>
        ))}
      </div>
    </div>
  );
}
