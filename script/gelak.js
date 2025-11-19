const API_URL = '../../E1T4_Back/Kontrolagailuak/gela-controller.php';
let API_KEY = '';
const botonEditar = document.getElementById('botoia');

document.addEventListener('DOMContentLoaded', () => {
    const apiKey = sessionStorage.getItem('apiKey');
    if (!apiKey) {
        alert('Ez dago saio aktiborik, hasi saioa berriro.');
        window.location.href = 'saioa-hasi.html';
    }
    else{
        API_KEY = apiKey;
    }
    cargarGelak();
});

// Funtzio orokorra APIra deitzeko
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

// Gelak kargatu eta erakutsi
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

// Gelak taulan erakutsi
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
                <section>
                    <button onclick="dialogPrepared(${gela.id})" class="kudeaketak-btn" id="editatu-btn">
                        <img src="../img/general/editatu.png" alt="Editar" class="kudeaketak-img">
                    </button>
                    <button onclick="ezabatuGela(${gela.id})" class="kudeaketak-btn" id="ezabatu-btn">
                        <img src="../img/general/ezabatu.png" alt="Borrar" class="kudeaketak-img">
                    </button>
                </section>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Gela aldatu dialogoa prestatu
async function dialogPrepared(id) {

    // Lortu gela aktuala APItik GET bidez
    const current = await llamarAPI('GET', { id });

        // Lortu elementuak dialogoan
        const dialog = document.getElementById('aldatuGela');
        const izenaInput = document.getElementById('gelaIzenaAldatu');
        const taldeaInput = document.getElementById('taldeaAldatu');

        // Kanpoak balioak ezarri
        izenaInput.value = current.izena || '';
        taldeaInput.value = current.taldea || '';

        // Botoiaren event listener berria ezarri
        botonEditar.addEventListener('click', () => { 
            aldatuGela(id);
        });
        document.getElementById('aldatuGela').showModal()
}

// Gela aldatu funtzioa
async function aldatuGela(id) {
    try {
        // Datuak lortu formularioatik
        let izena = document.getElementById('gelaIzenaAldatu').value;
        let taldea = document.getElementById('taldeaAldatu').value;

        console.log('ID aldatugela funtzioan:', id, izena, taldea);
        
        // Datuak bidali APIra PUT bidez
        result = await llamarAPI('PUT', {
            id,
            izena,
            taldea,
        });
        if (result.success) { // Egiaztatu eragiketa arrakastatsua izan dela
            alert('Gela aldatu da');
            const dialog = document.getElementById('aldatuGela');
            dialog.close();
            await cargarGelak();
            const data = await result.json();
        }

    } catch (err) { // Erroreak kudeatu
        console.error('Error:', err);
    }
}

// Gela ezabatu funtzioa
async function ezabatuGela(id) {
    try { // APIra deitu DELETE bidez
        const result = await llamarAPI('DEL', { id });
        if (result.success) {
            alert('Gela ezabatuta');
            await cargarGelak();
        }
        return result;
    } catch (err) { // Erroreak kudeatu
        console.error('Error al eliminar:', err);
        alert('Error al eliminar la clase: ' + err.message);
        return null;
    }
}

// Gela sortu funtzioa
async function crearGela() {
    try {
        // Datuak lortu formularioatik
        const izena = document.getElementById('gelaIzenaSortu')?.value ?? '';
        const taldea = document.getElementById('taldeaSortu')?.value ?? '';

        // Datuak balidatu
        if (!izena.trim()) {
            alert('Izena derrigorrezkoa da');
            return;
        }

        // Datuak bidali APIra POST bidez
        const result = await llamarAPI('POST', {
            izena,
            taldea
        });
        console.log('Resultado de creargela:', result);
        if (result && result.success) {
            // Modala itxi eta gelak berriro kargatu
            const dialog = document.getElementById('sortuGela');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('gela sortuta');
            await cargarGelak();
        }
    } catch (err) { // Erroreak kudeatu
        console.error('Error al crear gela:', err);
        alert('Error al crear el gela: ' + err.message);
    }
}