import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Manage.css';

const Manage = () => {
  const navigate = useNavigate();
  const storedActionType = localStorage.getItem('actionType');
  const initialActionType = storedActionType ? storedActionType : 'add';
  const [actionType, setActionType] = useState(initialActionType);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const buttonData = [
    { label: 'Pracownik', path: '/add/pracownik', editPath: '/pracownik' },
    { label: 'Produkt', path: '/add/produkt', editPath: '/produkt' },
    { label: 'Usługa', path: '/add/usluga', editPath: '/usluga' },
    { label: 'Typ Karnetu', path: '/add/typ_karnetu', editPath: '/typ_karnetu' },
    { label: 'Zniżka', path: '/add/znizka', editPath: '/znizka' },
    { label: 'Okres Karnetu', path: '/add/czas_trwania_karnetu', editPath: '/czas_trwania_karnetu' },
    { label: 'Klient', path: '/add/klient', editPath: '/klient' },
  ];

  useEffect(() => {
    localStorage.setItem('actionType', actionType);
  }, [actionType]);

  return (
    <>
      <div className="tile-buttons-container">
        <div className='tile-buttons-title'>
            <h2 className="tile-title">
            {actionType === 'add' ? 'DODAJ DO BAZY' : 'EDYTUJ BAZĘ'}
            </h2>
            
            <div className="action-toggle">
            <button 
                className={`action-toggle-button ${actionType === 'add' ? 'active' : ''}`}
                onClick={() => setActionType('add')}
            >
                Dodaj
            </button>
            <button 
                className={`action-toggle-button ${actionType === 'edit' ? 'active' : ''}`}
                onClick={() => setActionType('edit')}
            >
                Edytuj
            </button>
            </div>
        </div>

        <div className="tile-buttons">
          {buttonData.map((item, index) => (
            <button
              key={index}
              className="tile-button"
              onClick={() => handleNavigate(actionType === 'add' ? item.path : item.editPath)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Manage;
