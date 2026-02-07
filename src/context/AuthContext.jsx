import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(userRef);

      // ✅ First login → create Firestore user doc
      // 🚫 NO streak logic here (very important)
      if (!snap.exists()) {
        await setDoc(
          userRef,
          {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.email?.split("@")[0] ?? "user",
            role: "user",
            photoURL: null,
            createdAt: serverTimestamp()
          },
          { merge: true } // 🔒 safety: never overwrite existing fields
        );
      }

      const userData = (await getDoc(userRef)).data();

      setUser(firebaseUser);      // Firebase auth user
      setRole(userData?.role);   // App role
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function logout() {
    localStorage.removeItem("cpa_active_mcq");
    await signOut(auth);
    setUser(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
