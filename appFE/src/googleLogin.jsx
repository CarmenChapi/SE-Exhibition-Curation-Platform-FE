import React, { useEffect, useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const GoogleLogin = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}!</h2>
          <img src={user.photoURL} alt="Profile" width="100" />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
};

export default GoogleLogin;
