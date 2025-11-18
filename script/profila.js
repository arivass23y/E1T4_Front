const API_URL = '../../E1T4_Back/Kontrolagailuak/erabiltzailea-controller.php';
let API_KEY = '';
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
    cargarErabiltzailea(sessionStorage.getItem('nan'));
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

async function cargarErabiltzailea(nan) {
    try {
        //APIra deitu eta emaitza jaso
        const resultado = await llamarAPI('GET', { nan });
        console.log(resultado);
        // Emaitza baliozkoa bada, erakutsi
        mostrarErabiltzaileak(resultado);

    } catch (err) {
        console.error('Error al cargar erabiltzaileak:', err);
        const tbody = document.getElementById('profilaDatuak');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

function mostrarErabiltzaileak(erabiltzailea) {
    const tbody = document.getElementById('profilaDatuak');
    tbody.innerHTML = '';

    if (erabiltzailea.rola == "A") erabiltzailea.rola = "Admin";
    if (erabiltzailea.rola == "U") erabiltzailea.rola = "User";

    tbody.innerHTML = `
        <section><h3>NAN</h3><p>${erabiltzailea.nan}</p></section>
        <section><h3>Izena</h3><p>${erabiltzailea.izena}</p></section>
        <section><h3>Abizena</h3><p>${erabiltzailea.abizena}</p></section>
        <section><h3>Erabiltzailea</h3><p>${erabiltzailea.erabiltzailea}</p></section>
        <section><h3>Pasahitza</h3><p><b>············</b></p></section>
        <section><h3>Rola</h3><p>${erabiltzailea.rola}</p></section>
    `;

    const buttonBody = document.getElementById('botoi-section');
    buttonBody.innerHTML = '';
    buttonBody.innerHTML = `
        <button id="botoia" onclick="dialogPrepared('${erabiltzailea.nan}')">Profila editatu</button>
    `;
}


async function dialogPrepared(nan) {

    const current = await llamarAPI('GET', { nan });

    // Obtener referencias a los campos del dialog
    const dialog = document.getElementById('aldatuProfila');
    const izenaInput = document.getElementById('izenaEditatu');
    const abizenaInput = document.getElementById('abizenaEditatu');
    const erabiltzaileaInput = document.getElementById('erabiltzaileaEditatu');
    const pasahitzaInput = document.getElementById('pasahitzaEditatu');
    
    let rola = current.rola;

    // Rellenar campos con los datos del equipo
    izenaInput.value = current.izena || '';
    abizenaInput.value = current.abizena || '';
    erabiltzaileaInput.value = current.erabiltzailea || '';
    pasahitzaInput.value = '';

    botonEditar.addEventListener('click', () => {
        aldatuErabiltzailea(nan,rola);
    });
    dialog.showModal()
}

async function aldatuErabiltzailea(nan,rola) {
    try {
        let izena = document.getElementById('izenaEditatu').value;
        let abizena = document.getElementById('abizenaEditatu').value;
        let erabiltzailea = document.getElementById('erabiltzaileaEditatu').value;
        let pasahitza = document.getElementById('pasahitzaEditatu').value;

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