const formData = [
    {
        name: 'pracownik',
        title: 'Dodaj Pracownika',
        columns: [
            {
                type: 'table', 
                name: 'stanowisko'
            },
            {
                type: 'text', 
                name: 'Identyfikator'
            },
            {
                type: 'text', 
                name: 'Imie'
            },
            {
                type: 'text', 
                name: 'Nazwisko'
            },
            {
                type: 'email', 
                name: 'Adres_email'
            },
            {
                type: 'phone', 
                name: 'Numer_telefonu'
            },
            {
                type: 'number', 
                name: 'Pensja'
            }
        ],
        allowed: ['Menadżer']
    },
    {
        name: 'klient',
        title: 'Dodaj Klienta',
        columns: [
            {
                type: 'text', 
                name: 'Imie'
            },
            {
                type: 'text', 
                name: 'Nazwisko'
            },
            {
                type: 'phone', 
                name: 'Numer_telefonu'
            }
        ]
    },
    {
        name: 'produkt',
        title: 'Dodaj Produkt',
        columns: [
            {
                type: 'text', 
                name: 'Nazwa'
            },
            {
                type: 'number', 
                name: 'Cena'
            },
            {
                type: 'number', 
                name: 'Stan_na_magazynie'
            }
        ],
        allowed: ['Menadżer']
    },
    {
        name: 'typ_karnetu',
        title: 'Dodaj Typ Karnetu',
        columns: [
            {
                type: 'text', 
                name: 'Typ'
            },
            {
                type: 'number', 
                name: 'Cena'
            }
        ],
        allowed: ['Menadżer']
    },
    {
        name: 'znizka',
        title: 'Dodaj Zniżke',
        columns: [
            {
                type: 'text', 
                name: 'Nazwa'
            },
            {
                type: 'number', 
                name: 'Znizka'
            }
        ],
        allowed: ['Menadżer']
    },
    {
        name: 'czas_trwania_karnetu',
        title: 'Dodaj Czas Karnetu',
        columns: [
            {
                type: 'number', 
                name: 'Liczba_miesiecy'
            }
        ],
        allowed: ['Menadżer']
    },
    {
        name: 'usluga',
        title: 'Dodaj Usługe',
        columns: [
            {
                type: 'text', 
                name: 'Nazwa'
            },
            {
                type: 'number', 
                name: 'Cena'
            }
        ],
        allowed: ['Menadżer']
    },
    {
        name: 'transakcja_usluga'
    },
    {
        name: 'transakcja_karnet'
    }
]

module.exports = formData