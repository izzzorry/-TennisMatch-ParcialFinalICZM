import { auth, db } from "../firebase/config";
import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Swal from 'sweetalert2';

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    console.log("error creating auth context");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });
    return () => unsubscribe();
  }, []);

  const registrar = async (email, password, name, role) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", response.user.uid), {
        email,
        name,
        role,
      });
      Swal.fire({
        icon: 'success',
        title: 'User Registered',
        text: 'User has been registered successfully',
      });
    } catch (error) {
      console.error("Error during registration:", error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: error.message,
      });
      throw error; // Propaga el error para que el formulario pueda manejarlo
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: 'success',
        title: 'Logged In',
        text: 'User has been logged in successfully',
      });
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: error.message,
      });
      throw error; // Propaga el error para que el formulario pueda manejarlo
    }
  };

  const loginWithGoogle = async () => {
    try {
      const responseGoogle = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, responseGoogle);
      const userDoc = doc(db, "users", response.user.uid);
      await setDoc(userDoc, {
        email: response.user.email,
        role: "user",
      }, { merge: true });
      Swal.fire({
        icon: 'success',
        title: 'Google Login',
        text: 'User has been logged in with Google successfully',
      });
    } catch (error) {
      console.error("Error during Google login:", error);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Error',
        text: error.message,
      });
      throw error; // Propaga el error para que el formulario pueda manejarlo
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'User has been logged out successfully',
      });
    } catch (error) {
      console.error("Error during logout:", error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: error.message,
      });
      throw error; // Propaga el error para que el formulario pueda manejarlo
    }
  };

  return (
    <authContext.Provider value={{ registrar, login, loginWithGoogle, logout, user }}>
      {children}
    </authContext.Provider>
  );
}
