import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from './Table.jsx'
import { AppContext } from './AppContext.jsx';
import './Form.css';

const KarnetForm = () => {
  const { user } = useContext(AppContext);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({Pracownik: user});

  const [selectedKlient, setSelectedKlient] = useState(null);
  const [showKlientTable, setShowKlientTable] = useState(false);

  const [selectedTyp, setSelectedTyp] = useState(null);
  const [showTypTable, setShowTypTable] = useState(false);
  
  const [selectedZnizka, setSelectedZnizka] = useState(null);
  const [showZnizkaTable, setShowZnizkaTable] = useState(false);
  
  const [selectedLiczbaMies, setSelectedLiczbaMies] = useState(null);
  const [showLiczbaMiesTable, setShowLiczbaMiesTable] = useState(false);

  const [cena, setCena] = useState('0 zł');


  const navigate = useNavigate();

  const handleSelectKlient = (klient) => {
    setSelectedKlient(klient);
    setShowKlientTable(false);
    setFormData((prevData) => ({
      ...prevData,
      Klient: klient
    }));
  };

  const handleSelectTyp = (typ) => {
    setSelectedTyp(typ);
    setShowTypTable(false);
    setFormData((prevData) => ({
      ...prevData,
      Typ_karnetu: typ
    }));
  }

  const handleSelectZnizka = (znizka) => {
    setSelectedZnizka(znizka);
    setShowZnizkaTable(false);
    setFormData((prevData) => ({
      ...prevData,
      Znizka: znizka
    }));
  }

  const handleSelectLiczbaMies = (liczba_mies) => {
    setSelectedLiczbaMies(liczba_mies);
    setShowLiczbaMiesTable(false);
    setFormData((prevData) => ({
      ...prevData,
      Liczba_miesiecy: liczba_mies
    }));
  }

async function handleSubmit(e) {
    e.preventDefault();
    console.log('Sending form:', formData);

    try {
        const response = await fetch(`http://localhost:3000/api/transakcja_karnet`, {
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

  useEffect(() => {
    if (selectedTyp !== null && selectedZnizka !== null && selectedLiczbaMies !== null)
      setCena(Number((selectedTyp['Cena']) -  (Number(selectedTyp['Cena']) * selectedZnizka['Znizka'] / 100)) * selectedLiczbaMies['Liczba_miesiecy'])
  
  }, [selectedTyp, selectedZnizka, selectedLiczbaMies])

  return (
    <>
      <div className='form-container'>
        <h1>Sprzedarz Karnetu</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Pracownik:</label>
              <input required readOnly value={user ? `${user['Imie']} ${user['Nazwisko']}` : ''} />
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
            <label>Typ Karnetu:</label>
              <input required readOnly onClick={() => setShowTypTable(true)} value={selectedTyp ? selectedTyp['typ'] : ''} />
            {showTypTable && 
              <div>
                <h2>Select</h2>
                <Table
                  name="typ_karnetu"
                  handleRowClick={(typ) => handleSelectTyp(typ.data)}
                />
                <button onClick={() => setShowTypTable(false)}>Close</button>
              </div>}
          </div>
          <div className='form-group'>
            <label>Znizka:</label>
              <input required readOnly onClick={() => setShowZnizkaTable(true)} value={selectedZnizka ? selectedZnizka['Nazwa'] : ''} />
            {showZnizkaTable && 
              <div>
                <h2>Select</h2>
                <Table
                  name="znizka"
                  handleRowClick={(znizka) => handleSelectZnizka(znizka.data)}
                />
                <button onClick={() => setShowZnizkaTable(false)}>Close</button>
              </div>}
          </div>
          <div className='form-group'>
            <label>Liczba Miesiecy:</label>
              <input required readOnly onClick={() => setShowLiczbaMiesTable(true)} value={selectedLiczbaMies ? selectedLiczbaMies['Liczba_miesiecy'] : ''} />
            {showLiczbaMiesTable && 
              <div>
                <h2>Select</h2>
                <Table
                  name="czas_trwania_karnetu"
                  handleRowClick={(liczba_mies) => handleSelectLiczbaMies(liczba_mies.data)}
                />
                <button onClick={() => setShowLiczbaMiesTable(false)}>Close</button>
              </div>}
          </div>
          <div className='form-group'>
            <label>Do zapłaty:</label>
            {cena && (
              <label>
                {cena} zł
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

export default KarnetForm;