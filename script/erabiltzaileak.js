const API_URL = '../../E1T4_Back/Kontrolagailuak/erabiltzailea-controller.php';
let API_KEY = '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1';
const botonEditar = document.getElementById('botoiaEditatu');

document.addEventListener('DOMContentLoaded', () => {
    const apiKey = sessionStorage.getItem('apiKey');
    if (!apiKey) {
        alert('Ez dago saio aktiborik, hasi saioa berriro.');
        window.location.href = 'saioa-hasi.html';
    }
    else{
        API_KEY = apiKey;
    }
    cargarErabiltzaileak();
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

async function cargarErabiltzaileak() {
    try {
        //APIra deitu eta emaitza jaso
        const resultado = await llamarAPI('GET');
        // Emaitza baliozkoa bada, erakutsi
        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarErabiltzaileak(resultado);
        }
    } catch (err) {
        console.error('Error al cargar erabiltzaileak:', err);
        const tbody = document.getElementById('erabiltzaileak-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

function mostrarErabiltzaileak(erabiltzaileak) {
    // Taularen gorputza garbitu
    const tbody = document.getElementById('erabiltzaileak-body');
    tbody.innerHTML = '';

    // erabiltzaileak taulan gehitu
    erabiltzaileak.forEach(async erabiltzailea => {
        const tr = document.createElement('tr');
        
        if (erabiltzailea.rola == "A"){
            erabiltzailea.rola = "Admin"
        } else if (erabiltzailea.rola == "U"){
            erabiltzailea.rola = "User"
        }

        tr.innerHTML = `
            <td>${erabiltzailea.nan}</td>
            <td>${erabiltzailea.izena}</td>
            <td>${erabiltzailea.abizena}</td>
            <td>${erabiltzailea.erabiltzailea}</td>
            <td><b>············</b></td>
            <td>${erabiltzailea.rola}</td>
            <td>
                <section> 
                    <button onclick="dialogPrepared('${erabiltzailea.nan}')" class="kudeaketak-btn" id="editatu-btn">
                        <img src="../img/general/editatu.png" alt="Editar" class="kudeaketak-img">
                    </button>
                    <button onclick="ezabatuErabiltzailea('${erabiltzailea.nan}')" class="kudeaketak-btn" id="ezabatu-btn">
                        <img src="../img/general/ezabatu.png" alt="Borrar" class="kudeaketak-img">
                    </button>
                </section>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function dialogPrepared(nan) {

    const current = await llamarAPI('GET', { nan });

        // Obtener referencias a los campos del dialog
        const dialog = document.getElementById('aldatuErabiltzailea');
        const izenaInput = document.getElementById('izenaEditatu');
        const abizenaInput = document.getElementById('abizenaEditatu');
        const erabiltzaileaInput = document.getElementById('erabiltzaileaEditatu');
        const pasahitzaInput = document.getElementById('pasahitzaEditatu');
        const rolaInput = document.getElementById('rolaEditatu');

        // Rellenar campos con los datos del equipo
        izenaInput.value = current.izena || '';
        abizenaInput.value = current.abizena || '';
        erabiltzaileaInput.value = current.erabiltzailea || '';
        pasahitzaInput.value = '';
        const rolak = { "A": "Admin", "U": "User" };
        rolaInput.value = rolak[current.rola] || '';

        botonEditar.addEventListener('click', () => { 
            aldatuErabiltzailea(nan);
        });
        dialog.showModal()
}

async function aldatuErabiltzailea(nan) {
    try {
        let izena = document.getElementById('izenaEditatu').value;
        let abizena= document.getElementById('abizenaEditatu').value;
        let erabiltzailea = document.getElementById('erabiltzaileaEditatu').value;
        let pasahitza = document.getElementById('pasahitzaEditatu').value;
        let rola = document.getElementById('rolaEditatu').value;

        if (rola == "Admin"){
            rola = "A"
        } else if (rola == "User"){
            rola = "U"
        }

        console.log('ID aldatuErabiltzailea funtzioan:', nan, izena, abizena, erabiltzailea, pasahitza, rola);
        
        result = await llamarAPI('PUT', {
            nan,
            izena,
            abizena,
            erabiltzailea,
            pasahitza,
            rola
        });
        const dialog = document.getElementById('aldatuErabiltzailea');
        dialog.close();
        await cargarErabiltzaileak();
        const data = await result.json();
    } catch (err) {
        console.error('Error:', err);
    }
}

async function ezabatuErabiltzailea(nan) {
    try {
        const result = await llamarAPI('DEL', { nan });
        if (result.success) {
            alert('Erabiltzailea ezabatuta');
            await cargarErabiltzaileak();
        }
        return result;
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}

async function crearErabiltzailea() {
    try {
        const nan = document.getElementById('NANSortu')?.value ?? '';
        const izena = document.getElementById('izenaSortu')?.value ?? '';
        const abizena = document.getElementById('abizenaSortu')?.value ?? '';
        const erabiltzailea = document.getElementById('erabiltzaileaSortu')?.value ?? '';
        const pasahitza = document.getElementById('pasahitzaSortu')?.value ?? '';
        let rola = document.getElementById('rolaSortu')?.value ?? '';

        // Validar campos obligatorios
        if (!nan.trim() || !izena.trim() || !abizena.trim() || !erabiltzailea.trim() || !pasahitza.trim() || !rola.trim()) {
            alert('NAN, izena, abizena, erabiltzailea, pasahitza eta rola derrigorrezkoak dira');
            return;
        }

        if (!validarNAN(nan)){
            alert('NAN inválido');
            return;
        }

        if (rola == "Admin"){
            rola = "A"
        } else if (rola == "User"){
            rola = "U"
        }

        const result = await llamarAPI('POST', {
            nan,
            izena,
            abizena,
            erabiltzailea,
            pasahitza,
            rola
        });
        console.log('Resultado de crearErabiltzailea:', result);
        if (result && result.success) {
            // Cerrar modal si existe
            const dialog = document.getElementById('sortuErabiltzailea');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('erabiltzailea sortuta');
            await cargarErabiltzaileak();
        }
    } catch (err) {
        console.error('Error al crear erabiltzailea:', err);
        alert('Error al crear el erabiltzailea: ' + err.message);
    }
}

function validarNAN(nan) {
    nan = nan.toUpperCase().trim();
    if (!/^\d{8}[A-Z]$/.test(nan)) return false;

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const numero = parseInt(nan.slice(0, 8), 10);
    const letra = nan.slice(-1);
    const letraCorrecta = letras[numero % 23];

    return letra === letraCorrecta;
}
