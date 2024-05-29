import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config'; 
import { useAuth } from '../context/authContext';
import Index from './contenidolog';
import Indux from './contenidoadmin';
import SearchBar from './SearchBar';
import DropdownMenu from './DropdownMenu';
import DropdownTournaments from './DropdownTournaments'; // Importa el nuevo componente
import "./componentes.css";

const Contenido = ({ user, role }) => {
  const { logout } = useAuth(); 
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isTournamentsDropdownVisible, setTournamentsDropdownVisible] = useState(false); // Nuevo estado para el menú de torneos

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "torneos"));
      const tournamentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTournaments(tournamentList);
    };
    fetchData();
  }, []);

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.tournament_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showModal = (tournament) => {
    setModalData(tournament);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const handleTournamentsMouseEnter = () => {
    setTournamentsDropdownVisible(true);
  };

  const handleTournamentsMouseLeave = () => {
    setTournamentsDropdownVisible(false);
  };

  if (user) {
    if (role === 'Administrator') {
      return <Indux user={user} tournaments={filteredTournaments} showModal={showModal} closeModal={closeModal} modalData={modalData} isModalOpen={isModalOpen} />;
    }
    if (role === 'Client') {
      return <Index user={user} tournaments={filteredTournaments} showModal={showModal} closeModal={closeModal} modalData={modalData} isModalOpen={isModalOpen} />;
    }
  }

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <Link to="/">
            <img src="src/assets/tennis-svgrepo-com.svg" alt="DSR TRNJE Logo" className="logo" />
            <div className="title">
              <h1>Tenis Web</h1>
              <p>Liga's website</p>
            </div>
          </Link>
        </div>
        <nav className="navigation">
          <Link to="#categorias" className="categories-link" onMouseEnter={handleMouseEnter}>Categories</Link>
          <Link to="#torneos" className="tournaments-link" onMouseEnter={handleTournamentsMouseEnter}>Tournaments</Link>
        </nav>
        <div className="button-container">
          <Link to="/login">
            <button className="btn-init">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-reg">Register</button>
          </Link>
        </div>
        {isDropdownVisible && (
          <DropdownMenu onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
        )}
        {isTournamentsDropdownVisible && (
          <DropdownTournaments onMouseEnter={handleTournamentsMouseEnter} onMouseLeave={handleTournamentsMouseLeave} />
        )}
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
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="categorias" id="categorias"></div>
      <div className="torneos" id="torneos">
        <h1>Tournaments</h1>
        <div id="tournament-container">
          {filteredTournaments.map((tournament) => (
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
            </div>
          </div>
        )}
      </div>
      <footer></footer>
    </>
  );
};

export default Contenido;
