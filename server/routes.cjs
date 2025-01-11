const routes = [
        {
            name: 'klient',
            query: `SELECT k.ID_Klienta, k.Kod_Klienta, k.Imie, k.Nazwisko, k.Numer_telefonu, DATE_FORMAT(Data_dolaczenia, '%Y-%m-%d') AS Data_dolaczenia
            FROM klient k
            JOIN transakcja_karnet t ON k.ID_Klienta = t.ID_Klienta
            JOIN czas_trwania_karnetu c ON t.ID_Czasu_trwania = c.ID_Czasu_trwania
            WHERE k.Archiwalny = 0`,
            columns: [
                {
                    hide: true
                },
                {
                    hide: true
                },
                {
                    filter: true,
                    editable: true
                },
                {
                    filter: true,
                    editable: true
                },
                {
                    filter: true,
                    editable: true
                },
                {
                    filter: 'agDateColumnFilter',
                    editable: true
                }
            ],
            rowSelection: {mode: 'singleRow'},
            allowed: ['Menadżer']
        },
        {
            name: 'check_karnet',
            query: `SELECT k.Imie, k.Nazwisko, k.Numer_telefonu, DATE_FORMAT(DATE_ADD(t.Data_transakcji, INTERVAL c.Liczba_miesiecy MONTH), '%Y-%m-%d') AS Data_wygasniecia
            FROM klient k
            JOIN transakcja_karnet t ON k.ID_Klienta = t.ID_Klienta
            JOIN czas_trwania_karnetu c ON t.ID_Czasu_trwania = c.ID_Czasu_trwania
            WHERE k.Archiwalny = 0`,
            columns: [
                {
                    filter: true,
                },
                {
                    filter: true,
                },
                {
                    filter: true,
                },
                {
                    type: 'color_date'
                }
            ]
        },
        {
            name: 'produkt',
            query: `SELECT ID_Produktu, Kod_Produktu, Nazwa, ROUND(Cena, 2) AS Cena, Stan_na_magazynie
            FROM produkt
            WHERE Archiwalny = 0`,
            columns: [
                {
                    hide: true
                },
                {
                    hide: true
                },
                {
                    filter: true,
                    editable: true,
                },
                {
                    type: 'currency',
                    editable: true,
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    hide: true
                }
            ],
            allowed: ['Menadżer']
        },
        {
            name: 'check_produkt',
            query: `SELECT Nazwa, ROUND(Cena, 2) AS Cena, Stan_na_magazynie
            FROM produkt
            WHERE Archiwalny = 0`,
            columns: [
                {
                    filter: true
                },
                {
                    type: 'currency'
                },
                {
                    filter: 'agNumberColumnFilter'
                }
            ]
        },
        {
            name: 'pracownik',
            query: `SELECT p.ID_Pracownika, p.Kod_Pracownika, p.Identyfikator, s.Nazwa as Stanowisko, p.Imie, p.Nazwisko, p.Adres_email, p.Numer_telefonu, DATE_FORMAT(p.Data_zatrudnienia, '%Y-%m-%d') AS Data_zatrudnienia, p.Pensja
            FROM Pracownik p
            JOIN Stanowisko s ON p.ID_Stanowiska = s.ID_Stanowiska
            WHERE p.Archiwalny = 0`,
            columns: [
                {
                    hide: true
                },
                {
                    hide: true
                },
                {
                    hide: true
                },
                {
                    type: 'dropdown',
                    editable: true
                },
                {
                    filter: true,
                    editable: true,
                },
                {
                    filter: true,
                    editable: true,
                },
                {
                    filter: true,
                    editable: true,
                },
                {
                    filter: true,
                    editable: true,
                },
                {
                    filter: 'agDateColumnFilter',
                    editable: true
                },
                {
                    filter: 'agNumberColumnFilter',
                    editable: true
                },
            ],
            dropdown: [{table: 'stanowisko', col: 'Nazwa'}],
            allowed: ['Menadżer']
        },
        {
            name: 'stanowisko',
            query: `SELECT ID_Stanowiska, Nazwa
            FROM stanowisko
            WHERE Archiwalny = 0`,
            columns: [
                {
                    hide: true
                },
                {
                    filter: true,
                    editable: true
                }
            ],
            allowed: ['Menadżer']
        },
        {
            name: 'znizka',
            query: `SELECT ID_Znizki, Kod_Znizki, Nazwa, Znizka
            FROM znizka
            WHERE Archiwalny = 0`,
            columns: [
                {
                    hide: true
                },
                {
                    hide: true
                },
                {
                    filter: true,
                    editable: true,
                },
                {
                    type: 'percent',
                    editable: true,
                }
            ],
            allowed: ['Menadżer']
        },
        {
            name: 'usluga',
            query: `SELECT ID_Uslugi, Kod_Uslugi, Nazwa, ROUND(Cena, 2) AS Cena
            FROM usluga
            WHERE Archiwalny = 0`,
            columns: [
                {
                    hide: true
                },
                {
                    hide: true
                },
                {
                    filter: true,
                    editable: true
                },
                {
                    type: 'currency',
                    editable: true
                }
            ],
            allowed: ['Menadżer']
        },
        {
            name: 'typ_karnetu',
            query: `SELECT ID_Typu, Kod_Typu, typ, ROUND(Cena, 2) AS Cena
            FROM typ_karnetu
            WHERE Archiwalny = 0`,
            columns: [
                {
                    hide: true
                },
                {
                    hide: true
                },
                {
                    filter: true,
                    editable: true
                },
                {
                    type: 'currency',
                    editable: true
                },
                {
                    hide: true
                }
            ],
            allowed: ['Menadżer']
        },
        {
            name: 'czas_trwania_karnetu',
            query: `SELECT ID_Czasu_trwania, Kod_Czasu_trwania, Liczba_miesiecy
            FROM czas_trwania_karnetu
            WHERE Archiwalny = 0`,
            columns: [
                {
                    hide: true
                },
                {
                    hide: true
                },
                {
                    filter: 'agNumberColumnFilter',
                    editable: true
                },
                {
                    hide: true
                }
            ],
            allowed: ['Menadżer']
        },
        {
            name: 'typ_transakcji',
            query: `
            SELECT ID_Typu, Nazwa
            FROM typ_transakcji`,
            columns: [
                {
                    hide: true
                },
                {
                    filter: true
                }
            ]
        },
        {
            name: 'transakcja_usluga',
            query: `SELECT t.ID_Transakcji, p.ID_Pracownika, CONCAT(p.Imie, \' \', p.Nazwisko) AS pracownik, k.ID_Klienta, CONCAT(k.Imie, \' \', k.Nazwisko) AS klient, u.Nazwa AS Usluga, DATE_FORMAT(t.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, ROUND(u.Cena, 2) AS Cena
            FROM transakcja_usluga t INNER JOIN pracownik p ON t.ID_Pracownika = p.ID_Pracownika
            JOIN klient k ON t.ID_Klienta = k.ID_Klienta
            JOIN usluga u ON t.ID_Uslugi = u.ID_Uslugi`,
            columns: [
                {
                    hide: true
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    filter: true,
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    filter: true,
                },
                {
                    type: 'dropdown'
                },
                {
                    filter: 'agDateColumnFilter'
                },
                {
                    type: 'currency'
                }
            ],
            dropdown: [{table: 'usluga', col: 'Nazwa'}],
            allowed: ['Menadżer']
        },
        {
            name: 'transakcja_produkt',
            query: `SELECT t.ID_Transakcji, p.ID_Pracownika, CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, DATE_FORMAT(t.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, GROUP_CONCAT(CONCAT(s.Ilosc, 'x ', pr.Nazwa) SEPARATOR ', ') AS Produkty, SUM(s.Ilosc * pr.Cena) AS Cena
            FROM transakcja_produkt t
            JOIN pracownik p ON t.ID_Pracownika = p.ID_Pracownika
            JOIN szczegoly_transakcji s ON t.ID_Transakcji = s.ID_Transakcji
            JOIN produkt pr ON s.ID_Produktu = pr.ID_Produktu
            GROUP BY t.ID_Transakcji`,
            columns: [
                {
                    hide: true
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    filter: true
                },
                {
                    filter: 'agDateColumnFilter'
                },
                {
                    filter: true,
                    flex: 0.5
                },
                {
                    type: 'currency'
                },
            ],
            allowed: ['Menadżer']
        },
        {
            name: 'transakcja_karnet',
            query: `SELECT t.ID_Transakcji, p.ID_Pracownika, CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, k.ID_Klienta, CONCAT(k.Imie, ' ', k.Nazwisko) AS Klient, DATE_FORMAT(t.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, ty.Typ AS Typ_Karnetu, z.Nazwa AS Znizka, c.Liczba_miesiecy, ROUND((ty.Cena - (ty.Cena * z.Znizka/100)) * c.Liczba_miesiecy, 2) AS Cena
            FROM transakcja_karnet t
            JOIN pracownik p ON t.ID_Pracownika = p.ID_Pracownika
            JOIN klient k ON t.ID_Klienta = k.ID_Klienta
            JOIN typ_karnetu ty ON t.ID_Typu = ty.ID_Typu
            JOIN Znizka z ON t.ID_Znizki = z.ID_Znizki
            JOIN czas_trwania_karnetu c ON t.ID_Czasu_trwania = c.ID_Czasu_trwania`,
            columns: [
                {
                    hide: true
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    filter: true
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    filter: true
                },
                {
                    filter: 'agDateColumnFilter'
                },
                {
                    type: 'dropdown'
                },
                {
                    type: 'dropdown'
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    type: 'currency'
                }
            ],
            dropdown: [{table: 'typ_karnetu', col: 'typ'}, {table: 'znizka', col: 'Nazwa'}],
            allowed: ['Menadżer']
        },
        {
            name: 'summary_pracownik',
            query: `SELECT 
            p.ID_Pracownika,
            CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik,
            ROUND(SUM(CASE 
            WHEN sub.Data_transakcji >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
            THEN sub.Cena 
            ELSE 0 
            END), 2) AS Sredni_przychod_biezace_30_dni,
            ROUND(SUM(sub.Cena) / COUNT(DISTINCT CONCAT(YEAR(sub.Data_transakcji), '-', MONTH(sub.Data_transakcji))), 2) AS Sredni_przychod_alltime,
            ROUND(SUM(CASE 
            WHEN sub.Data_transakcji >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
            THEN sub.Cena 
            ELSE 0 
            END) / p.Pensja, 2) AS Efektywnosc_biezace_30_dni,
            ROUND(SUM(sub.Cena) / (p.Pensja * COUNT(DISTINCT CONCAT(YEAR(sub.Data_transakcji), '-', MONTH(sub.Data_transakcji)))), 2) AS Efektywnosc_alltime
            FROM (
            SELECT 
            t1.ID_Pracownika, 
            t1.Data_transakcji,
            ROUND((ty.Cena - (ty.Cena * z.Znizka/100)) * c.Liczba_miesiecy, 2) AS Cena
            FROM transakcja_karnet t1
            JOIN typ_karnetu ty ON t1.ID_Typu = ty.ID_Typu
            JOIN znizka z ON t1.ID_Znizki = z.ID_Znizki
            JOIN czas_trwania_karnetu c ON t1.ID_Czasu_trwania = c.ID_Czasu_trwania

            UNION ALL

            SELECT 
            t2.ID_Pracownika, 
            t2.Data_transakcji,
            SUM(s.Ilosc * pr.Cena) AS Cena
            FROM transakcja_produkt t2
            JOIN szczegoly_transakcji s ON t2.ID_Transakcji = s.ID_Transakcji
            JOIN produkt pr ON s.ID_Produktu = pr.ID_Produktu
            GROUP BY t2.ID_Pracownika, t2.Data_transakcji

            UNION ALL

            SELECT 
            t3.ID_Pracownika, 
            t3.Data_transakcji,
            ROUND(u.Cena, 2) AS Cena
            FROM transakcja_usluga t3
            JOIN usluga u ON t3.ID_Uslugi = u.ID_Uslugi
            ) AS sub
            JOIN pracownik p ON sub.ID_Pracownika = p.ID_Pracownika
            GROUP BY p.ID_Pracownika, Pracownik`,
            columns: [
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    filter: true
                },
                {
                    type: 'currency'
                },
                {
                    type: 'currency'
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    filter: 'agNumberColumnFilter'
                },
            ],
            allowed: ['Menadżer']
        },
        {
            name: 'summary_typy',
            query: `SELECT 
            Typ_transakcji, 
            COUNT(*) AS Liczba_transakcji, 
            SUM(Cena) AS Suma_przychodu
            FROM (
            SELECT ID_Pracownika, Pracownik, Data_transakcji, Typ_transakcji, Cena
            FROM (
            SELECT t1.ID_Pracownika AS ID_Pracownika, CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, DATE_FORMAT(t1.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 'Karnet' AS Typ_transakcji, ROUND((ty.Cena - (ty.Cena * z.Znizka/100)) * c.Liczba_miesiecy, 2) AS Cena
            FROM transakcja_karnet t1
            JOIN typ_karnetu ty ON t1.ID_Typu = ty.ID_Typu
            JOIN Znizka z ON t1.ID_Znizki = z.ID_Znizki
            JOIN czas_trwania_karnetu c ON t1.ID_Czasu_trwania = c.ID_Czasu_trwania
            JOIN pracownik p ON t1.ID_Pracownika = p.ID_Pracownika
            UNION ALL
            SELECT t2.ID_Pracownika AS ID_Pracownika, CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, DATE_FORMAT(t2.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 'Produkt' AS Typ_transakcji, SUM(s.Ilosc * pr.Cena) AS Cena
            FROM transakcja_produkt t2
            JOIN szczegoly_transakcji s ON t2.ID_Transakcji = s.ID_Transakcji
            JOIN produkt pr ON s.ID_Produktu = pr.ID_Produktu
            JOIN pracownik p ON t2.ID_Pracownika = p.ID_Pracownika
            GROUP BY t2.Data_transakcji, t2.ID_Pracownika, p.Imie, p.Nazwisko
            UNION ALL
            SELECT t3.ID_Pracownika AS ID_Pracownika, CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, DATE_FORMAT(t3.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 'Usługa' AS Typ_transakcji, ROUND(u.Cena, 2) AS Cena
            FROM transakcja_usluga t3
            JOIN usluga u ON t3.ID_Uslugi = u.ID_Uslugi
            JOIN pracownik p ON t3.ID_Pracownika = p.ID_Pracownika
            ) AS subquery
            ) AS subquery
            GROUP BY Typ_transakcji`,
            columns: [

                {
                    type: 'dropdown'
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    type: 'currency'
                },
            ],
            dropdown: [{table: 'typ_transakcji', col: 'Nazwa'}],
            allowed: ['Menadżer']
        },
        {
            name: 'summary_date',
            query: `SELECT 
            Data_transakcji, 
            COUNT(*) AS Liczba_transakcji,
            SUM(Cena) AS Suma_przychodu,
            (SELECT SUM(Cena)
            FROM (
            SELECT DATE_FORMAT(t1.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 
            ROUND((ty.Cena - (ty.Cena * z.Znizka/100)) * c.Liczba_miesiecy, 2) AS Cena
            FROM transakcja_karnet t1
            JOIN typ_karnetu ty ON t1.ID_Typu = ty.ID_Typu
            JOIN Znizka z ON t1.ID_Znizki = z.ID_Znizki
            JOIN czas_trwania_karnetu c ON t1.ID_Czasu_trwania = c.ID_Czasu_trwania
            UNION ALL
            SELECT DATE_FORMAT(t2.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 
            SUM(s.Ilosc * pr.Cena) AS Cena
            FROM transakcja_produkt t2
            JOIN szczegoly_transakcji s ON t2.ID_Transakcji = s.ID_Transakcji
            JOIN produkt pr ON s.ID_Produktu = pr.ID_Produktu
            GROUP BY t2.Data_transakcji
            UNION ALL
            SELECT DATE_FORMAT(t3.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 
            ROUND(u.Cena, 2) AS Cena
            FROM transakcja_usluga t3
            JOIN usluga u ON t3.ID_Uslugi = u.ID_Uslugi
            ) AS last_year_data
            WHERE last_year_data.Data_transakcji = DATE_SUB(main_query.Data_transakcji, INTERVAL 1 YEAR)
            ) AS Suma_przychodu_zeszly_rok
            FROM (
            SELECT ID_Pracownika, Pracownik, Data_transakcji, Typ_transakcji, Cena
            FROM (
            SELECT t1.ID_Pracownika AS ID_Pracownika, CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, 
            DATE_FORMAT(t1.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 'Karnet' AS Typ_transakcji, 
            ROUND((ty.Cena - (ty.Cena * z.Znizka/100)) * c.Liczba_miesiecy, 2) AS Cena
            FROM transakcja_karnet t1
            JOIN typ_karnetu ty ON t1.ID_Typu = ty.ID_Typu
            JOIN Znizka z ON t1.ID_Znizki = z.ID_Znizki
            JOIN czas_trwania_karnetu c ON t1.ID_Czasu_trwania = c.ID_Czasu_trwania
            JOIN pracownik p ON t1.ID_Pracownika = p.ID_Pracownika
            UNION ALL
            SELECT t2.ID_Pracownika AS ID_Pracownika, CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, 
            DATE_FORMAT(t2.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 'Produkt' AS Typ_transakcji, 
            SUM(s.Ilosc * pr.Cena) AS Cena
            FROM transakcja_produkt t2
            JOIN szczegoly_transakcji s ON t2.ID_Transakcji = s.ID_Transakcji
            JOIN produkt pr ON s.ID_Produktu = pr.ID_Produktu
            JOIN pracownik p ON t2.ID_Pracownika = p.ID_Pracownika
            GROUP BY t2.Data_transakcji, t2.ID_Pracownika, p.Imie, p.Nazwisko
            UNION ALL
            SELECT t3.ID_Pracownika AS ID_Pracownika, CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, 
            DATE_FORMAT(t3.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 'Usługa' AS Typ_transakcji, 
            ROUND(u.Cena, 2) AS Cena
            FROM transakcja_usluga t3
            JOIN usluga u ON t3.ID_Uslugi = u.ID_Uslugi
            JOIN pracownik p ON t3.ID_Pracownika = p.ID_Pracownika
            ) AS subquery
            ) AS main_query
            GROUP BY Data_transakcji`,
            columns: [

                {
                    type: 'dropdown'
                },
                {
                    filter: 'agNumberColumnFilter'
                },
                {
                    type: 'currency'
                },
            ],
            dropdown: [{table: 'typ_transakcji', col: 'Nazwa'}],
            allowed: ['Menadżer']
        },
    ]

module.exports = routes