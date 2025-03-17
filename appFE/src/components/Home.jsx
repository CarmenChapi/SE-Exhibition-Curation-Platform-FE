import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signOut } from "../firebase";
import MenuCollections from "./MenuCollections";


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
      <div className="userProfile">

        <img src={userCx?.photoURL} alt="Profile" className="userPhoto" />
        <p> Welcome, {userCx?.displayName.split(" ")[0]}!</p>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>

        </div>
        <MenuCollections/>
     
    </>
  );
};

export default Home;
