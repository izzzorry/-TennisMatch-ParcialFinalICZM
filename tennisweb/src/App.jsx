// src/App.jsx
import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext'; // Asegúrate de que la ruta sea correcta
import Contenido from './components/Contenido';
import FormularioInit from './components/FormuIni';
import FormuRegistro from './components/FormuReg';
import Index from './components/contenidolog';
import { db } from './firebase/config';
import { doc, getDoc } from "firebase/firestore";

const AppRoutes = () => {
  const { user } = useContext(AuthContext); // Obteniendo el usuario del contexto de autenticación
  const [role, setRole] = useState(null);

  useEffect(() => {
    const getUserRole = async (id) => {
      const userDoc = await getDoc(doc(db, "users", id));
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      }
    };

    if (user) {
      getUserRole(user.uid); // Obtén el rol del usuario autenticado
    }
  }, [user]);

  return (
    <Routes>
      {role === 'Administrator' && <Route path="/indexadmin" element={<Index />} />}
      {role === 'Client' && <Route path="/index" element={<Index />} />}
      <Route path="/" element={<Contenido />} />
      <Route path="/register" element={<FormuRegistro />} />
      <Route path="/login" element={<FormularioInit />} />
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


