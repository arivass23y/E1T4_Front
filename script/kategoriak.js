const API_URL = '../../E1T4_Back/Kontrolagailuak/kategoria-controller.php';
let API_KEY = '';
const botonEditar = document.getElementById('botoiaEditatu');

document.addEventListener('DOMContentLoaded', () => {
    // Saio aktiboa egiaztatu eta API_KEY lortu
    const apiKey = sessionStorage.getItem('apiKey');
    if (!apiKey) { // Saio aktiborik ez badago, login orrialdera joan
        alert('Ez dago saio aktiborik, hasi saioa berriro.');
        window.location.href = 'saioa-hasi.html';
    }
    else{ // Bestela, API_KEY aldagaian gorde
        API_KEY = apiKey;
    }
    // Eta kategoriak kargatu
    cargarKategoriak();
});

// API deia egiteko funtzio orokorra
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

// Kategoriak kargatu eta erakutsi
async function cargarKategoriak() {
    try {
        //APIra deitu eta emaitza jaso
        const resultado = await llamarAPI('GET');
        // Emaitza baliozkoa bada, erakutsi
        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarKategoriak(resultado);
        }
    } catch (err) {
        // Erroreak kudeatu
        console.error('Error al cargar kategoriak:', err);
        const tbody = document.getElementById('kategoria-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

// Kategoriak taulan erakutsi
function mostrarKategoriak(kategoriak) {
    // Taularen gorputza garbitu
    const tbody = document.getElementById('kategoria-body');
    tbody.innerHTML = '';

    // kategoriak taulan gehitu
    kategoriak.forEach(async kategoria => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${kategoria.id}</td>
            <td>${kategoria.izena}</td>
            <td>
                <section> 
                    <button onclick="dialogPrepared(${kategoria.id})" class="kudeaketak-btn" id="editatu-btn">
                        <img src="../img/general/editatu.png" alt="Editar" class="kudeaketak-img">
                    </button>
                    <button onclick="ezabatuKategoria(${kategoria.id})" class="kudeaketak-btn" id="ezabatu-btn">
                        <img src="../img/general/ezabatu.png" alt="Borrar" class="kudeaketak-img">
                    </button>
                </section>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Editatu dialogoa prestatu
async function dialogPrepared(id) {

    const current = await llamarAPI('GET', { id });

        // Obtener referencias a los campos del dialog
        const dialog = document.getElementById('editatuKategoria');
        const izenaInput = document.getElementById('kategoriaIzenaEditatu');

        // Rellenar campos con los datos del equipo
        izenaInput.value = current.izena || '';

        botonEditar.addEventListener('click', () => { 
            aldatuKategoria(id);
        });
        document.getElementById('editatuKategoria').showModal()
}

// Kategoria aldatu
async function aldatuKategoria(id) {
    try {
        let izena = document.getElementById('kategoriaIzenaEditatu').value;

        console.log('ID aldatuKategoria funtzioan:', id, izena);
        
        result = await llamarAPI('PUT', {
            id,
            izena,
        });
        // Emaitza baliozkoa bada, kategoriak berriro kargatu
        if (result.success) {
            alert('Kategoria aldatu da');
            const dialog = document.getElementById('editatuKategoria');
            dialog.close();
            await cargarKategoriak();
            const data = await result.json();
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

// Kategoria ezabatu
async function ezabatuKategoria(id) {
    try {
        // API deia egin DEL metodoarekin
        const result = await llamarAPI('DEL', { id });
        if (result.success) { // Emaitza baliozkoa bada, kategoriak berriro kargatu
            alert('Kategoria ezabatuta');
            await cargarKategoriak();
        }
        return result;
    } catch (err) { // Erroreak ateratzen badira, kudeatu
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}

// Kategoria sortu
async function crearKategoria() {
    try {
        const izena = document.getElementById('kategoriaIzenaSortu')?.value ?? '';

        // Baliodun eremuak egiaztatu
        if (!izena.trim()) {
            alert('Izena derrigorrezkoa da');
            return;
        }

        const result = await llamarAPI('POST', {
            izena
        });
        console.log('Resultado de crearKategoria:', result);
        if (result && result.success) {
            // Modal itxi eta kategoriak berriro kargatu
            const dialog = document.getElementById('sortuKategoria');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('Kategoria sortuta');
            await cargarKategoriak();
        }
    } catch (err) {
        console.error('Error al crear kategoria:', err);
        alert('Error al crear el kategoria: ' + err.message);
    }
}