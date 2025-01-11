import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from './Table.jsx'
import { AppContext } from './AppContext.jsx';
import './Form.css';

const UslugaForm = () => {
  const { user } = useContext(AppContext);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({Pracownik: user});

  const [selectedKlient, setSelectedKlient] = useState(null);
  const [showKlientTable, setShowKlientTable] = useState(false);

  const [selectedUsluga, setSelectedUsluga] = useState(null);
  const [showUslugaTable, setShowUslugaTable] = useState(false);

  const navigate = useNavigate();

  const handleSelectKlient = (klient) => {
    setSelectedKlient(klient);
    setShowKlientTable(false);
    setFormData((prevData) => ({
      ...prevData,
      Klient: klient
    }));
  };

  const handleSelectUsluga = (usluga) => {
    setSelectedUsluga(usluga);
    setShowUslugaTable(false);
    setFormData((prevData) => ({
      ...prevData,
      Usluga: usluga
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('Sending form:', formData);

    try {
        const response = await fetch(`http://localhost:3000/api/transakcja_usluga`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            setMessage({ type: "error", text: "Failed to submit." });
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        setMessage({ type: "success", text: "Submitted successfully!" });
        const responseData = await response.json();
        console.log('Response Message:', responseData);
    } catch (error) {
        setMessage({ type: "error", text: "An error occurred." });
        console.error('Error:', error.message);
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
};

  return (
    <>
      <div className='form-container'>
        <h1 className='form-title'>Wykonaj Usługe</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Pracownik:</label>
              <input readOnly value={user ? `${user['Imie']} ${user['Nazwisko']}` : ''} />
          </div>
          <div className='form-group'>
            <label>Klient:</label>
              <input required readOnly onClick={() => setShowKlientTable(true)} value={selectedKlient ? `${selectedKlient['Imie']} ${selectedKlient['Nazwisko']}` : ''} />
            {showKlientTable && 
              <div>
                <h2>Select</h2>
                <Table
                  name="klient"
                  handleRowClick={(klient) => handleSelectKlient(klient.data)}
                />
                <button onClick={() => setShowKlientTable(false)}>Close</button>
              </div>}
          </div>
          <div className='form-group'>
            <label>Usługa:</label>
              <input required readOnly onClick={() => setShowUslugaTable(true)} value={selectedUsluga ? `${selectedUsluga['Nazwa']}` : ''}  />
            {showUslugaTable &&
              <div>
                <h2>Select</h2>
                <Table
                  name="usluga"
                  handleRowClick={(usluga) => handleSelectUsluga(usluga.data)}
                />
                <button onClick={() => setShowUslugaTable(false)}>Close</button>
              </div>
            }
          </div>
          <div className='form-group'>
            <label>Do zapłaty:</label>
            {selectedUsluga && (
              <label>
                {selectedUsluga['Cena']} zł
              </label>
              )
            }
          </div>
          <button className='form-button' type="submit">Submit</button>
        </form>
      </div>
      <div>
        {message.text && (
            <div
            style={{
              position: "fixed",
              top: "120px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: "1000",
              width: "100%",
              maxWidth: "500px",
              textAlign: "center",
              padding: "10px",
              backgroundColor:
                message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
              border: `1px solid ${
                message.type === "success" ? "#c3e6cb" : "#f5c6cb"
              }`,
              borderRadius: "4px",
            }}
            >
            {message.text}
            </div>
        )}
      </div>
    </>
  );
};

export default UslugaForm;