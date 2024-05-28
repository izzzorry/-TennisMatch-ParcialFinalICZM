import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config'; // Asegúrate de importar correctamente la configuración de Firebase
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
import Swal from 'sweetalert2';
import "./componentes.css";

const Index = () => {
  const { user, logout } = useAuth(); // Obtener el usuario del contexto de autenticación
  const [tournaments, setTournaments] = useState([]);
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "torneos"));
      const tournamentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTournaments(tournamentList);
    };
    fetchData();
  }, []);

  const showModal = (tournament) => {
    setModalData(tournament);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEnroll = async () => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'You need to be logged in to enroll in a tournament.',
      });
      return;
    }

    const tournamentRef = doc(db, 'torneos', modalData.id);
    await updateDoc(tournamentRef, {
      participants: arrayUnion(user.displayName)
    });

    Swal.fire({
      icon: 'success',
      title: 'Enrolled',
      text: 'You have been successfully enrolled in the tournament.',
    });

    closeModal();
  };

  return (
    <>
      <header className="header">
        <Link to="/index">
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
          <button className="btn-init" onClick={logout}>Logout</button>
        </div>
      </header>
      <div className="hero">
        <video
          preload="metadata"
          src="https://admin.dsr-trnje.hr/wp-content/uploads/2023/07/Trnje-Video-Ljeto-DESKTOP.mp4"
          autoPlay
          muted
          loop
          className="hero-video"
        ></video>
      </div>
      <div className="categorias" id="categorias"></div>
      <div className="torneos" id="torneos">
        <h1>Tournaments</h1>
        <div id="tournament-container">
          {tournaments.map((tournament) => (
            <div className="card" key={tournament.id}>
              <img src={tournament.poster} alt={tournament.tournament_name} />
              <h3>{tournament.tournament_name}</h3>
              <button onClick={() => showModal(tournament)}>Ver más</button>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div id="tournament-modal" className="modal">
            <div id="modal-content" className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{modalData.tournament_name}</h2>
              <img src={modalData.poster} alt={modalData.tournament_name} />
              <p><strong>Category:</strong> {modalData.category}</p>
              <p><strong>Description:</strong> {modalData.description}</p>
              <p><strong>Location:</strong> {modalData.location}</p>
              <button onClick={handleEnroll}>Inscribirse</button> {/* Botón de inscripción */}
            </div>
          </div>
        )}
      </div>
      <footer></footer>
    </>
  );
};

export default Index;