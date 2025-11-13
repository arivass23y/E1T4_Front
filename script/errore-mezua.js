document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('toastContainer');
    const showBtn = document.getElementById('botoia');

    fetch('../components/errore-mesua.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;

            const toast = container.querySelector('toast');
            const closeBtn = toast.querySelector('#toast-close');

            showBtn.addEventListener('click', () => {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 10000);
            });

            closeBtn.addEventListener('click', () => {
                toast.classList.remove('show');
            });
        });
});
