import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { getSessionStreakStatus } from "../utils/streak";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";






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
// 🔁 Load username from Firestore (single source of truth)
useEffect(() => {
  if (!user) return;

  let alive = true;

  const loadUsername = async () => {
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && alive) {
        const name = snap.data().username || "";
        setUsername(name);
        setNewUsername(name);
      }
    } catch (err) {
      console.error("Failed to load username", err);
    }
  };

  loadUsername();

  return () => {
    alive = false;
  };
}, [user]);

const [updatingUsername, setUpdatingUsername] = useState(false);
const [showSearch, setShowSearch] = useState(false);
const [searchQuery, setSearchQuery] = useState("");


  console.log("USER ROLE:", user?.role);

  const [streak, setStreak] = useState({
  streak: 0,
  status: "inactive",
  message: ""
});



useEffect(() => {
  if (!user || screen !== "home") return;

  let alive = true;

  const syncStreak = async () => {
    const data = await getSessionStreakStatus(user.uid);
    if (alive) setStreak(data);
  };

  // 1️⃣ Initial load
  syncStreak();

  // 2️⃣ When MCQ updates streak
  window.addEventListener("streak-updated", syncStreak);

  // 3️⃣ When tab regains focus (next day / background)
  window.addEventListener("focus", syncStreak);

  return () => {
    alive = false;
    window.removeEventListener("streak-updated", syncStreak);
    window.removeEventListener("focus", syncStreak);
  };
}, [user, screen]);







  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  // 🖼️ Image crop states
const [cropSrc, setCropSrc] = useState(null);
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
const [showCrop, setShowCrop] = useState(false);


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
  if (!file || !user) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    setCropSrc(reader.result);   // base64 image
    setShowCrop(true);          // open crop modal
  };
  reader.readAsDataURL(file);
}





  return (
    <div className="page">
      {/* AVATAR */}
      {/* 🧊 GLASS TOP BAR */}
<div className="top-glass-bar">
  <div className="top-title-wrap">
  {!showSearch ? (
    <div
      className="top-title"
      onClick={() => setShowSearch(true)}
    >
      CPA PRACTICE
    </div>
  ) : (
    <input
      className="top-search"
      autoFocus
      placeholder="Search anything…"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

        if (e.key === "Escape") {
          setShowSearch(false);
          setSearchQuery("");
        }
      }}
      onBlur={() => {
        setShowSearch(false);
        setSearchQuery("");
      }}
    />
  )}
</div>


<div className="streak-wrap">
  <div
    className={`streak-badge ${
      streak.status === "active" ? "active" : "inactive"
    }`}
    onClick={(e) =>
      launchConfetti(streak.status === "active", e)
    }
  >
    {streak.streak === 0 ? "💔 0" : `🔥 ${streak.streak}`}
  </div>

  {streak.message && (
    <div className="streak-message">
      {streak.message}
    </div>
  )}
</div>





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

            <div className="avatar-wrapper">
  {profileImage ? (
    <img src={profileImage} alt="profile" className="avatar-img" />
  ) : (
    <div className="avatar-fallback">
      {(user?.email || "U").charAt(0).toUpperCase()}
    </div>
  )}

  {showSettings && !showCredSettings && (
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
  )}
</div>



            <div className="profile-username">
  {username}
</div>


            


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


      {showCrop && (
  <div className="crop-backdrop">
    <div className="crop-modal">
      <Cropper
        image={cropSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        cropShape="round"
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, pixels) =>
          setCroppedAreaPixels(pixels)
        }
      />

      <div className="crop-controls">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
        />

        <button
          onClick={async () => {
            try {
              const croppedFile = await getCroppedImg(
                cropSrc,
                croppedAreaPixels
              );

              const imageUrl =
                await uploadToCloudinary(croppedFile);

              await updateDoc(
                doc(db, "users", user.uid),
                { photoURL: imageUrl }
              );

              setProfileImage(imageUrl);
              setShowCrop(false);
            } catch (err) {
              console.error(err);
              alert("Image crop failed");
            }
          }}
        >
          Save
        </button>

        <button onClick={() => setShowCrop(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}






    </div>
  );
}

