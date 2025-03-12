import { useContext, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const { userCx, setUserCx } = useContext(UserContext); // ✅ Correctly using Context
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserCx({
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      } else {
        setUserCx(null); // Clear user on logout
      }
    });

    return () => unsubscribe();
  }, [setUserCx]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      navigate("/home");
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
      {userCx ? (
        <>
          <h2>Welcome, {userCx.displayName}!</h2>
          <img src={userCx.photoURL} alt="Profile" width="100" />
          <p>Email: {userCx.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
};

export default GoogleLogin;
