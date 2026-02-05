import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function Home({ setScreen, theme, setTheme }) {
  const { user, role, logout } = useAuth();

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
      <div
  className={`profile-corner-handle ${showProfile ? "hidden" : ""}`}
  onClick={() => {
    setShowProfile(true);
    setShowSettings(false);
  }}
>
  {profileImage ? (
    <img src={profileImage} alt="profile" />
  ) : (
    <span>{user?.charAt(0).toUpperCase()}</span>
  )}
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

      <h1 className="page-title">CPA Practice</h1>

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
