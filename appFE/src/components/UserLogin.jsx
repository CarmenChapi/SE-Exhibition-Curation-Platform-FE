import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleLogin from "./GoogleLogin.jsx";
import { useAuth } from "../hooks/useAuth.js";

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginWithEmail, registerWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(location.state?.from?.pathname || "/home", { replace: true });
    }
  }, [location.state, navigate, user]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("This email is already registered.");
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrorMessage("Incorrect email or password.");
          break;
        case "auth/weak-password":
          setErrorMessage("The password must be at least 6 characters.");
          break;
        default:
          setErrorMessage("An error has occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="SignIn">
      <div className="login-heading">
        <span className="login-eyebrow">Your private digital gallery</span>
        <h1 className="Header">Exhibition Curation Platform</h1>
      </div>
      <div className="signin-wrapper">
        <div className="signin-card user-login-card">
          <form onSubmit={handleEmailAuth} className="email-form">
            <h2>{isRegistering ? "Create new account" : "Welcome back"}</h2>
            <p className="login-form-intro">
              {isRegistering
                ? "Start building your personal art collection."
                : "Continue discovering extraordinary artworks."}
            </p>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <input
              type="email"
              placeholder="Your email"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Your password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="email-auth-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isRegistering
                  ? "Creating account..."
                  : "Signing in..."
                : isRegistering
                  ? "Register"
                  : "Sign in with email"}
            </button>
          </form>

          <button
            type="button"
            className="toggle-auth"
            disabled={isSubmitting}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up here"}
          </button>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <GoogleLogin />
        </div>
      </div>
    </section>
  );
};

export default UserLogin;
