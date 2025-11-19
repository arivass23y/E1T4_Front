// Header konponentea kargatzea eta nabigazio barra kontrolatzea
fetch('components/header-index.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
        document.getElementsByClassName('nav-text')[0].textContent = "Biltegia";

    const menuToggle = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar');
    const botonCerrarSesion = document.getElementById('logout-btn-index');

    // Saioa itxi botoian klik egitean
    botonCerrarSesion.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = 'pages/saioa-hasi.html';
    });

    // Nabigazio barra erakutsi/ezkutatu
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Ezkutatu sidebar klik egiten denean kanpoan
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    })
});