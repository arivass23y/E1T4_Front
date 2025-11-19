// Header konponentea kargatu eta funtzionalitateak gehitu
fetch('../components/header.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
        document.getElementsByClassName('nav-text')[0].textContent = "Biltegia";

    const menuToggle = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar');
    const botonCerrarSesion = document.getElementById('logout-btn');

    // Saioa itxi botoia funtzionalitatea gehitu
    botonCerrarSesion.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '../../E1T4_Front/pages/saioa-hasi.html';
    });

    // Menua ireki/itxi funtzionalitatea gehitu
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Menua kanpoan klik egitean itxi
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    })

    const page = window.location.pathname.split("/").pop();
    const navText = document.getElementById('nav-text');
    const searchWrapper = document.getElementById('search-wrapper');

    // Ordezko konfigurazioa orrialde bakoitzerako
    const pagesConfig = {
        "profila.html": {
            titulua: "Profila",
            search: false
        },
        "erabiltzaileak.html": {
            titulua: "Erabiltzaileak",
            search: false
        },
        "ekipamenduak.html": {
            titulua: "Ekipamendua",
            search: false,
            searchPlaceholder: "Equipamenduaren izena..."
        },
        "kategoriak.html": {
            titulua: "Kategoriak",
            search: false,
            searchPlaceholder: "Kategoriaren izena..."
        },
        "inbentarioak.html": {
            titulua: "Inbentarioa",
            search: false,
            searchPlaceholder: "Inbentarioren etiketa..."
        },
        "kokalekuak.html": {
            titulua: "Kokalekuak",
            search: false,
            searchPlaceholder: "Gelaren izena..."
        },
        "gelak.html": {
            titulua: "Gelak",
            search: false,
            searchPlaceholder: "Gelaren izena..."
        }
    };

    const config = pagesConfig[page] || { titulua: "Biltegia", search: true };

    navText.textContent = config.titulua;

    // Bilaketa barra konfiguratu
    if (config.search) {
        searchWrapper.style.display = "flex";
        if (config.searchPlaceholder) {
            document.getElementById("nav-search").placeholder = config.searchPlaceholder;
        }
    } else {
        searchWrapper.style.display = "none";
    }

});