import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("Error creating auth context");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
        title: 'Registration Successful',
        text: 'Your account has been created successfully!',
      });
      return { user: response.user, role };
    } catch (error) {
      console.error("Error during registration:", error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: error.message,
      });
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", response.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : null;
      Swal.fire({
        icon: 'success',
        title: 'Logged In',
        text: 'User has been logged in successfully',
      });
      return { user: response.user, role };
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: error.message,
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, googleProvider);
      const userDoc = doc(db, "users", response.user.uid);
      await setDoc(userDoc, {
        email: response.user.email,
        role: "client",
      }, { merge: true });
      Swal.fire({
        icon: 'success',
        title: 'Google Login',
        text: 'User has been logged in with Google successfully',
      });
      return { user: response.user, role: "client" };
    } catch (error) {
      console.error("Error during Google login:", error);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Error',
        text: error.message,
      });
      throw error;
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
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ registrar, login, loginWithGoogle, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
