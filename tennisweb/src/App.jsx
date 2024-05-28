import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext'; 
import Contenido from './components/Contenido';
import FormularioInit from './components/FormuIni';
import FormuRegistro from './components/FormuReg';
import { db } from './firebase/config';
import { doc, getDoc } from "firebase/firestore";

const AppRoutes = () => {
  const { user } = useContext(AuthContext); 
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async (id) => {
      const userDoc = await getDoc(doc(db, "users", id));
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      }
      setLoading(false); // Termina la carga después de obtener el rol
    };

    if (user) {
      getUserRole(user.uid); 
    } else {
      setLoading(false); 
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Routes>
      <Route path="/" element={<Contenido user={user} role={role} />} />
      <Route path="/register" element={<FormuRegistro />} />
      <Route path="/login" element={<FormularioInit />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;


