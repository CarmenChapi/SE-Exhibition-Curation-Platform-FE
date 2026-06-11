import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";


const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [photoFailed, setPhotoFailed] = useState(false);

      useEffect(() => {
        setPhotoFailed(false);
      }, [user?.photoURL]);
    
      const handleLogout = async () => {
        try {
          await logout();
          navigate("/");
        } catch (error) {
          console.error("Error signing out:", error.message);
        }
      };

    const displayName =
      user?.displayName?.trim() || user?.email?.split("@")[0] || "User";
    const firstName = displayName.split(" ")[0];
    const userInitial = firstName.charAt(0).toUpperCase();
    const showPhoto = Boolean(user?.photoURL) && !photoFailed;
  
return(
    <div className="userProfile">
    {showPhoto ? (
      <img
        src={user.photoURL}
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
