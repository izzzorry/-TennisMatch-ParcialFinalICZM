import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config'; 
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import SearchBar from './SearchBar';
import DropdownMenu from './DropdownMenu';
import DropdownTournaments from './DropdownTournaments'; 
import "./componentes.css";

const Contenido = () => {
  const { user, login, loginWithGoogle, registrar, logout } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isTournamentsDropdownVisible, setTournamentsDropdownVisible] = useState(false); 
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [role, setRole] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [name, setName] = useState("");
  const [roleRegister, setRoleRegister] = useState("client");

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "torneos"));
      const tournamentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTournaments(tournamentList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };

    fetchUserRole();
  }, [user]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/client');
        }
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
      await loginWithGoogle();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/client');
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Error',
        text: error.message,
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registrar(emailRegister, passwordRegister, name, roleRegister);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been created successfully!',
      });
      if (roleRegister === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: error.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Swal.fire({
        icon: 'success',
        title: 'Logged out',
        text: 'You have successfully logged out!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: error.message,
      });
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <Link to="/">
            <img src="tennis-svgrepo-com.svg" alt="Tennis Logo" className="logo" />
            <div className="title">
              <h1>Tenis Web</h1>
              <p>Liga's website</p>
            </div>
          </Link>
        </div>
        <nav className="navigation">
          <div className="categories-link-wrapper">
            <div className="categories-link" onClick={handleCategoriesClick}>Categories</div>
            
          </div>
          <div className="tournaments-link-wrapper">
            <div className="tournaments-link" onClick={handleTournamentsClick}>Tournaments</div>
           
          </div>
        </nav>
        <div className="button-container">
          <button className="btn-init" onClick={() => setShowLogin(true)}>Login</button>
          <button className="btn-reg" onClick={() => setShowRegister(true)}>Register</button>
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

      {showLogin && (
        <div className="contenedor">
          <button className="close-btn" onClick={() => setShowLogin(false)}>X</button>
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
                Don't have an account? <span onClick={() => { setShowLogin(false); setShowRegister(true); }} className="link">Register</span>
              </p>
            </div>
            <button onClick={handleGoogle} className="btn-form">
              Google Login
            </button>
          </form>
        </div>
      )}

      {showRegister && (
        <div className="contenedor">
          <button className="close-btn" onClick={() => setShowRegister(false)}>X</button>
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
                onChange={(e) => setRoleRegister(e.target.value)}
                value={roleRegister}  // Enlazar el valor del estado
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
      )}

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
            </div>
          </div>
        )}
      </section>
      <footer></footer>
    </>
  );
};

export default Contenido;
