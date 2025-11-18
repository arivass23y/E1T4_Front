const API_URL = '../../E1T4_Back/Kontrolagailuak/erabiltzailea-controller.php';
const API_KEY = '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1';
const botonEditar = document.getElementById('botoiaEditatu');

document.addEventListener('DOMContentLoaded', () => {
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
        const tbody = document.getElementById('profilaDatuak');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

function mostrarErabiltzaileak(erabiltzaileak) {
    // Taularen gorputza garbitu
    const tbody = document.getElementById('profilaDatuak');
    tbody.innerHTML = '';

    // erabiltzaileak taulan gehitu
    erabiltzaileak.forEach(async erabiltzailea => {
        const section = document.createElement('section');
        
        if (erabiltzailea.rola == "A"){
            erabiltzailea.rola = "Admin"
        } else if (erabiltzailea.rola == "U"){
            erabiltzailea.rola = "User"
        }

        section.innerHTML = `
            <section><h2>NAN<h2><p>${erabiltzailea.nan}</p></section>
            <section><h2>Izena<h2><p>${erabiltzailea.izena}</p></section>
            <section><h2>Abizena<h2><p>${erabiltzailea.abizena}</p></section>
            <section><h2>Erabiltzailea<h2><p>${erabiltzailea.erabiltzailea}</p></section>
            <h2>NAN<h2><p><b>············</b></p></section>
            <section><h2>Rola<h2><p>${erabiltzailea.rola}</p></section>
        `;
        tbody.appendChild(section);
    });
}

async function dialogPrepared(nan) {

    const current = await llamarAPI('GET', { nan });

        // Obtener referencias a los campos del dialog
        const dialog = document.getElementById('aldatuProfila');
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

function validarNAN(nan) {
    nan = nan.toUpperCase().trim();
    if (!/^\d{8}[A-Z]$/.test(nan)) return false;

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const numero = parseInt(nan.slice(0, 8), 10);
    const letra = nan.slice(-1);
    const letraCorrecta = letras[numero % 23];

    return letra === letraCorrecta;
}
