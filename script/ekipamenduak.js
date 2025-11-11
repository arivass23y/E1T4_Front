// Configuración global
const API_URL = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';
const API_KEY = '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1';

// Función auxiliar reutilizable para llamadas a la API
async function llamarAPI(metodo, datos = {}) {
    try {
        const params = new URLSearchParams();
        params.append('_method', metodo);
        params.append('HTTP_APIKEY', API_KEY);

        // Añadir datos adicionales
        for (const [key, value] of Object.entries(datos)) {
            if (value !== null && value !== undefined) {
                params.append(key, value);
            }
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        });

        const text = await response.text();
        let resultado = null;
        try {
            resultado = JSON.parse(text);
        } catch (err) {
            console.error('La respuesta no es JSON. Estado:', response.status);
            console.error('Content-Type:', response.headers.get('content-type'));
            console.error('Respuesta (texto):', text);

            const tbody = document.getElementById('ekipamendua-body');
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="8">Error al obtener datos: la API devolvió HTML o texto en lugar de JSON. Revisa la consola (Network) y el archivo PHP.</td></tr>`;
            }
            return null;
        }

        if (!response.ok) {
            console.error(`Error en la petición: ${response.status}`, resultado);
            return null;
        }

        console.log('Respuesta de la API:', resultado);

        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarEkipamenduak(resultado);
        }

        return resultado;
    } catch (error) {
        console.error('Hubo un error al enviar los datos:', error);
        return null;
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
    // Abrir prompts para editar el equipo. Se podría mejorar con un modal más adelante.
    (async () => {
        try {
            const url = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';

            // Primero obtener el equipo actual
            const getData = new URLSearchParams();
            getData.append('_method', 'GET');
            getData.append('HTTP_APIKEY', '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1');
            getData.append('id', id);

            const getResp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: getData.toString()
            });

            const getText = await getResp.text();
            let current = null;
            try {
                current = JSON.parse(getText);
            } catch (err) {
                console.error('Error al obtener equipo (no JSON):', getResp.status, getText);
                alert('No se pudo obtener los datos del equipo. Revisa la consola.');
                return;
            }

            if (!getResp.ok) {
                alert('Error al obtener el equipo: ' + (current?.error || getResp.status));
                return;
            }

            // Pedir datos al usuario usando prompt (sencillo). Cancelar en cualquier prompt aborta la operación.
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

            // Enviar actualización
            const putData = new URLSearchParams();
            putData.append('_method', 'PUT');
            putData.append('HTTP_APIKEY', '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1');
            putData.append('id', id);
            putData.append('izena', izena);
            putData.append('deskribapena', deskribapena);
            putData.append('marka', marka);
            putData.append('modelo', modelo);
            putData.append('stock', stock);
            putData.append('idKategoria', idKategoria);

            const putResp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: putData.toString()
            });

            const putText = await putResp.text();
            let result = null;
            try {
                result = JSON.parse(putText);
            } catch (err) {
                console.error('La respuesta no es JSON. Estado:', putResp.status);
                console.error('Content-Type:', putResp.headers.get('content-type'));
                console.error('Respuesta (texto):', putText);
                alert('Error al actualizar el equipo. Revisa la consola para más detalles.');
                return;
            }

            if (!putResp.ok) {
                alert('Error al actualizar el equipo: ' + (result?.error || 'Error desconocido'));
                return;
            }

            if (result.success) {
                alert('Ekipamendua eguneratuta');
                await cargarEkipamenduak();
            }

        } catch (error) {
            console.error('Error en editarEkipamendua:', error);
            alert('Hubo un error al intentar actualizar el equipo');
        }
    })();
}

async function ezabatuEkipamendua(id) {
    try {
        const url = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';
        console.log(id);
        const data = new URLSearchParams();
        data.append('_method', 'DEL'); 
        data.append('HTTP_APIKEY', '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1'); 
        data.append('id', id);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        });

        const text = await response.text();
        let resultado = null;
        try {
            resultado = JSON.parse(text);
        } catch (err) {
            console.error('La respuesta no es JSON. Estado:', response.status);
            console.error('Content-Type:', response.headers.get('content-type'));
            console.error('Respuesta (texto):', text);
            alert('Error al eliminar el equipo. Revisa la consola para más detalles.');
            return null;
        }

        if (!response.ok) {
            console.error(`Error en la petición: ${response.status}`, resultado);
            alert('Error al eliminar el equipo: ' + (resultado?.error || 'Error desconocido'));
            return null;
        }

        console.log('Respuesta de la API:', resultado);

        if (resultado.success) {
            // Si la eliminación fue exitosa, recargar la tabla
            await cargarEkipamenduak();
        }

        return resultado;
    } catch (error) {
        console.error('Hubo un error al eliminar:', error);
        alert('Error al intentar eliminar el equipo');
        return null;
    }
}
