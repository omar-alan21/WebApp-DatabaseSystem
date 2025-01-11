import { useEffect, useState, useContext } from 'react';
import Table from './Table.jsx';
import { AppContext } from './AppContext.jsx';

const ZamownienieForm = () => {
  const { user } = useContext(AppContext);

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
        const response = await fetch(`http://localhost:3000/api/order_produkt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Response Message:', responseData);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      Produkt: selectedProdukt
    }));
  }, [selectedProdukt]);


  return (
    <div>
      <h1>Złóż Zamówienie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pracownik:</label>
          {user ? (
            <div>
              {user['Imie']} {user['Nazwisko']}
            </div>
            ) : ( <p>No pracownik selected</p> )
          }
        </div>
        <div>
            <label>Produkty:</label>
            {selectedProdukt.length > 0 ? (
              <ul>
                {selectedProdukt.map((item, index) => (
                  <li key={index}>
                    <span>{item.product['Nazwa']}</span> - Quantity: 
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                    <button onClick={() => handleDeleteItem(index)}>Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
                <p>No products selected</p>
            )}
            {showProduktTable ? (
                <div>
                <h2>Select Product</h2>
                <Table
                    name="produkt"
                    handleRowClick={(product) => {handleSelectProduct(product.data); setShowProduktTable(false)}}
                />
                <button onClick={() => setShowProduktTable(false)}>Close</button>
                </div>
            ) : (
                <button type="button" onClick={() => setShowProduktTable(true)}>
                Add Product
                </button>
            )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ZamownienieForm;