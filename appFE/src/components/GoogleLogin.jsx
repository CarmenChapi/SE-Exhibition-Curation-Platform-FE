import { useEffect, useState } from "react";
import GoogleIcon from "../assets/google-icon.png";
import { useAuth } from "../hooks/useAuth";

const GoogleLogin = () => {
  const { authError, clearAuthError, loginWithGoogle } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (authError) {
      setLoginError(`Google sign-in failed (${authError}).`);
    }
  }, [authError]);

  const handleLogin = async () => {
    clearAuthError();
    setLoginError("");
    setIsSigningIn(true);

    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoginError(
        error.code === "auth/popup-closed-by-user"
          ? "The Google sign-in window was closed before finishing."
          : `Google sign-in failed (${error.code || "unknown error"}).`,
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="social-login">
      <button
        type="button"
        aria-label="Sign in with Google"
        className="signin-btn"
        onClick={handleLogin}
        disabled={isSigningIn}
      >
        <img src={GoogleIcon} alt="" className="btn-icon" />
        {isSigningIn ? "Opening Google..." : "Sign in with Google"}
      </button>
      {loginError && <p className="signin-error">{loginError}</p>}
    </div>
  );
};

export default GoogleLogin;
