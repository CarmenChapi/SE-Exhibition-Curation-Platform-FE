import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signOut } from "../firebase";
import ListCollections from "./ListCollections";
import ListApiArtGalleries from "./ListApiArts";

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
      <div>
        <h2> {userCx?.displayName}!</h2>
        {/* <img src={userCx?.photoURL} alt="Profile" width="50" />
      <p>Email: {userCx?.email}</p> */}
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        {/* <ListCollections /> */}
        <ListApiArtGalleries/>
      </div>
    </>
  );
};

export default Home;
