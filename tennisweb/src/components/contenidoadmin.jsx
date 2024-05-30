import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { getDocs, collection, addDoc, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import SearchBar from './SearchBar';
import DropdownMenu from './DropdownMenu';
import DropdownTournaments from './DropdownTournaments';
import "./componentes.css";

const ContenidoAdmin = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate(); // Inicializa useNavigate
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isTournamentsDropdownVisible, setTournamentsDropdownVisible] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([]);

  const [tournamentName, setTournamentName] = useState("");
  const [category, setCategory] = useState("Youth");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [poster, setPoster] = useState(null);
  const [posterURL, setPosterURL] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "torneos"));
    const tournamentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTournaments(tournamentList);
  };

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.tournament_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getParticipantsByCategory = (category) => {
    const categoryTournaments = tournaments.filter(tournament => tournament.category === category);
    let participantsList = [];
    categoryTournaments.forEach(tournament => {
      if (tournament.participants) {
        participantsList = [...participantsList, ...tournament.participants];
      }
    });
    setParticipants(participantsList);
    setShowParticipantsModal(true);
  };

  const renderCategory = (category) => (
    <div className="card category-card" key={category} onClick={() => getParticipantsByCategory(category)}>
      <h3>{category}</h3>
    </div>
  );

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
      navigate('/'); // Navega a la página de inicio después de cerrar sesión
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
      await updateDoc(tournamentDoc, {
        participants: [...(modalData.participants || []), user.displayName]
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
    }
  };

  const store = async (e) => {
    e.preventDefault();
    if (poster) {
      const storage = getStorage();
      const storageRef = ref(storage, `posters/${poster.name}`);
      await uploadBytes(storageRef, poster);
      const downloadURL = await getDownloadURL(storageRef);
      setPosterURL(downloadURL);

      await addDoc(collection(db, "torneos"), {
        tournament_name: tournamentName,
        category: category,
        description: description,
        location: location,
        poster: downloadURL
      });
      setShowCreateModal(false);
      fetchData(); // Fetch updated data after adding
      Swal.fire({
        icon: 'success',
        title: 'Tournament Added',
        text: 'The tournament has been added successfully!',
      });
    } else {
      alert("Please select an image.");
    }
  };

  const update = async (e) => {
    e.preventDefault();
    const tournamentDoc = doc(db, "torneos", modalData.id);

    let finalPosterURL = posterURL;
    if (poster) {
      const storage = getStorage();
      const storageRef = ref(storage, `posters/${poster.name}`);
      await uploadBytes(storageRef, poster);
      finalPosterURL = await getDownloadURL(storageRef);
    }

    await updateDoc(tournamentDoc, {
      tournament_name: tournamentName,
      category: category,
      description: description,
      location: location,
      poster: finalPosterURL
    });

    setShowEditModal(false);
    fetchData(); // Fetch updated data after editing
    Swal.fire({
      icon: 'success',
      title: 'Tournament Updated',
      text: 'The tournament has been updated successfully!',
    });
  };

  const getTournamentById = async (id) => {
    const tournamentDoc = await getDoc(doc(db, "torneos", id));
    if (tournamentDoc.exists()) {
      const data = tournamentDoc.data();
      setTournamentName(data.tournament_name);
      setCategory(data.category);
      setDescription(data.description);
      setLocation(data.location);
      setPosterURL(data.poster);
    } else {
      console.log("No such document!");
    }
  };

  const handleDeleteTournament = async (id, posterURL) => {
    try {
      await deleteDoc(doc(db, "torneos", id));
      const storage = getStorage();
      const storageRef = ref(storage, posterURL);
      await deleteObject(storageRef);
      fetchData(); // Fetch updated data after deleting
      Swal.fire({
        icon: 'success',
        title: 'Tournament Deleted',
        text: 'The tournament has been deleted successfully!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Error',
        text: error.message,
      });
    }
  };

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
          <div className="card" key="new-tournament">
            <button onClick={() => setShowCreateModal(true)}>Add</button>
          </div>
          {filteredTournaments.map((tournament) => (
            <div className="card" key={tournament.id}>
              <img src={tournament.poster} alt={tournament.tournament_name} />
              <h3>{tournament.tournament_name}</h3>
              <div className="tournament-buttons">
                <button onClick={() => showModal(tournament)}>See more</button>
                <button onClick={() => handleDeleteTournament(tournament.id, tournament.poster)}>Delete</button>
              </div>
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
              <button onClick={() => {
                setShowEditModal(true);
                getTournamentById(modalData.id);
              }}>Edit</button>
            </div>
          </div>
        )}
        {showCreateModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowCreateModal(false)}>&times;</span>
              <h1>Agregar Torneo</h1>
              <form onSubmit={store}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Torneo</label>
                  <input
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="Children">Children</option>
                    <option value="Youth">Youth</option>
                    <option value="Adults">Adults</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Ubicación</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Poster</label>
                  <input
                    onChange={handleFileChange}
                    type="file"
                    className="form-control"
                    accept="image/*"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </form>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
              <h1>Edit</h1>
              <form onSubmit={update}>
                <div className="mb-3">
                  <label className="form-label">Tournament Name</label>
                  <input
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="Children">Children</option>
                    <option value="Youth">Youth</option>
                    <option value="Adults">Adults</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Poster</label>
                  <input
                    onChange={handleFileChange}
                    type="file"
                    className="form-control"
                    accept="image/*"
                  />
                  {posterURL && (
                    <div>
                      <img src={posterURL} alt="Poster" style={{ width: '100px', marginTop: '10px' }} />
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
        {showParticipantsModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowParticipantsModal(false)}>&times;</span>
              <h1>Participants</h1>
              {participants.length > 0 ? (
                <ul>
                  {participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                  ))}
                </ul>
              ) : (
                <p>No participants found for this category.</p>
              )}
            </div>
          </div>
        )}
      </section>
      <footer></footer>
    </>
  );
};

export default ContenidoAdmin;
