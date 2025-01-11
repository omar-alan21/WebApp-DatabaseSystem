import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

const Logout = () => {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser({}); // Clear user data
    navigate('/'); // Redirect to home page
  };

  const cancelLogout = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Are you sure you want to log out?</h2>
      <button
        onClick={handleLogout}
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: '#ff4d4d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Yes, Log Out
      </button>
      <button
        onClick={cancelLogout}
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default Logout;
