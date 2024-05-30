import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/config';   // Asegúrate de que la ruta a tu archivo de configuración de Firebase sea correcta
import './DropdownMenu.css';

const DropdownTournaments = ({ onMouseEnter, onMouseLeave }) => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      const querySnapshot = await getDocs(collection(db, "torneos"));
      const tournamentList = [];
      querySnapshot.forEach((doc) => {
        tournamentList.push(doc.data());
      });
      setTournaments(tournamentList);
    };
    fetchTournaments();
  }, []);

  if (tournaments.length === 0) {
    return <div>Loading...</div>;
  }

  // Limitar a 3 torneos
  const limitedTournaments = tournaments.slice(0, 3);

  return (
    <div className="dropdown-menu-tournaments" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {limitedTournaments.map((tournament, index) => (
        <div className="dropdown-item" key={index}>
          <img src={tournament.poster} alt={tournament.tournament_name} />
          <p>{tournament.tournament_name}</p>
        </div>
      ))}
    </div>
  );
};

export default DropdownTournaments;

