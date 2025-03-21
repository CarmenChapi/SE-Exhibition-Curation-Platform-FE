import { useContext, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebase.js";
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
        navigate("/home", { replace: true });
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
    <section className="SignIn">
      <h1 className="Header">Exhibition Curation Platform</h1>
      <p className="subtitle">Sign in to explore & curate artworks</p>
      <div className="signin-wrapper">
        <div className="signin-card">
          {userCx ? (
            <>
              <h2>Welcome, {userCx.displayName}!</h2>
              <img src={userCx.photoURL} alt="Profile" width="100" />
              <p>Email: {userCx.email}</p>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="signin-btn" onClick={handleLogin}>
              <img src="data:image/png;base64,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" alt="" className="btn-icon" />
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default GoogleLogin;
