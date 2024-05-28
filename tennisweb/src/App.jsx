import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Contenido from './components/Contenido';
import FormularioInit from './components/FormuIni';
import FormuRegistro from './components/FormuReg';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Contenido />} />
          <Route path="/register" element={<FormuRegistro />} />
          <Route path="/login" element={<FormularioInit />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
