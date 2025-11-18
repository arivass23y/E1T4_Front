const API_URL = '../../E1T4_Back/Kontrolagailuak/inbentarioa-controller.php';
const Ekipamendua_API_URL = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';
const Kokalekua_API_URL = '../../E1T4_Back/Kontrolagailuak/kokalekua-controller.php';
const Gela_API_URL = '../../E1T4_Back/Kontrolagailuak/gela-controller.php';
let API_KEY = "";
const botonCrear = document.getElementById('botoiaAldatu');
const botonKokalekuaAldatu = document.getElementById('botoiaKokalekuaAldatu');

document.addEventListener('DOMContentLoaded', () => {

    const apiKeyz = "9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1";
    sessionStorage.setItem('apiKey',apiKeyz);
    const apiKey = sessionStorage.getItem('apiKey');
    if (!apiKey) {
        alert('No hay sesión activa, vuelve a iniciar sesión.');
        window.location.href = 'login.html';
    }
    else{
        API_KEY = apiKey;
    }

    cargarinbentarioak();
    cargarEkipamenduak();
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

        botonCrear.addEventListener('click', () => { 
            aldatuInbentarioa(etiketa);
        });
        document.getElementById('aldatuInbentarioa').showModal()
}

async function aldatuInbentarioa(etiketa) {
    try {
        const ekipamendua = document.getElementById('ekipamenduaAldatu').value;
        const erosketaData = document.getElementById('dataAldatu').value;
        const formData = new FormData();
        formData.append("erosketaData", erosketaData);
        
        result = await llamarAPI('PUT', {
            etiketa,
            ekipamendua,
            erosketaData

        });
        const dialog = document.getElementById('aldatuinbentarioa');
        const data = await result.json();
        alert(data.message);
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



async function cargarGelak() {
    try {
        // Crear parámetros para la solicitud
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);

        // Hacer la petición
        const response = await fetch(Gela_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        // Obtener respuesta como texto
        const text = await response.text();

        // Parsear JSON
        let ekipamendus = JSON.parse(text);

        // Obtener el select
        const select = document.getElementById('gelaSortu');
        let selectAldatu = document.getElementById('gelaAldatu');

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

async function cargarGela(idGela) {
    let data = null; // declarar data fuera del try
    try {
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);
        params.append('id', idGela);

        const response = await fetch(Gela_API_URL, {
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



async function llamarAPIKokalekuak(metodo, datos = {}) {
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
    const response = await fetch(Kokalekua_API_URL, {
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

async function cargarKokalekuak() {
    document.getElementById('kokalekuAktiboak').showModal();
    try {
       //APIra deitu eta emaitza jaso
        const kokalekuak = await llamarAPIKokalekuak('GET');
        // Emaitza baliozkoa bada, erakutsi
        
        const kbody = document.getElementById('kokalekua-body');
        kbody.innerHTML = '';

        // kokalekuak taulan gehitu
        kokalekuak.forEach(async kokalekua => {
            const tr = document.createElement('tr');
            let gela= await cargarGela(kokalekua.idGela);
            tr.innerHTML = `
            <td>${kokalekua.etiketa}</td>
            <td>${gela.izena}</td>
            <td>${kokalekua.hasieraData}</td>
            <td></td>
            <td> 
               <button onclick="dialogPreparedKokalekua('${kokalekua.etiketa}', '${kokalekua.hasieraData}')" class="kudeaketak-btn" id="editatu-btn"">
                    <img src="../img/general/editatu.png" alt="Editar" class="kudeaketak-img">
                </button>
                <button onclick="ezabatuKokalekua('${kokalekua.etiketa}', '${kokalekua.hasieraData}')" class="kudeaketak-btn" id="ezabatu-btn">
                    <img src="../img/general/ezabatu.png" alt="Borrar" class="kudeaketak-img">
                </button>
            </td>

        `;
        kbody.appendChild(tr);
    });

    } catch (err) {
        console.error('Error:', err);
    }
}

async function dialogPreparedKokalekua(etiketa,hasieraData) {
    const current = await llamarAPIKokalekuak('GET', { etiketa, hasieraData });

        // Obtener referencias a los campos del dialog
        const etiketaInput = document.getElementById('EtiketaKokalekuaAldatu');
        const klaseaInput = document.getElementById('klaseaAldatu');

        // Rellenar campos con los datos del equipo
        etiketaInput.value=etiketa || '';
        klaseaInput.value = current.idGela || '';
        console.log(etiketa, hasieraData);
        botonKokalekuaAldatu.addEventListener('click', () => { 
            aldatuKokalekua(etiketa,hasieraData);
        });
        document.getElementById('kokalekuAldatu').showModal()
}

async function aldatuKokalekua(etiketa,hasieraData) {
try {
        const idGela= document.getElementById('klaseaAldatu').value;
        const amaieraData = document.getElementById('kokalekuaDataAldatu').value;
        const formData = new FormData();
        formData.append("amaieraData", amaieraData);
        result = await llamarAPIKokalekuak('PUT', {
            etiketa,
            hasieraData,
            amaieraData,
            idGela,
        });
        const dialog = document.getElementById('aldatuinbentarioa');
        const data = await result.json();
        alert(data.message);
    } catch (err) {
        console.error('Error:', err);
    }
}

async function ezabatuKokalekua(etiketa,hasieraData) {
    try {
        const result = await llamarAPIKokalekuak('DEL', { etiketa, hasieraData });  
        if (result.success) {
            alert('Kokalekua ezabatuta');
            await cargarKokalekuak();
        }
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}
async function sortuKokalekua(etiketa, hasieraData, idGela) {
    try {
        
        const resultKokaleku = await llamarAPIKokalekuak('POST', {
            etiketa,
            hasieraData,
            idGela
        }); 
        if (resultKokaleku && resultKokaleku.success) {
            // Cerrar modal si existe
            const dialog = document.getElementById('sortuinbentarioa');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('Kokalekua sortuta');
            await cargarinbentarioak();
        }
    } catch (err) {
        console.error('Error al crear kokalekua:', err);
        alert('Error al crear el kokalekua: ' + err.message);
    }
}
async function crearInbentarioa() {
    const etiketa = document.getElementById('inbentarioEtiketa').value;
    const ekipamendua = document.getElementById('ekipamendua').value;
    const erosketaData = document.getElementById('data').value;
    const gela = document.getElementById('gelaSortu').value;

    if (!etiketa.trim() || !ekipamendua.trim() || !erosketaData.trim() || !gela) {
        alert('Datuak falta dira');
        return;
    }

    let inventarioCreado = false;

    // Crear inventario
    try {
        const result = await llamarAPI('POST', { etiketa, ekipamendua, erosketaData, gela });
        if (result && result.success) {
            inventarioCreado = true;
            console.log('Inventario creado correctamente');
        } else {
            console.warn('Inventario no confirmado por la API:', result);
        }
    } catch (err) {
        console.warn('Advertencia: fetch error al crear inventario (puede que ya esté creado):', err.message);
        inventarioCreado = true; // asumimos que pudo crearse
    }

    // Crear kokalekua aunque haya fetch error
    try {
        await sortuKokalekua(etiketa, erosketaData, gela);
    } catch (err) {
        console.warn('Advertencia: fetch error al crear kokalekua (puede que ya esté creado):', err.message);
    }

    // Cerrar modal y recargar inventarios
    try { document.getElementById('sortuinbentarioa')?.close(); } catch(e) {}
    await cargarinbentarioak();

    if (inventarioCreado) {
        alert('Inventario y kokalekua procesados (puede haber advertencias en la consola).');
    }
}