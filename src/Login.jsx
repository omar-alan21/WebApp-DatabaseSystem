import { useState } from 'react';
import './Login.css'

function Login({ setUser }) {

    const [id, setId] = useState('');

    function handleChange(e) {
        setId(e.target.value);
    }

    async function fetchUser() {
        try {
          const response = await fetch(`http://localhost:3000/api/login?id=${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
          const data = await response.json();
          if (data[0])
            setUser(data[0]);
    
        } catch (err) {
          console.error('Failed to fetch columns:', err);
        }
      }

    function handleSubmit(e) {
        e.preventDefault();
        fetchUser();
    }

    return (
        <>
<div className="login-container">
  <div className="login-title">Zaloguj się</div>
  <input
    className="login-input"
    name="id"
    value={id}
    onChange={handleChange}
  />
  <button className="login-button" onClick={handleSubmit}>
    LOGIN
  </button>
</div>

        </>
    )
}

export default Login
