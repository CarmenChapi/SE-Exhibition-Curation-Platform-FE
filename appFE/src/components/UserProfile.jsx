import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { auth, signOut } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";


const UserProfile = () => {
    const { userCx, setUserCx } = useContext(UserContext);
    const navigate = useNavigate();
    const [photoFailed, setPhotoFailed] = useState(false);

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

      useEffect(() => {
        setPhotoFailed(false);
      }, [userCx?.photoURL]);
    
      const handleLogout = async () => {
        try {
          await signOut(auth);
          console.log("User signed out");
          navigate("/");
        } catch (error) {
          console.error("Error signing out:", error.message);
        }
      };

    const displayName =
      userCx?.displayName?.trim() || userCx?.email?.split("@")[0] || "User";
    const firstName = displayName.split(" ")[0];
    const userInitial = firstName.charAt(0).toUpperCase();
    const showPhoto = Boolean(userCx?.photoURL) && !photoFailed;
  
return(
    <div className="userProfile">
    {showPhoto ? (
      <img
        src={userCx.photoURL}
        alt={`${displayName} profile`}
        className="userPhoto"
        referrerPolicy="no-referrer"
        onError={() => setPhotoFailed(true)}
      />
    ) : (
      <span className="userPhoto userInitial" aria-hidden="true">
        {userInitial}
      </span>
    )}
    <p>{firstName}</p>
    <button
      aria-label="Log out"
      onClick={handleLogout}
      className="btn-back"
    >
      Logout
    </button>
  </div>
)}

export default UserProfile
