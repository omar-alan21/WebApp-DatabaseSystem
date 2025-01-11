function handlePost(form, req, res) {
        const tableName = form.name;
        const data = req.body;

        const keys = Object.keys(data);
        const values = Object.values(data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = data[key];

            if (typeof value === 'object' && value !== null) {
                keys[i] = Object.keys(value)[0];
                values[i] = value[keys[i]];
            }
        }

        let new_kod = '';

        if (form.name === 'pracownik') {
            keys.push('Data_zatrudnienia')
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            values.push(formattedDate)
        }

        else if (form.name === 'produkt') {
            new_kod = `SET @new_kod = (SELECT MAX(Kod_Produktu) + 1 FROM produkt); `

            keys.push('Archiwalny');
            values.push(0);
            keys.push('Kod_Produktu');
            values.push('@new_kod');
        }

        else if (form.name === 'usluga') {
            new_kod = `SET @new_kod = (SELECT MAX(Kod_Uslugi) + 1 FROM usluga); `

            keys.push('Archiwalny');
            values.push(0);
            keys.push('Kod_Uslugi');
            values.push('@new_kod');
        }

        else if (form.name === 'klient') {
            keys.push('Data_dolaczenia')
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            values.push(formattedDate)
        }

        else if (form.name === 'typ_karnetu') {
            new_kod = `SET @new_kod = (SELECT MAX(Kod_Typu) + 1 FROM typ_karnetu); `

            keys.push('Archiwalny');
            values.push(0);
            keys.push('Kod_Typu');
            values.push('@new_kod');
        }

        else if (form.name === 'znizka') {
            new_kod = `SET @new_kod = (SELECT MAX(Kod_Znizki) + 1 FROM znizka); `

            keys.push('Archiwalny');
            values.push(0);
            keys.push('Kod_Znizki');
            values.push('@new_kod');
        }

        else if (form.name === 'czas_trwania_karnetu') {
            new_kod = `SET @new_kod = (SELECT MAX(Kod_Czasu_trwania) + 1 FROM czas_trwania_karnetu); `

            keys.push('Archiwalny');
            values.push(0);
            keys.push('Kod_Czasu_trwania');
            values.push('@new_kod');
        }

        else if (form.name === 'transakcja_usluga') {
            keys.push('Data_transakcji')
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            values.push(formattedDate)
        }

        else if (form.name === 'transakcja_karnet') {
            keys.push('Data_transakcji')
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            values.push(formattedDate)
        }

        const columns = keys.join(', ');
        const rows = values.map((value) => (value !== '@new_kod' ? `'${value}'` : `${value}`)).join(', ');
        const sql = `${new_kod} INSERT INTO ${form.name} (${columns}) VALUES (${rows})`;
        return sql
}

module.exports = handlePost