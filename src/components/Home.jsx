import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";



export default function Home({ setScreen, screen, theme, setTheme }) {
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






  const { user, logout } = useAuth();
  
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [showCredSettings, setShowCredSettings] = useState(false);


  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [updatingPassword, setUpdatingPassword] = useState(false);
const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [username, setUsername] = useState("");
const [newUsername, setNewUsername] = useState("");
const [updatingUsername, setUpdatingUsername] = useState(false);


  console.log("USER ROLE:", user?.role);

  const [streak, setStreak] = useState(null);
  useEffect(() => {
  if (!user) return;

  async function loadStreak() {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setStreak({
        currentStreak: snap.data().streak ?? 0
      });
    }
  }

  loadStreak();
}, [user]);

useEffect(() => {
  if (!user) return;

  async function loadUsername() {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setUsername(snap.data().username || "");
      setNewUsername(snap.data().username || "");
    }
  }

  loadUsername();
}, [user]);



useEffect(() => {
  if (screen !== "home") return;
  if (!user) return;

  async function refreshStreak() {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setStreak({
        currentStreak: snap.data().streak ?? 0
      });
    }
  }

  refreshStreak();
}, [screen, user]);


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
  if (!user) return;

  async function loadProfileImage() {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists() && snap.data().photoURL) {
      setProfileImage(snap.data().photoURL);
    }
  }

  loadProfileImage();
}, [user]);





  async function handleImageChange(e) {
  const file = e.target.files[0];

  // 🔒 ADD THIS BLOCK HERE
  if (!file || !user) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file (jpg, png, etc.)");
    return;
  }
  // 🔒 END BLOCK

  try {
    const imageUrl = await uploadToCloudinary(file);

    await updateDoc(doc(db, "users", user.uid), {
      photoURL: imageUrl
    });

    setProfileImage(imageUrl);
  } catch (err) {
    alert("Image upload failed");
    console.error(err);
  }
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
      (user.email || "U").charAt(0).toUpperCase()
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
                (user?.email || "U").charAt(0).toUpperCase()
              )}
            </div>

            <div className="profile-username">
  {username}
</div>


            {user.role === "admin" && (
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

    {/* =====================
       NORMAL SETTINGS VIEW
       ===================== */}
    {!showCredSettings && (
      <>
        {/* PROFILE IMAGE */}
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

        {/* DARK MODE */}
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

        {/* OPEN CREDENTIALS */}
        <button
          className="profile-action"
          onClick={() => setShowCredSettings(true)}
        >
          🔐 Change Username / Password
        </button>

        {/* BACK TO PROFILE */}
        <button
          className="profile-action"
          onClick={() => setShowSettings(false)}
        >
          ← Back
        </button>
        <button className="profile-action logout" onClick={logout}>
              🚪 Logout
            </button>
      </>
    )}

    {/* =====================
       CREDENTIALS VIEW
       ===================== */}
    {showCredSettings && (
      <div className="credential-settings">

        {/* USERNAME */}
        <div className="username-setting">
          <div className="username-setting-label">
            Username
          </div>

          <input
            className="username-setting-input"
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="New username"
          />

          <button
            className="username-setting-btn"
            disabled={
              updatingUsername ||
              newUsername.trim() === username
            }
            onClick={async () => {
              try {
                setUpdatingUsername(true);

                await updateDoc(doc(db, "users", user.uid), {
                  username: newUsername.trim(),
                });

                setUsername(newUsername.trim());
                setUsernameSuccess(true);
                setTimeout(() => setUsernameSuccess(false), 1200);
              } finally {
                setUpdatingUsername(false);
              }
            }}
          >
            {updatingUsername ? "Updating..." : "Update Username"}
          </button>

          {usernameSuccess && (
            <div className="username-success">
              ✔ Username updated
            </div>
          )}
        </div>

        {/* PASSWORD */}
        <div className="password-setting">
          <div className="password-setting-label">
            Change Password
          </div>

          <input
            className="password-setting-input"
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            className="password-setting-input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            className="password-setting-btn"
            disabled={
              updatingPassword ||
              !currentPassword ||
              !newPassword
            }
            onClick={async () => {
              try {
                setUpdatingPassword(true);

                const credential =
                  EmailAuthProvider.credential(
                    user.email,
                    currentPassword
                  );

                await reauthenticateWithCredential(
                  user,
                  credential
                );
                await updatePassword(user, newPassword);

                setPasswordSuccess(true);
                setCurrentPassword("");
                setNewPassword("");
                setTimeout(() => setPasswordSuccess(false), 1500);
              } catch (err) {
                alert(err.message);
              } finally {
                setUpdatingPassword(false);
              }
            }}
          >
            {updatingPassword ? "Updating..." : "Update Password"}
          </button>

          {passwordSuccess && (
            <div className="password-success">
              ✔ Password updated
            </div>
          )}
        </div>

        {/* BACK TO SETTINGS */}
        <button
          className="profile-action"
          onClick={() => setShowCredSettings(false)}
        >
          ← Back
        </button>
      </div>
    )}
  </div>
)}
            
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

