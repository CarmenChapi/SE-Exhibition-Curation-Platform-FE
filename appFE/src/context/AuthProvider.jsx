import { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Error completing Google redirect:", error);
      setAuthError(error.code || "auth/unknown-error");
    });

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      authLoading,
      authError,
      clearAuthError: () => setAuthError(""),
      loginWithEmail: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),
      registerWithEmail: (email, password) =>
        createUserWithEmailAndPassword(auth, email, password),
      loginWithGoogle: async () => {
        setAuthError("");

        try {
          return await signInWithPopup(auth, provider);
        } catch (error) {
          const shouldUseRedirect = [
            "auth/popup-blocked",
            "auth/cancelled-popup-request",
            "auth/operation-not-supported-in-this-environment",
            "auth/web-storage-unsupported",
          ].includes(error.code);

          if (shouldUseRedirect) {
            await signInWithRedirect(auth, provider);
            return null;
          }

          throw error;
        }
      },
      logout: () => signOut(auth),
    }),
    [authError, authLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
