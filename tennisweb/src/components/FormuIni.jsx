import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import "./formulario.css";
import Swal from 'sweetalert2';

function FormularioInit() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { role } = await auth.login(email, password);
      if (role === 'Administrator') {
        navigate('/indexadmin');
      } else {
        navigate('/index');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: error.message,
      });
    }
  };

  const handleGoogle = async (e) => {
    e.preventDefault();
    try {
      const { role } = await auth.loginWithGoogle();
      if (role === 'Administrator') {
        navigate('/indexadmin');
      } else {
        navigate('/index');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Error',
        text: error.message,
      });
    }
  };

  return (
    <>
      <header className="header">
        <Link to="/">
          <div className="logo-container">
            <img src="src/assets/tennis-svgrepo-com.svg" alt="DSR TRNJE Logo" className="logo" />
            <div className="title">
              <h1>Tenis Web</h1>
              <p>Liga's website</p>
            </div>
          </div>
        </Link>
        <nav className="navigation">
          <Link to="#categorias">Categories</Link>
          <Link to="#torneos">Tournaments</Link>
        </nav>
        <div className="button-container">
          <Link to="/login">
            <button className="btn-init">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-reg">Register</button>
          </Link>
        </div>
      </header>

      <div className="hero">
        <video
          preload="metadata"
          src="https://admin.dsr-trnje.hr/wp-content/uploads/2023/07/Trnje-Video-Ljeto-DESKTOP.mp4"
          autoPlay="autoplay"
          muted="muted"
          loop="loop"
          className=""
        ></video>
      </div>
      
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
          </div>
          <div className="inputs">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="fpassword"
              placeholder="Password"
              required
            />
          </div>
          <button
            onClick={handleLogin}
            type="submit"
            className="btn-form"
          >
            Login
          </button>
          <div className="opciones">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
          <button onClick={handleGoogle} className="btn-form">
            Google Login
          </button>
        </form>
      </div>
    </>
  );
}

export default FormularioInit;

