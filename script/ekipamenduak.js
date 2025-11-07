document.addEventListener("DOMContentLoaded", async () => {
    cargarEkipamenduak();
});

async function cargarEkipamenduak() {
    try {
        const response = await fetch('../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                '_method': 'GET',
                'HTTP_APIKEY': localStorage.getItem('apiKey') || '' // Asumiendo que guardas el apiKey en localStorage
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            mostrarEkipamenduak(data);
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error al cargar los equipamientos:', error);
    }
}

function mostrarEkipamenduak(ekipamenduak) {
    const tbody = document.getElementById('ekipamendua-body');
    tbody.innerHTML = '';

    ekipamenduak.forEach(ekipamendua => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${ekipamendua.id}</td>
            <td>${ekipamendua.izena}</td>
            <td>${ekipamendua.kategoria_izena || ekipamendua.idKategoria}</td>
            <td>${ekipamendua.deskribapena}</td>
            <td>${ekipamendua.marka || '-'}</td>
            <td>${ekipamendua.modelo || '-'}</td>
            <td>${ekipamendua.stock}</td>
            <td>
                <button onclick="editarEkipamendua(${ekipamendua.id})" class="edit-btn">
                    <img src="../img/editar.png" alt="Editar">
                </button>
                <button onclick="ezabatuEkipamendua(${ekipamendua.id})" class="delete-btn">
                    <img src="../img/borrar.png" alt="Borrar">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}