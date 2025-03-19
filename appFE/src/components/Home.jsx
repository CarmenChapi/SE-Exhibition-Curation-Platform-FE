import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signOut } from "../firebase";
import MenuCollections from "./MenuCollections";
import IntroRandom from "./IntroRandom";
import Header from "./Header";

const Home = () => {
  const { userCx, setUserCx } = useContext(UserContext);
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
        setUserCx(null);
      }
    });

    return () => unsubscribe();
  }, [setUserCx]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <>
        <Header />
        <div className="userProfile">
          <img src={userCx?.photoURL} alt="Profile" className="userPhoto" />
          <p> Welcome, {userCx?.displayName.split(" ")[0]}!</p>
          <button
            onClick={handleLogout}
            className="btn-back"
          >
            Logout
          </button>
        </div>
      <nav>
      <MenuCollections />
      </nav>
      <main>
      <IntroRandom />
      </main>
    </>
  );
};

export default Home;
