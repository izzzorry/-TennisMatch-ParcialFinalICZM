import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase/config'; 
import { useAuth } from '../context/AuthContext'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import "./componentes.css";

const Indux = ({ user, tournaments, showModal, closeModal, modalData, isModalOpen }) => {
  const { logout } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedTournament, setEditedTournament] = useState({
    tournament_name: '',
    category: '',
    description: '',
    location: '',
    poster: ''
  });
  const [newPoster, setNewPoster] = useState(null);

  useEffect(() => {
    setEditedTournament(modalData);
  }, [modalData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const tournamentRef = doc(db, 'torneos', modalData.id);

    if (newPoster) {
      const posterRef = ref(storage, `posters/${newPoster.name}`);
      await uploadBytes(posterRef, newPoster);
      const posterURL = await getDownloadURL(posterRef);
      editedTournament.poster = posterURL;
    }

    await updateDoc(tournamentRef, editedTournament);

    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Tournament details have been updated successfully.',
    });

    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTournament({ ...editedTournament, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewPoster(e.target.files[0]);
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
              {isEditing ? (
                <form>
                  <h2>Edit Tournament</h2>
                  <input 
                    type="text" 
                    name="tournament_name" 
                    value={editedTournament.tournament_name} 
                    onChange={handleInputChange} 
                    placeholder="Tournament Name" 
                  />
                  <input 
                    type="text" 
                    name="category" 
                    value={editedTournament.category} 
                    onChange={handleInputChange} 
                    placeholder="Category" 
                  />
                  <textarea 
                    name="description" 
                    value={editedTournament.description} 
                    onChange={handleInputChange} 
                    placeholder="Description"
                  ></textarea>
                  <input 
                    type="text" 
                    name="location" 
                    value={editedTournament.location} 
                    onChange={handleInputChange} 
                    placeholder="Location" 
                  />
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                  />
                  <button type="button" onClick={handleSave}>Save</button>
                </form>
              ) : (
                <>
                  <h2>{modalData.tournament_name}</h2>
                  <img src={modalData.poster} alt={modalData.tournament_name} />
                  <p><strong>Category:</strong> {modalData.category}</p>
                  <p><strong>Description:</strong> {modalData.description}</p>
                  <p><strong>Location:</strong> {modalData.location}</p>
                  <button onClick={handleEdit}>Edit</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <footer></footer>
    </>
  );
};

export default Indux;

