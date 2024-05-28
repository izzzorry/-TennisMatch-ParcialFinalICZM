import React from 'react';
import { Link } from 'react-router-dom';
import "./componentes.css";

const Index = () => {
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
            <button className="btn-init">Logout</button>
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
      <div className="categorias"></div>
      <div className="torneos"></div>
      <footer></footer>
    </>
  );
};

export default Index;