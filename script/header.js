fetch('../components/header.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
        document.getElementsByClassName('nav-text')[0].textContent = "Biltegia";

    const menuToggle = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    })

    const page = window.location.pathname.split("/").pop();
    const navText = document.getElementById('nav-text');
    const searchWrapper = document.getElementById('search-wrapper');

    const pagesConfig = {
        "index.html": {
            title: "Biltegia",
            search: false
        },
        "profila.html": {
            title: "Profila",
            search: false
        },
        "ekipamenduak.html": {
            title: "Ekipamendua",
            search: true,
            searchPlaceholder: "Equipamenduaren izena..."
        },
        "kategoriak.html": {
            title: "Kategoriak",
            search: true,
            searchPlaceholder: "Kategoriaren izena..."
        },
        "inbentarioak.html": {
            title: "Inbentarioa",
            search: true,
            searchPlaceholder: "Inbentarioren etiketa..."
        },
        "gelak.html": {
            title: "Gelak",
            search: true,
            searchPlaceholder: "Gelaren izena..."
        }
    };

    const config = pagesConfig[page] || { title: "Biltegia", search: true };

    navText.textContent = config.title;

    if (config.search) {
        searchWrapper.style.display = "flex";
        if (config.searchPlaceholder) {
            document.getElementById("nav-search").placeholder = config.searchPlaceholder;
        }
    } else {
        searchWrapper.style.display = "none";
    }

});