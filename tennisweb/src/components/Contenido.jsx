import React from 'react';
import { Link } from 'react-router-dom';
import "./componentes.css"

const Contenido = () => {
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
      <div className="hero">
        <video
          preload="metadata"
          src="https://admin.dsr-trnje.hr/wp-content/uploads/2023/07/Trnje-Video-Ljeto-DESKTOP.mp4"
          autoplay="autoplay"
          muted="muted"
          loop="loop"
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
          data-v-1e51cfeb=""
        ></video>
      </div>
      <div className="categorias">


      </div>
      <div className="torneos">

      </div>

      <footer>

      </footer>
    </>
  );
}

export default Contenido;
