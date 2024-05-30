import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDocs, collection, updateDoc, doc, getDoc } from 'firebase/firestore'; // Importa getDoc aquí
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import SearchBar from './SearchBar';
import DropdownMenu from './DropdownMenu';
import DropdownTournaments from './DropdownTournaments';
import "./componentes.css";

const ContenidoClient = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isTournamentsDropdownVisible, setTournamentsDropdownVisible] = useState(false);

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

  const getRandomTournament = (category) => {
    const categoryTournaments = tournaments.filter(tournament => tournament.category === category);
    if (categoryTournaments.length > 0) {
      return categoryTournaments[Math.floor(Math.random() * categoryTournaments.length)];
    }
    return null;
  };

  const renderCategory = (category) => {
    const tournament = getRandomTournament(category);
    if (tournament) {
      return (
        <div className="card" key={tournament.id}>
          <img src={tournament.poster} alt={category} />
          <h3>{category}</h3>
        </div>
      );
    }
    return (
      <div className="card" key={category}>
        <p>No tournaments available for {category}</p>
      </div>
    );
  };

  const showModal = (tournament) => {
    setModalData(tournament);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoriesClick = () => {
    setDropdownVisible(!isDropdownVisible);
    setTournamentsDropdownVisible(false);
  };

  const handleTournamentsClick = () => {
    setTournamentsDropdownVisible(!isTournamentsDropdownVisible);
    setDropdownVisible(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      Swal.fire({
        icon: 'success',
        title: 'Logged out',
        text: 'You have successfully logged out!',
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: error.message,
      });
    }
  };

  const handleRegisterToTournament = async (tournamentId) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'You need to log in to register for a tournament.',
      });
      return;
    }

    const tournamentDoc = doc(db, "torneos", tournamentId);
    try {
      const tournamentSnapshot = await getDoc(tournamentDoc);
      const tournamentData = tournamentSnapshot.data();
      const updatedParticipants = tournamentData.participants ? [...tournamentData.participants, user.displayName] : [user.displayName];

      await updateDoc(tournamentDoc, {
        participants: updatedParticipants
      });
      Swal.fire({
        icon: 'success',
        title: 'Registered',
        text: 'You have successfully registered for the tournament!',
      });
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
        <div className="logo-container">
          <Link to="/">
            <img src="tennisweb/public/tennis-svgrepo-com.svg" alt="TennisLogo" className="logo" />
            <div className="title">
              <h1>Tenis Web</h1>
              <p>Liga's website</p>
            </div>
          </Link>
        </div>
        <nav className="navigation">
          <div className="categories-link-wrapper">
            <div className="categories-link" onClick={handleCategoriesClick}>Categories</div>
            {isDropdownVisible && (
              <DropdownMenu onMouseEnter={handleCategoriesClick} onMouseLeave={handleCategoriesClick} />
            )}
          </div>
          <div className="tournaments-link-wrapper">
            <div className="tournaments-link" onClick={handleTournamentsClick}>Tournaments</div>
            {isTournamentsDropdownVisible && (
              <DropdownTournaments onMouseEnter={handleTournamentsClick} onMouseLeave={handleTournamentsClick} />
            )}
          </div>
        </nav>
        <div className="button-container">
          <button className="btn-init" onClick={handleLogout}>Logout</button>
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

      <section className="categorias" id="categorias">
        <h1>Categories</h1>
        <div className="categories-container">
          {renderCategory('Children')}
          {renderCategory('Youth')}
          {renderCategory('Adults')}
        </div>
      </section>
      <section className="torneos" id="torneos">
        <h1>Tournaments</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div id="tournament-container">
          {filteredTournaments.map((tournament) => (
            <div className="card" key={tournament.id}>
              <img src={tournament.poster} alt={tournament.tournament_name} />
              <h3>{tournament.tournament_name}</h3>
              <button onClick={() => showModal(tournament)}>See more</button>
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
              <button onClick={() => handleRegisterToTournament(modalData.id)}>Register</button>
            </div>
          </div>
        )}
      </section>
      <footer></footer>
    </>
  );
};

export default ContenidoClient;
