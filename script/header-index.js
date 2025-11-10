fetch('components/header-index.html')
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
});