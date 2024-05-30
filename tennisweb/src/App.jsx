import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Contenido from './components/Contenido';
import ContenidoAdmin from './components/contenidoadmin';
import ContenidoClient from './components/contenidolog';
import { AuthProvider } from './context/Contextualizador';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Contenido />} />
      <Route path="/admin" element={<ContenidoAdmin />} />
      <Route path="/client" element={<ContenidoClient />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

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
