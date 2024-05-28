import React, { useState } from "react";
import { useAuth } from "../context/authContext";

function FormularioInit() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    auth.login(email, password);
  };
  const handleGoogle = (e) => {
    e.preventDefault();
    auth.loginWithGoogle();
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
          <h2>Login</h2>
          <div className="inputs">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              id="femail"
              placeholder="Email"
              required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="inputs">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="fpassword"
              placeholder="Password"
              required
            />
            <i className="bx bxs-lock"></i>
          </div>
          <div className="opciones">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
          <button
            onClick={(e) => handleLogin(e)}
            type="submit"
            className="btn-form"
          >
            Login
          </button>
          <div className="opciones">
            <p>
              Don't have an account? <a href="#">Register</a>
            </p>
          </div>
          <button onClick={(e) => handleGoogle(e)} className="btn-form">
            Google Login
          </button>
        </form>
      </div>
    </>
  );
}

export default FormularioInit;
