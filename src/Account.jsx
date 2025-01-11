import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import Grid from './Grid.jsx';

const Account = () => {
  const { user } = useContext(AppContext);
  const [stats, setStats] = useState([]);
  const [premia, setPremia] = useState(0);

  function calculateSalary(transactions) {
  
    const karnetTransactions = transactions.filter(t => t.Typ_transakcji === 'Karnet');
    const uslugaTransactions = transactions.filter(t => t.Typ_transakcji === 'Usługa');
  
    let bonus = 0;
  
    if (user['Stanowisko'] === 'Recepcjonista' && karnetTransactions.length > 30) {
      bonus = 100;
    }
    if (user['Stanowisko'] === 'Recepcjonista' && karnetTransactions.length > 50) {
      bonus = 250;
    }
    
    if (['Trener', 'Dietetyk', 'Fizjoterapeuta'].includes(user['Stanowisko']) && uslugaTransactions.length > 30) {
      bonus = 100;
    }
    if (['Trener', 'Dietetyk', 'Fizjoterapeuta'].includes(user['Stanowisko']) && uslugaTransactions.length > 50) {
      bonus = 250;
    }
  
    return bonus;
  }

  async function fetchStats() {
    try {
      const response = await fetch(`http://localhost:3000/api/stats${user['ID_Pracownika']}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setStats(data);
      console.log(data)
      setPremia(() => calculateSalary(data));

    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user])

  return (
    <div>
      <h1>Account Details</h1>
      <ul>
        {Object.keys(user).slice(1).map((key) => (
          <li key={key}>
            <strong>{key}:</strong> {user[key]}
          </li>
        ))}
          <li>
            <strong>Premia:</strong> {premia}
          </li>
      </ul>
    </div>
  );
};

export default Account;
