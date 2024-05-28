import React, { useState } from "react";
import { useAuth } from "../context/authContext";

function FormuRegistro() {
  const auth = useAuth();

  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    auth.registrar(emailRegister, passwordRegister);
  };

  return (
    <>
    <header className="header">
        <div className="logo-container">
          <img src="src/assets/tennis-svgrepo-com.svg" alt="DSR TRNJE Logo" className="logo" />
          <div className="title">
            <h1>Tenis Web</h1>
            <p>Liga's website</p>
          </div>
        </div>
        <nav className="navigation">
          <a href="#categorias">Categories</a>
          <a href="#torneos">Tournaments</a>
        </nav>
        <div className="button-container">
          <Link to="/login">
            <button className="btn-init">Iniciar sesión</button>
          </Link>
          <Link to="/register">
            <button className="btn-reg">Registro</button>
          </Link>
        </div>
      </header>
      
      <div className="contenedor">
        <form>
          <h2>Register</h2>
          <div className="inputs">
            <input
              onChange={(e) => setEmailRegister(e.target.value)}
              type="text"
              id="femail"
              placeholder="Email"
              required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="inputs">
            <input
              onChange={(e) => setPasswordRegister(e.target.value)}
              type="password"
              id="fpassword"
              placeholder="Password"
              required
            />
            <i className="bx bxs-lock"></i>
          </div>
          <button
            onClick={(e) => handleRegister(e)}
            type="submit"
            className="btn-form"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default FormuRegistro;
