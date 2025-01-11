const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');

const routes = require('./routes.cjs')
const formData = require('./formData.cjs')
const buildQuery = require('./buildQuery.cjs')
const handlePost = require('./handlePost.cjs')

//// CONNECT ////

    const db = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        database: 'silownia',
        multipleStatements: true
    });

    db.connect((err) => {
        if (err) throw err;
        console.log('Connected to database...');
    });

    app.use(express.static('public'));
    app.use(cors());
    app.use(express.json());


//// GET ////

    function handleGet(route) {

        app.get(`/api/col/${route.name}`, (req, res) => {

            db.query(`${route.query} LIMIT 1 OFFSET 0`, (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    const keys = Object.keys(results[0]).map((key, index) => {
                        return { field: key, ...route.columns[index] }
                    });
                    res.json({keys: keys, route: route});
                }
            });
        });

        app.get(`/api/${route.name}`, (req, res) => {
            const { FullFinalQuery, finalQuery } = buildQuery(route.query, req.query)

            db.query(finalQuery, (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    db.query(`WITH subquery AS (${FullFinalQuery}) SELECT COUNT(*) AS total FROM subquery`, (err, totalCount) => {
                        if (err) res.status(500).send(err);
                        else {
                            res.json({rows: results, lastRow: totalCount[0].total});
                        }
                    });
                }
            });
        });
    }

    app.post(`/api/transakcja_produkt`, (req, res) => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        db.query(`INSERT INTO Transakcja_produkt (ID_Pracownika, Data_transakcji) VALUES('${req.body.Pracownik.ID_Pracownika}', '${formattedDate}')`, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                for (let i = 0; i < req.body.Produkt.length; i++) {
                    db.query(`INSERT INTO Szczegoly_transakcji (ID_Transakcji, ID_Produktu, Ilosc) VALUES('${result.insertId}', '${req.body.Produkt[i].product.ID_Produktu}', '${req.body.Produkt[i].quantity}')`, (err, result) => {
                        if (err) {
                            console.error('Error executing query:', err);
                            res.status(500).json({ error: 'Database error' });
                        }
                    });
                }
                res.json({ message: `Record added to Transakcja_produkt and Szczegoly_transakcji successfully!`, result });
            }
        });
    });

    app.post(`/api/order_produkt`, (req, res) => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        db.query(`INSERT INTO Transakcja_produkt (ID_Pracownika, Data_transakcji) VALUES('${req.body.Pracownik.ID_Pracownika}', '${formattedDate}')`, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                for (let i = 0; i < req.body.Produkt.length; i++) {
                    db.query(`INSERT INTO Szczegoly_transakcji (ID_Transakcji, ID_Produktu, Ilosc) VALUES('${result.insertId}', '${req.body.Produkt[i].product.ID_Produktu}', '${req.body.Produkt[i].quantity}')`, (err, result) => {
                        if (err) {
                            console.error('Error executing query:', err);
                            res.status(500).json({ error: 'Database error' });
                        }
                    });
                }
                res.json({ message: `Record added to Transakcja_produkt and Szczegoly_transakcji successfully!`, result });
            }
        });
    });

/// PUT ///

function handlePut(route) {

    // has_kod = ['czas_trwania_karnetu', 'produkt', 'typ_karnetu', 'usluga', 'znizka'];

    // if (has_kod.includes(route.name)) 
        app.put(`/api/${route.name}`, (req, res) => {
            const keys = Object.keys(req.body.data).slice(1).join(', ');
            const values = Object.values(req.body.data).slice(1).map(val => (typeof val === 'string' ? `'${val}'` : val)).join(', ');

            db.query(`UPDATE ${route.name} SET Archiwalny = 1 WHERE ${Object.keys(req.body.data)[0]} = ${req.body.data[Object.keys(req.body.data)[0]]}`, (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Błąd przy zmienianiu nowego rekordu', details: err });
                    });
                } else {
                    db.query(`INSERT INTO ${route.name} (${keys}, Archiwalny) VALUES (${values}, 0)`, (err, results) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: 'Błąd przy dodawaniu nowego rekordu', details: err });
                            });
                        } else {
                            res.json({ message: 'Rekord zaktualizowany i dodany pomyślnie', results });
                        }
                    });
                }
            });
        });
}


//// DELETE ////

function handleDelete(route) {

    app.delete(`/api/${route.name}`, (req, res) => {
        const id = req.body.id[0];
        const col = req.body.col[0];
        console.log(id)
        console.log(col)
    
        db.query(`UPDATE ${route.name} SET Archiwalny = 1 WHERE ${col} = ${id}`, (err, result) => {
        if (err) {
            console.error('Error deleting clients:', err);
            return res.status(500).json({ error: 'Error deleting clients from the database' });
        }
    
        console.log('Deleted clients:', result);
        res.json({ message: `${result.affectedRows} client(s) deleted successfully` });
        });
    });
}
    

//// SETUP ROUTES ////

    routes.forEach(route => {handleGet(route)});
    routes.forEach(route => {handlePut(route)});
    routes.forEach(route => {handleDelete(route)});
    formData.forEach(form => {
        app.post(`/api/${form.name}`, (req, res) => {
            const query = handlePost(form, req, res);
            db.query(query, (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).json({ error: 'Database error' });
                } else {
                    res.json({ message: `Record added successfully!`, result });
                }
            });
        })});


    app.get(`/api/template`, (req, res) => {
        res.json({routes: routes, formData: formData});
    });

    app.get(`/api/login`, (req, res) => {
        const id = req.query.id;
        const query = routes.find(route => (route.name === 'pracownik'))?.query;
        db.query(`${query} AND Identyfikator = ${id}`, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(results);
            }
        });
    });

    app.get(`/api/stats:id`, (req, res) => {
        
        const id = req.params.id;
        const query = `SELECT ID_Pracownika, Pracownik, Data_transakcji, Typ_transakcji, Cena
        FROM (
        SELECT t1.ID_Pracownika AS ID_Pracownika, 
        CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, 
        DATE_FORMAT(t1.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 
        'Karnet' AS Typ_transakcji, 
        ROUND((ty.Cena - (ty.Cena * z.Znizka/100)) * c.Liczba_miesiecy, 2) AS Cena
        FROM transakcja_karnet t1
        JOIN typ_karnetu ty ON t1.ID_Typu = ty.ID_Typu
        JOIN Znizka z ON t1.ID_Znizki = z.ID_Znizki
        JOIN czas_trwania_karnetu c ON t1.ID_Czasu_trwania = c.ID_Czasu_trwania
        JOIN pracownik p ON t1.ID_Pracownika = p.ID_Pracownika
        WHERE t1.Data_transakcji >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)

        UNION ALL

        SELECT t2.ID_Pracownika AS ID_Pracownika, 
        CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, 
        DATE_FORMAT(t2.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 
        'Produkt' AS Typ_transakcji, 
        SUM(s.Ilosc * pr.Cena) AS Cena
        FROM transakcja_produkt t2
        JOIN szczegoly_transakcji s ON t2.ID_Transakcji = s.ID_Transakcji
        JOIN produkt pr ON s.ID_Produktu = pr.ID_Produktu
        JOIN pracownik p ON t2.ID_Pracownika = p.ID_Pracownika
        WHERE t2.Data_transakcji >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY t2.Data_transakcji, t2.ID_Pracownika, p.Imie, p.Nazwisko

        UNION ALL

        SELECT t3.ID_Pracownika AS ID_Pracownika, 
        CONCAT(p.Imie, ' ', p.Nazwisko) AS Pracownik, 
        DATE_FORMAT(t3.Data_transakcji, '%Y-%m-%d') AS Data_transakcji, 
        'Usługa' AS Typ_transakcji, 
        ROUND(u.Cena, 2) AS Cena
        FROM transakcja_usluga t3
        JOIN usluga u ON t3.ID_Uslugi = u.ID_Uslugi
        JOIN pracownik p ON t3.ID_Pracownika = p.ID_Pracownika
        WHERE t3.Data_transakcji >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        ) AS subquery
        HAVING ID_Pracownika = ${id}`  
        db.query(`${query}`, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(results);
            }
        });
    });

//// FINISH ////

    app.all('*',(req,res) => {
        res.status(404);
    });

    app.listen(3000, () => {
        console.log(`Server is running on http://localhost:${3000}`);
    });
