import { useState } from "react";
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "../firebase.js";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "./GoogleLogin.jsx";

const UserLogin = () => {
  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Alternar entre Login y Registro
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // (Tu useEffect con onAuthStateChanged se queda exactamente igual)

  // --- FUNCIÓN: LOGIN O REGISTRO CON EMAIL ---
  const handleEmailAuth = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        // 1. FLUJO DE REGISTRO
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("¡Usuario registrado con éxito!");
      } else {
        // 2. FLUJO DE INICIO DE SESIÓN
        await signInWithEmailAndPassword(auth, email, password);
        console.log("¡Sesión iniciada con éxito!");
      }
      navigate("/home");
    } catch (error) {
      // Manejo de errores amigable para el usuario
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("Este correo ya está registrado.");
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrorMessage("Correo o contraseña incorrectos.");
          break;
        case "auth/weak-password":
          setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
          break;
        default:
          setErrorMessage("Ocurrió un error. Inténtalo de nuevo.");
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
          
          {/* --- FORMULARIO DE EMAIL Y CONTRASEÑA --- */}
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
            
            <button type="submit" className="email-auth-btn" disabled={isSubmitting}>
              {isSubmitting
                ? isRegistering
                  ? "Creating account..."
                  : "Signing in..."
                : isRegistering
                  ? "Register"
                  : "Sign in with email"}
            </button>
          </form>

          {/* Botón para alternar entre Login y Registro */}
          <button
            type="button"
            className="toggle-auth"
            disabled={isSubmitting}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Sign up here"}
          </button>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

         <GoogleLogin/>

        </div>
      </div>
    </section>
  );
};

export default UserLogin;
