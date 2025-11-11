// Configuración global
const API_URL = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';
const API_KEY = '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1';

// Función auxiliar reutilizable para llamadas a la API
async function llamarAPI(metodo, datos = {}) {
    const params = new URLSearchParams();
    params.append('_method', metodo);
    params.append('HTTP_APIKEY', API_KEY);

    for (const [key, value] of Object.entries(datos)) {
        if (value !== null && value !== undefined) {
            params.append(key, value);
        }
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    const text = await response.text();
    let resultado;
    try {
        resultado = JSON.parse(text);
    } catch (err) {
        // Log completo para depuración: status + texto devuelto por el servidor
        console.error('Respuesta no-JSON desde la API:', { status: response.status, text });
        throw new Error(`La API devolvió texto/HTML en lugar de JSON. Estado: ${response.status}. Revisa la consola (Network) y el log.`);
    }

    if (!response.ok) {
        // Incluir el mensaje de error que devuelva la API (si lo hay)
        const mensaje = resultado?.error || `Error HTTP ${response.status}`;
        throw new Error(mensaje);
    }

    return resultado;
}

async function cargarEkipamenduak() {
    try {
        const resultado = await llamarAPI('GET');
        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarEkipamenduak(resultado);
        }
    } catch (err) {
        console.error('Error al cargar ekipamenduak:', err);
        const tbody = document.getElementById('ekipamendua-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
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
                    <img src="../img/general/editatu.png" alt="Editar">
                </button>
                <button onclick="ezabatuEkipamendua(${ekipamendua.id})" class="delete-btn">
                    <img src="../img/general/ezabatu.png" alt="Borrar">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editarEkipamendua(id) {
    (async () => {
        try {
            const current = await llamarAPI('GET', { id });

            const izena = prompt('Nombre:', current.izena);
            if (izena === null) return;
            const deskribapena = prompt('Descripción:', current.deskribapena);
            if (deskribapena === null) return;
            const marka = prompt('Marca (opcional):', current.marka || '');
            if (marka === null) return;
            const modelo = prompt('Modelo (opcional):', current.modelo || '');
            if (modelo === null) return;
            const stock = prompt('Stock:', current.stock);
            if (stock === null) return;
            const idKategoria = prompt('ID de categoría:', current.idKategoria || current.kategoria_izena || '');
            if (idKategoria === null) return;

            // Validar campos obligatorios
            if (!izena.trim() || !deskribapena.trim() || !stock.toString().trim() || !idKategoria.toString().trim()) {
                alert('Izena, deskribapena, stock eta idKategoria derrigorrezkoak dira');
                return;
            }

            const result = await llamarAPI('PUT', { id, izena, deskribapena, marka, modelo, stock, idKategoria });
            if (result.success) {
                alert('Ekipamendua eguneratuta');
                await cargarEkipamenduak();
            }
        } catch (err) {
            console.error('Error en editarEkipamendua:', err);
            alert('Error al actualizar el equipo: ' + err.message);
        }
    })();
}

async function ezabatuEkipamendua(id) {
    try {
        const result = await llamarAPI('DEL', { id });
        if (result.success) {
            alert('Ekipamendua ezabatuta');
            await cargarEkipamenduak();
        }
        return result;
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}

// Llamar a la API al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarEkipamenduak();
});

// Crear nuevo ekipamendua desde el modal
async function crearEkipamendua() {
    try {
        const izena = document.getElementById('ekipamenduIzena')?.value ?? '';
        const idKategoria = document.getElementById('kategoria')?.value ?? '';
        const deskribapena = document.getElementById('deskribapena')?.value ?? '';
        const marka = document.getElementById('marka')?.value ?? '';
        const modelo = document.getElementById('modeloa')?.value ?? '';
        const stock = document.getElementById('stock')?.value ?? '';

        // Validar campos obligatorios
        if (!izena.trim() || !deskribapena.trim() || !stock.toString().trim() || !idKategoria.toString().trim()) {
            alert('Izena, deskribapena, stock eta idKategoria derrigorrezkoak dira');
            return;
        }

        const result = await llamarAPI('POST', {
            izena,
            deskribapena,
            marka,
            modelo,
            stock,
            idKategoria
        });

        if (result && result.success) {
            // Cerrar modal si existe
            const dialog = document.getElementById('sortuEkipamendua');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('Ekipamendua sortuta');
            await cargarEkipamenduak();
        }
    } catch (err) {
        console.error('Error al crear ekipamendua:', err);
        alert('Error al crear el equipo: ' + err.message);
    }
}
