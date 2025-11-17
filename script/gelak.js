const API_URL = '../../E1T4_Back/Kontrolagailuak/gela-controller.php';
const API_KEY = '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1';
const botonEditar = document.getElementById('botoia');

document.addEventListener('DOMContentLoaded', () => {
    cargarGelak();
});

async function llamarAPI(metodo, datos = {}) {
    //Bidaliko parametroak prestatu
    const params = new URLSearchParams(); 
    params.append('_method', metodo);
    params.append('HTTP_APIKEY', API_KEY);

    // Gehitu datuak soilik balioak daudenean
    for (const [key, value] of Object.entries(datos)) {
        if (value !== null && value !== undefined) {
            params.append(key, value);
        }
    }

    // APIra deitu
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    // Erantzuna prozesatu
    const text = await response.text();
    let resultado;
    try {
        resultado = JSON.parse(text);
    } catch (err) {
        // Errorea JSON bihurtzean: status + zerbitzariak itzuli duen testua
        console.error('API-ko eranztuna ez da JSON:', { status: response.status, text });
        throw new Error(`APIak testu/HTML itzuli du JSONaren ordez. Egoera: ${response.status}. Begiratu kontsola (Network) eta loga.`);
    }

    if (!response.ok) {
        // APIak itzuli duen errore-mezua barne hartu (badago)
        const mensaje = resultado?.error || `HTTP errorea ${response.status}`;
        throw new Error(mensaje);
    }

    return resultado;
}

async function cargarGelak() {
    try {
        //APIra deitu eta emaitza jaso
        const resultado = await llamarAPI('GET');
        // Emaitza baliozkoa bada, erakutsi
        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarGelak(resultado);
        }
    } catch (err) {
        console.error('Error al cargar gelak:', err);
        const tbody = document.getElementById('gela-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

function mostrarGelak(gelak) {
    // Taularen gorputza garbitu
    const tbody = document.getElementById('gela-body');
    tbody.innerHTML = '';

    // gelak taulan gehitu
    gelak.forEach(async gela => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${gela.id}</td>
            <td>${gela.izena}</td>
            <td>${gela.taldea}</td>
            <td> 
                <button onclick="dialogPrepared(${gela.id})" class="edit-btn">
                    <img src="../img/general/editatu.png" alt="Editar" class="editatu">
                </button>
                <button onclick="ezabatuGela(${gela.id})" class="delete-btn">
                    <img src="../img/general/ezabatu.png" alt="Borrar" class="editatu">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function dialogPrepared(id) {

    const current = await llamarAPI('GET', { id });

        // Obtener referencias a los campos del dialog
        const dialog = document.getElementById('aldatuGela');
        const izenaInput = document.getElementById('gelaIzenaAldatu');
        const taldeaInput = document.getElementById('taldeaAldatu');

        // Rellenar campos con los datos del equipo
        izenaInput.value = current.izena || '';
        taldeaInput.value = current.taldea || '';

        botonEditar.addEventListener('click', () => { 
            aldatuGela(id);
        });
        document.getElementById('aldatuGela').showModal()
}

async function aldatuGela(id) {
    try {
        let izena = document.getElementById('gelaIzenaAldatu').value;
        let taldea = document.getElementById('taldeaAldatu').value;

        console.log('ID aldatugela funtzioan:', id, izena, taldea);
        
        result = await llamarAPI('PUT', {
            id,
            izena,
            taldea,
        });
        const dialog = document.getElementById('aldatuGela');
        dialog.close();
        await cargarGelak();
        const data = await result.json();
    } catch (err) {
        console.error('Error:', err);
    }
}

async function ezabatuGela(id) {
    try {
        const result = await llamarAPI('DEL', { id });
        if (result.success) {
            alert('Gela ezabatuta');
            await cargarGelak();
        }
        return result;
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar la clase: ' + err.message);
        return null;
    }
}

async function crearGela() {
    try {
        const izena = document.getElementById('gelaIzenaSortu')?.value ?? '';
        const taldea = document.getElementById('taldeaSortu')?.value ?? '';

        // Validar campos obligatorios
        if (!izena.trim()) {
            alert('Izena derrigorrezkoa da');
            return;
        }

        const result = await llamarAPI('POST', {
            izena,
            taldea
        });
        console.log('Resultado de creargela:', result);
        if (result && result.success) {
            // Cerrar modal si existe
            const dialog = document.getElementById('sortuGela');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('gela sortuta');
            await cargarGelak();
        }
    } catch (err) {
        console.error('Error al crear gela:', err);
        alert('Error al crear el gela: ' + err.message);
    }
}