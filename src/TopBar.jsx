import { Link, useNavigate } from 'react-router-dom'
import './TopBar.css'
import { useState, useContext } from 'react';
import { AppContext } from './AppContext.jsx';

export default function TopBar() {
  const { user } = useContext(AppContext);

  const navigate = useNavigate();
  const [selected, setSelected] = useState(undefined);

  const handleSelect = (element) => {
    setSelected(selected !== element ? element : undefined);
  }

  return (
    <div className='topbar-container'>
      <div className='nav-logo' onClick={() => navigate('/')}>Baza Danych</div>
      <nav className='topbar-nav'>
        {/* <div className='nav-element'>
          <button className='nav-button' id={ selected === 0 ? 'selected' : ''} onClick={() => handleSelect(0)}>Wyświetl</button>
          <div className='topbar-dropdown' id={ selected === 0 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/klient'>Klienci</Link>
            <Link className='dropdown-link' to='/pracownik'>Pracownicy</Link>
            <Link className='dropdown-link' to='/produkt'>Produkty</Link>
            <Link className='dropdown-link' to='/stanowisko'>Stanowisko</Link>
            <Link className='dropdown-link' to='/usluga'>Usluga</Link>
            <Link className='dropdown-link' to='/check_produkt'>Stan magazynu</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 1 ? 'selected' : ''} onClick={() => handleSelect(1)}>Transakcje</button>
          <div className='topbar-dropdown' id={ selected === 1 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/transakcja_usluga'>Usługi</Link>
            <Link className='dropdown-link' to='/transakcja_produkt'>Produkty</Link>
            <Link className='dropdown-link' to='/transakcja_karnet'>Karnet</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 2 ? 'selected' : ''} onClick={() => handleSelect(2)}>Sprzedaż</button>
          <div className='topbar-dropdown' id={ selected === 2 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/sprzedaz_usluga'>Usługi</Link>
            <Link className='dropdown-link' to='/sprzedaz_karnet'>Karnet</Link>
            <Link className='dropdown-link' to='/sprzedaz_produkt'>Produkt</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 3 ? 'selected' : ''} onClick={() => handleSelect(3)}>Dodaj</button>
          <div className='topbar-dropdown' id={ selected === 3 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/add/pracownik'>Pracownik</Link>
            <Link className='dropdown-link' to='/add/produkt'>Produkt</Link>
            <Link className='dropdown-link' to='/add/usluga'>Usługa</Link>
            <Link className='dropdown-link' to='/add/Klient'>Klient</Link>
            <Link className='dropdown-link' to='/add/typ_karnetu'>Typ Karnetu</Link>
            <Link className='dropdown-link' to='/add/znizka'>Zniżka</Link>
            <Link className='dropdown-link' to='/add/czas_trwania_karnetu'>Okres Karnetu</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 4 ? 'selected' : ''} onClick={() => handleSelect(4)}>Karnet</button>
          <div className='topbar-dropdown' id={ selected === 4 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/typ_karnetu'>Typ</Link>
            <Link className='dropdown-link' to='/znizka'>Znizki</Link>
            <Link className='dropdown-link' to='/czas_trwania_karnetu'>Czas_trwania</Link>
            <Link className='dropdown-link' to='/check_karnet'>Sprawdz Karnet</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 5 ? 'selected' : ''} onClick={() => handleSelect(5)}>Finanse</button>
          <div className='topbar-dropdown' id={ selected === 5 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/summary_pracownik'>Pracownicy</Link>
            <Link className='dropdown-link' to='/summary_typy'>Transakcje</Link>
            <Link className='dropdown-link' to='/summary_date'>Data</Link>
            <Link className='dropdown-link' to='/typ_transakcji'>Typ Transakcji</Link>
            <Link className='dropdown-link' to='/order'>Złóż Zamównienie</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 6 ? 'selected' : ''} onClick={() => handleSelect(6)}>{user['Imie']} {user['Nazwisko']}</button>
          <div className='topbar-dropdown' id={ selected === 6 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/konto'>Konto</Link>
            <Link className='dropdown-link' to='/logout'>Wyloguj</Link>
          </div>
        </div> */}
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 0 ? 'selected' : ''} onClick={() => handleSelect(0)}>Produkt</button>
          <div className='topbar-dropdown' id={ selected === 0 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/check_produkt'>Sprawdź magazyn</Link>
            <Link className='dropdown-link' to='/sprzedaz_produkt'>Sprzedaj</Link>
            <Link className='dropdown-link' to='/order'>Złóż Zamównienie</Link>
            </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 1 ? 'selected' : ''} onClick={() => handleSelect(1)}>Karnet</button>
          <div className='topbar-dropdown' id={ selected === 1 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/check_karnet'>Sprawdz</Link>
            <Link className='dropdown-link' to='/sprzedaz_karnet'>Sprzedaj</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 2 ? 'selected' : ''} onClick={() => handleSelect(2)}>Usługa</button>
          <div className='topbar-dropdown' id={ selected === 2 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/sprzedaz_usluga'>Wykonaj</Link>
            </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 3 ? 'selected' : ''} onClick={() => handleSelect(3)}>Klient</button>
          <div className='topbar-dropdown' id={ selected === 3 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/add/klient'>Dodaj</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 4 ? 'selected' : ''} onClick={() => handleSelect(4)}>Finanse</button>
          <div className='topbar-dropdown' id={ selected === 4 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/summary_pracownik'>Pracownicy</Link>
            <Link className='dropdown-link' to='/summary_typy'>Typy</Link>
            <Link className='dropdown-link' to='/summary_date'>Data</Link>
          </div>
        </div>
        <div className='nav-element'>
          <button className='nav-navigate' id={ selected === 6 ? 'selected' : ''} onClick={() => {handleSelect(-1); navigate('/manage')}}>Zarządzanie</button>
        </div>
        <div className='nav-element'>
          <button className='nav-button' id={ selected === 5 ? 'selected' : ''} onClick={() => handleSelect(5)}>{user['Imie']} {user['Nazwisko']}</button>
          <div className='topbar-dropdown' id={ selected === 5 ? 'selected-dropdown' : ''}>
            <Link className='dropdown-link' to='/account'>Konto</Link>
            <Link className='dropdown-link' to='/logout'>Wyloguj</Link>
          </div>
        </div>
      </nav>
    </div>
  )
}