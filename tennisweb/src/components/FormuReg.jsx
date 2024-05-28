import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import "./formulario.css";
import Swal from 'sweetalert2';


function FormuRegistro() {
  const auth = useAuth();
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("client");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await auth.registrar(emailRegister, passwordRegister, name, role);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been created successfully!',
      });
      // Clear the inputs
      setEmailRegister("");
      setPasswordRegister("");
      setName("");
      setRole("client");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
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
          <h2>Register</h2>
          <div className="inputs">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}  // Enlazar el valor del estado
              type="text"
              id="fname"
              placeholder="Name"
              required
            />
          </div>
          <div className="inputs">
            <input
              onChange={(e) => setEmailRegister(e.target.value)}
              value={emailRegister}  // Enlazar el valor del estado
              type="text"
              id="femail"
              placeholder="Email"
              required
            />
          </div>
          <div className="inputs">
            <input
              onChange={(e) => setPasswordRegister(e.target.value)}
              value={passwordRegister}  // Enlazar el valor del estado
              type="password"
              id="fpassword"
              placeholder="Password"
              required
            />
          </div>
          <div className="inputs">
            <select
              onChange={(e) => setRole(e.target.value)}
              value={role}  // Enlazar el valor del estado
              required
            >
              <option value="client">Client</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button
            onClick={handleRegister}
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
