const API_URL = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';
const KATEGORIA_API_URL = '../../E1T4_Back/Kontrolagailuak/kategoria-controller.php';
const API_KEY = '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1';
const botonCrear = document.getElementById('botoia');

document.addEventListener('DOMContentLoaded', () => {
    cargarEkipamenduak();
    cargarKategorias();
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

async function cargarEkipamenduak() {
    try {
        //APIra deitu eta emaitza jaso
        const resultado = await llamarAPI('GET');
        // Emaitza baliozkoa bada, erakutsi
        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarEkipamenduak(resultado);
        }
    } catch (err) {
        console.error('Error al cargar ekipamenduak:', err);
        const tbody = document.getElementById('ekipamendua-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

async function cargarKategoria(idKategoria) {
    let data = null; // declarar data fuera del try
    try {
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);
        params.append('id', idKategoria);

        const response = await fetch(KATEGORIA_API_URL, {
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

function mostrarEkipamenduak(ekipamenduak) {
    // Taularen gorputza garbitu
    const tbody = document.getElementById('ekipamendua-body');
    tbody.innerHTML = '';

    // Ekipamenduak taulan gehitu
    ekipamenduak.forEach(async ekipamendua => {
        const tr = document.createElement('tr');
        let kategoria= await cargarKategoria(ekipamendua.idKategoria);
        
        tr.innerHTML = `
            <td>${ekipamendua.id}</td>
            <td>${ekipamendua.izena}</td>
            <td>${kategoria.izena}</td>
            <td>${ekipamendua.deskribapena}</td>
            <td>${ekipamendua.marka || '-'}</td>
            <td>${ekipamendua.modelo || '-'}</td>
            <td>${ekipamendua.stock}</td>
            <td> 
                <button onclick="dialogPrepared(${ekipamendua.id})" class="kudeaketak-btn" id="editatu-btn">
                    <img src="../img/general/editatu.png" alt="Editar" class="kudeaketak-img">
                </button>
                <button onclick="ezabatuEkipamendua(${ekipamendua.id})" class="kudeaketak-btn" id="ezabatu-btn">
                    <img src="../img/general/ezabatu.png" alt="Borrar" class="kudeaketak-img">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function dialogPrepared(id) {

    const current = await llamarAPI('GET', { id });

        // Obtener referencias a los campos del dialog
        const dialog = document.getElementById('aldatuEkipamendua');
        const izenaInput = document.getElementById('ekipamenduIzena');
        const deskribapenaInput = document.getElementById('deskribapena');
        const markaInput = document.getElementById('marka');
        const modeloaInput = document.getElementById('modeloa');
        const stockInput = document.getElementById('stock');
        const kategoriaInput = document.getElementById('kategoria');

        // Rellenar campos con los datos del equipo
        izenaInput.value = current.izena || '';
        deskribapenaInput.value = current.deskribapena || '';
        markaInput.value = current.marka || '';
        modeloaInput.value = current.modelo || '';
        stockInput.value = current.stock || '';
        kategoriaInput.value = current.idKategoria || '';

        botonCrear.addEventListener('click', () => { 
            aldatuEkipamendua(id);
        });

        dialog.showModal()
}

async function aldatuEkipamendua(id) {
    try {
        let izena = document.getElementById('ekipamenduIzena').value;
        let deskribapena = document.getElementById('deskribapena').value;
        let marka= document.getElementById('marka').value;
        let modelo = document.getElementById('modeloa').value;
        let stock = document.getElementById('stock').value;
        let idKategoria = document.getElementById('kategoria').value;

        if (stock < 0){
            alert('Stock-a ezin izan da negatiboa.')
            return;
        }

        console.log('ID aldatuEkipamendua funtzioan:', id, izena, deskribapena, marka, modelo, stock, idKategoria);
        
        result = await llamarAPI('PUT', {
            id,
            izena,
            deskribapena,
            marka,
            modelo,
            stock,
            idKategoria
        });
        const dialog = document.getElementById('aldatuEkipamendua');
        dialog.close();
        await cargarEkipamenduak();
        const data = await result.json();
    } catch (err) {
        console.error('Error:', err);
    }
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

async function crearEkipamendua() {
    try {
        const izena = document.getElementById('ekipamenduIzenaSortu')?.value ?? '';
        const idKategoria = document.getElementById('kategoriaSortu')?.value ?? '';
        const deskribapena = document.getElementById('deskribapenaSortu')?.value ?? '';
        const marka = document.getElementById('markaSortu')?.value ?? '';
        const modelo = document.getElementById('modeloaSortu')?.value ?? '';
        const stock = document.getElementById('stockSortu')?.value ?? '';

        // Validar campos obligatorios
        if (!izena.trim() || !deskribapena.trim() || !stock.toString().trim() || !idKategoria.toString().trim()) {
            alert('Izena, deskribapena, stock eta idKategoria derrigorrezkoak dira');
            return;
        }

        if (stock < 0){
            alert('Stock-a ezin izan da negatiboa.')
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
        console.log('Resultado de crearEkipamendua:', result);
        if (result && result.success) {
            // Cerrar modal si existe
            const dialog = document.getElementById('sortuEkipamendua');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('Ekipamendua sortuta');
            await cargarEkipamenduak();
        }
    } catch (err) {
        console.error('Error al crear ekipamendua:', err);
        alert('Error al crear el ekipamendua: ' + err.message);
    }
}

async function cargarKategorias() {
    try {
        // Crear parámetros para la solicitud
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);

        // Hacer la petición
        const response = await fetch(KATEGORIA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        // Obtener respuesta como texto
        const text = await response.text();

        // Parsear JSON
        let categorias = JSON.parse(text);

        // Obtener el select
        const select = document.getElementById('kategoriaSortu');
        let selectAldatu = document.getElementById('kategoria');

        // Llenar select con las categorías
        if (select && Array.isArray(categorias)) {
            categorias.forEach(cat => {
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