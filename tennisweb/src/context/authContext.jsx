import { auth, db } from "../firebase/config";
import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

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
      if (!currentUser) {
        console.log("No user subscribed");
        setUser(null);
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const registrar = async (email, password, role) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", response.user.uid), {
        email: email,
        role: role,
      });
      console.log("User registered and saved in Firestore:", response.user);
    } catch (error) {
      console.error("Error during registration:", error);
      throw error; // Propaga el error para que el formulario pueda manejarlo
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", response.user);
    } catch (error) {
      console.error("Error during login:", error);
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
      console.log("User logged in with Google and saved in Firestore:", response.user);
    } catch (error) {
      console.error("Error during Google login:", error);
      throw error; // Propaga el error para que el formulario pueda manejarlo
    }
  };

  const logout = async () => {
    try {
      const response = await signOut(auth);
      console.log("User logged out:", response);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error; // Propaga el error para que el formulario pueda manejarlo
    }
  };

  return (
    <authContext.Provider value={{ registrar, login, loginWithGoogle, logout, user }}>
      {children}
    </authContext.Provider>
  );
}
