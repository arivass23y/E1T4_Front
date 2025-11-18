fetch('components/header-index.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
        document.getElementsByClassName('nav-text')[0].textContent = "Biltegia";

    const menuToggle = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar');
    const botonCerrarSesion = document.getElementById('logout-btn-index');

    botonCerrarSesion.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '../E1T4_Front/pages/saioa-hasi.html';
    });

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    })
});