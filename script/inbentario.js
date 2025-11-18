const API_URL = '../../E1T4_Back/Kontrolagailuak/inbentarioa-controller.php';
const Ekipamendua_API_URL = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';
const Kokalekua_API_URL = '../../E1T4_Back/Kontrolagailuak/kokalekua-controller.php';
const API_KEY = '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1';
const botonEditar = document.getElementById('botoiaEditatu');

document.addEventListener('DOMContentLoaded', () => {
    cargarinbentarioak();
    cargarEkipamenduak();
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

async function cargarinbentarioak() {
    try {
        //APIra deitu eta emaitza jaso
        const resultado = await llamarAPI('GET');
        // Emaitza baliozkoa bada, erakutsi
        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarinbentarioak(resultado);
        }
    } catch (err) {
        console.error('Error al cargar inbentarioak:', err);
        const tbody = document.getElementById('inbentarioa-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

async function cargarEkipamendua(idEkipamendua) {
    let data = null; // declarar data fuera del try
    try {
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);
        params.append('id', idEkipamendua);

        const response = await fetch(Ekipamendua_API_URL, {
            method: 'POST', // si tu API requiere POST
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        data = JSON.parse(text);

    } catch (err) {
        console.error('Error:', err);
    }
    return data;
}

function mostrarinbentarioak(inbentarioak) {
    // Taularen gorputza garbitu
    const tbody = document.getElementById('inbentarioa-body');
    tbody.innerHTML = '';

    // inbentarioak taulan gehitu
    inbentarioak.forEach(async inbentarioa => {
        const tr = document.createElement('tr');
        let ekipamendu= await cargarEkipamendua(inbentarioa.idEkipamendu);
        
        tr.innerHTML = `
            <td>${inbentarioa.etiketa}</td>
            <td>${ekipamendu.izena}</td>
            <td>${inbentarioa.erosketaData}</td>
            <td> 
               <button onclick="dialogPrepared('${inbentarioa.etiketa}')" class="kudeaketak-btn" id="editatu-btn">
                    <img src="../img/general/editatu.png" alt="Editar" class="kudeaketak-img">
                </button>
                <button onclick="ezabatuinbentarioa('${inbentarioa.etiketa}')" class="kudeaketak-btn" id="ezabatu-btn">
                    <img src="../img/general/ezabatu.png" alt="Borrar" class="kudeaketak-img">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function dialogPrepared(etiketa) {

    const current = await llamarAPI('GET', { etiketa });

        // Obtener referencias a los campos del dialog
        const dialog = document.getElementById('aldatuinbentarioa');
        const etiketaInput = document.getElementById('inbentarioEtiketaAldatu');
        const ekipamenduaInput = document.getElementById('ekipamenduaAldatu');
        const dataInput = document.getElementById('dataAldatu');

        // Rellenar campos con los datos del equipo
        etiketaInput.value=current.etiketa || '';
        ekipamenduaInput.value = current.idEkipamendu || '';
        dataInput.value = current.erosketaData || '';

        botonEditar.addEventListener('click', () => { 
            aldatuInbentarioa(etiketa);
        });
        document.getElementById('aldatuInbentarioa').showModal()
}

async function aldatuInbentarioa(etiketa) {
    try {
        const ekipamendua = document.getElementById('ekipamenduaAldatu').value;
        const erosketaData = document.getElementById('dataAldatu').value;
        console.log(ekipamendua,erosketaData,etiketa);
        const formData = new FormData();
        formData.append("erosketaData", erosketaData);
        
        result = await llamarAPI('PUT', {
            etiketa,
            ekipamendua,
            erosketaData

        });
        const dialog = document.getElementById('aldatuinbentarioa');
        dialog.close();
        await cargarinbentarioak();
        const data = await result.json();
    } catch (err) {
        console.error('Error:', err);
    }
}

async function ezabatuinbentarioa(etiketa) {
    try {
        const result = await llamarAPI('DEL', { etiketa });
        if (result.success) {
            alert('inbentarioa ezabatuta');
            await cargarinbentarioak();
        }
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}

async function crearInbentarioa() {
    try {
        const etiketa = document.getElementById('inbentarioEtiketa').value;
        const ekipamendua = document.getElementById('ekipamendua').value;
        const erosketaData = document.getElementById('data').value;

        // Validar campos obligatorios
        if (!etiketa.trim() || !ekipamendua.trim() || !erosketaData.trim()) {
            alert('Datuak falta dira');
            return;
        }
        console.log(etiketa,ekipamendua,erosketaData);
        const result = await llamarAPI('POST', {
            etiketa,
            ekipamendua,
            erosketaData
        });
        console.log('Resultado de crearinbentarioa:', result);
        if (result && result.success) {
            // Cerrar modal si existe
            const dialog = document.getElementById('sortuinbentarioa');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('inbentarioa sortuta');
            await cargarinbentarioak();
        }
    } catch (err) {
        console.error('Error al crear inbentarioa:', err);
        alert('Error al crear el inbentarioa: ' + err.message);
    }
}

async function cargarEkipamenduak() {
    try {
        // Crear parámetros para la solicitud
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);

        // Hacer la petición
        const response = await fetch(Ekipamendua_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        // Obtener respuesta como texto
        const text = await response.text();

        // Parsear JSON
        let ekipamendus = JSON.parse(text);

        // Obtener el select
        const select = document.getElementById('ekipamendua');
        let selectAldatu = document.getElementById('ekipamenduaAldatu');

        // Llenar select con las categorías
        if (select && Array.isArray(ekipamendus)) {
            ekipamendus.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.izena;
                select.appendChild(option);
                selectAldatu.appendChild(option.cloneNode(true));
            });
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

async function cargarKokalekuak() {
    document.getElementById('kokalekuAktiboak').showModal();
    try {
        // Crear parámetros para la solicitud
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);

        // Hacer la petición
        const response = await fetch(Kokalekua_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        // Obtener respuesta como texto
        const text = await response.text();

        // Parsear JSON
        let kokalekuak = JSON.parse(text);

        const tbody = document.getElementById('inbentarioa-body');
        tbody.innerHTML = '';

        // inbentarioak taulan gehitu
        kokalekuak.forEach(async inbentarioa => {
            const tr = document.createElement('tr');
        
            tr.innerHTML = `
            <td>${inbentarioa.etiketa}</td>
            <td>${inbentarioa.idGela}</td>
            <td>${inbentarioa.hasieraData}</td>
            <td>${inbentarioa.amaieraData}</td>
        `;
        tbody.appendChild(tr);
    });


    } catch (err) {
        console.error('Error:', err);
    }
}

