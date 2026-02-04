import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";


export default function Home({ setScreen }) {
  const { user, logout } = useAuth();

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

  /* ===============================
     🔄 LOAD SAVED PROFILE IMAGE
     =============================== */
  useEffect(() => {
    if (!user) return;

    const saved = localStorage.getItem(
      `profile_image_${user}`
    );

    if (saved) {
      setProfileImage(saved);
    }
  }, [user]);

  /* ===============================
     🖼️ HANDLE IMAGE UPLOAD
     =============================== */
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProfileImage(base64);
      localStorage.setItem(
        `profile_image_${user}`,
        base64
      );
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="page">

      {/* 👤 SMALL AVATAR BUTTON */}
      <div
        className="profile-avatar-btn"
        onClick={() => {
          setShowProfile(true);
          setShowSettings(false);
        }}
      >
        {profileImage ? (
          <img src={profileImage} alt="profile" />
        ) : (
          user?.charAt(0).toUpperCase()
        )}
      </div>

      {/* ⬅️ PROFILE DRAWER */}
      {showProfile && (
        <>
          <div
            className="profile-backdrop"
            onClick={() => setShowProfile(false)}
          />

          <div className="profile-drawer">
            <button
              className="profile-close"
              onClick={() => setShowProfile(false)}
            >
              ✕
            </button>

            {/* BIG AVATAR */}
            <div className="profile-big-avatar">
              {profileImage ? (
                <img src={profileImage} alt="profile" />
              ) : (
                user?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="profile-username">{user}</div>

            {/* SETTINGS */}
            {!showSettings && (
              <button
                className="profile-action"
                onClick={() => setShowSettings(true)}
              >
                ⚙️ Settings
              </button>
            )}

            {/* SETTINGS PANEL */}
            {showSettings && (
              <div className="profile-settings">
                <div className="profile-image-edit">
  <label className="profile-image-label">
    <div className="pencil-icon">
  <FontAwesomeIcon icon={faPenToSquare} />
</div>


    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      hidden
    />
  </label>
</div>


                <button
                  className="profile-action"
                  onClick={() => setShowSettings(false)}
                >
                  ← Back
                </button>
              </div>
            )}

            {/* LOGOUT */}
            <button
              className="profile-action logout"
              onClick={logout}
            >
              🚪 Logout
            </button>
          </div>
        </>
      )}

      {/* TITLE */}
      <h1 className="page-title">CPA Practice</h1>

      {/* SUBJECT GRID */}
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
