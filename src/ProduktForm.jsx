import { useEffect, useState, useContext } from 'react';
import Table from './Table.jsx';
import { AppContext } from './AppContext.jsx';
import './Form.css';

const ProduktForm = () => {
  const { user } = useContext(AppContext);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({Pracownik: user});

  const [selectedProdukt, setSelectedProdukt] = useState([]);
  const [showProduktTable, setShowProduktTable] = useState(false);

  const handleSelectProduct = (product) => {
    const quantity = prompt(`Enter quantity for ${product['Nazwa']}`);
    if (quantity && !isNaN(quantity) && quantity > 0) {
      setSelectedProdukt((prevProducts) => [
        ...prevProducts,
        { product, quantity: parseInt(quantity) },
      ]);
    } else {
      alert("Invalid quantity.");
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    setSelectedProdukt((prev) => {
      const updatedList = [...prev];
      updatedList[index].quantity = parseInt(newQuantity, 10) || 0; // Update the quantity
      return updatedList;
    });
  };

  const handleDeleteItem = (index) => {
    setSelectedProdukt((prev) => prev.filter((_, i) => i !== index)); // Remove the item
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('Sending form:', formData);

    try {
        const response = await fetch(`http://localhost:3000/api/transakcja_produkt`, {
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
    setFormData((prevData) => ({
      ...prevData,
      Produkt: selectedProdukt
    }));
  }, [selectedProdukt]);


  return (
    <div className='form-container'>
      <h1 className='form-title'>Sprzedaj Produkt</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Pracownik:</label>
          <input required readOnly value={user ? `${user['Imie']} ${user['Nazwisko']}` : ''} />
        </div>
          <h2 className="form-title">Produkty:</h2>
          <div className="form-group">
            {selectedProdukt.length > 0 ? (
              <>
                {selectedProdukt.map((item, index) => (
                  <div key={index}>
                    <span>{item.product['Nazwa']}</span> - Ilość:
                    <input
                      style={{width: "100px", margin: "10px"}}
                      type="number"
                      value={item.quantity}
                      max={item.product['Stan_na_magazynie']}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                    <button 
                      className="form-button-second"
                      onClick={() => handleDeleteItem(index)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <p>Brak produktów</p>
            )}
          </div>

          {showProduktTable ? (
            <div>
              <h2>Select Product</h2>
              <Table
                name="produkt"
                handleRowClick={(product) => {handleSelectProduct(product.data); setShowProduktTable(false)}}
              />
              <button 
                className="form-button-second" 
                onClick={() => setShowProduktTable(false)}
              >
                Close
              </button>
            </div>
          ) : (
            <button 
              className="form-button-second"
              style={{width: "100px"}}
              onClick={() => setShowProduktTable(true)}
            >
              Add Product
            </button>
          )}
        <br/>
        <br/>
        <button className='form-button' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProduktForm;