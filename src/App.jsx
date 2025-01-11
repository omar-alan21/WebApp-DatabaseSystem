import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import Table from './Table.jsx';
import UslugaForm from './UslugaForm.jsx';
import KarnetForm from './KarnetForm.jsx';
import ProduktForm from './ProduktForm.jsx';
import Login from './Login.jsx';
import './App.css';
import { AppContext } from './AppContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Unauthorized from './Unauthorized.jsx';
import Logout from './Logout.jsx';
import Account from './Account.jsx';
import Form from './Form.jsx';
import ZamownienieForm from './ZamowienieForm.jsx';
import Manage from './Manage.jsx';

function App() {
  const { user, setUser } = useContext(AppContext);

  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTables() {
    try {
      const response = await fetch(`http://localhost:3000/api/template`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setTables(data.routes);
      setFormData(data.formData);
      setLoading(false);

    } catch (err) {
      console.error('Failed to fetch tables:', err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTables();
  }, []) 

  if (loading)
    return (
      <div>Loading</div>
    )

  if (Object.keys(user).length === 0) {
    return (<Login setUser={setUser} />)
  }

  return (
    <Router>
      <TopBar />
      <main>
        <Routes>
          <Route path={`/`} element={<div>HOME</div>} />
          <Route path={`/unauthorized`} element={<Unauthorized />} />
          <Route path={`/account`} element={<Account />} />
          <Route path={`/logout`} element={<Logout />} />
          <Route path={`/manage`} element={
            <ProtectedRoute allowed={['Menadżer']}>
              <Manage />
            </ProtectedRoute>
          } />
          <Route path={`/sprzedaz_usluga`} element={
            <ProtectedRoute allowed={['Menadżer', 'Fizjoterapeuta', 'Dietetyk', 'Trener']}>
              <UslugaForm />
            </ProtectedRoute>
          } />
          <Route path={`/sprzedaz_karnet`} element={
            <ProtectedRoute allowed={['Menadżer', 'Recepcjonista']}>
              <KarnetForm />
            </ProtectedRoute>
          } />
          <Route path={`/sprzedaz_produkt`} element={<ProduktForm />} />
          <Route path={`/order`} element={
            <ProtectedRoute allowed={['Menadżer', 'Recepcjonista']}>
              <ZamownienieForm />
            </ProtectedRoute>} />
          
          {formData.map((form, index) => (
            <Route
              key={index}
              path={`/add/${form.name}`}
              element={
                form.allowed ?
                <ProtectedRoute allowed={form.allowed}>
                  <Form data={form} />
                </ProtectedRoute>
                :
                <Form data={form} />
              } />
              
          ))}
          {tables.map((table, index) => (
            <Route
              key={index}
              path={`/${table.name}`}
              element={
                table.allowed ?
                <ProtectedRoute allowed={table.allowed}>
                  <Table name={table.name} handleRowClick={true} />
                </ProtectedRoute>
                :
                <Table name={table.name} handleRowClick={true} />
              }
            />
          ))}
        </Routes>
      </main>
    </Router>
  );
}

export default App
