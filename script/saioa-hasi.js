form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Balidazioak
    if (!/^[a-zA-Z\s]+$/.test(data.erabiltzailea)) {
        showToast('Erabiltzailea ezin du izan karakter bereziak', 'error');
        return; 
    }

    try {
        const response = await fetch('../../E1T4_Back/Kontrolagailuak/erabiltzailea-controller.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showToast(result.success, 'success');
        } else {
            showToast(result.error, 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
    }
});
