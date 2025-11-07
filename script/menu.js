document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuIcon && mobileMenu) {
        menuIcon.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
        });
    } else {
        console.error("No se encontró el elemento del menú.");
    }
});

