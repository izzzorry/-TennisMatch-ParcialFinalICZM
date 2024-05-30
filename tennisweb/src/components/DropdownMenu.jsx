import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/config'; // Asegúrate de que la ruta a tu archivo de configuración de Firebase sea correcta
import './DropdownMenu.css';

const DropdownMenu = ({ onMouseEnter, onMouseLeave }) => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = ['Children', 'Youth', 'Adults'];
      const categoryData = {};

      for (const category of categories) {
        const q = query(collection(db, "torneos"), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          categoryData[category] = doc.data();
        });
      }

      setCategories(categoryData);
    };
    fetchCategories();
  }, []);

  if (Object.keys(categories).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dropdown-menu" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {categories.Children && (
        <div className="dropdown-item">
          <img src={categories.Children.poster} alt="Children" />
          <p>{categories.Children.category}</p>
        </div>
      )}
      {categories.Youth && (
        <div className="dropdown-item">
          <img src={categories.Youth.poster} alt="Youth" />
          <p>{categories.Youth.category}</p>
        </div>
      )}
      {categories.Adults && (
        <div className="dropdown-item">
          <img src={categories.Adults.poster} alt="Adult" />
          <p>{categories.Adults.category}</p>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
