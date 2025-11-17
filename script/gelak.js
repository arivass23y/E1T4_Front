const API_URL = '../../E1T4_Back/Kontrolagailuak/erabiltzailea-controller.php';
const API_KEY = '9f1c2e5a8b3d4f6a7b8c9d0e1f2a3b4c5d6e7f8090a1b2c3d4e5f6a7b8c9d0e1';
const botonCrear = document.getElementById('botoia');

//Alejandro, cambia los nombres y demas de las funciones para que funcione con erabiltzaileak, si tienes dudas me dices. Los metodos son los que necesitas, he hecho ctr+f para cambiar el nombre a erabiltzaileak en vez de ekipamenduak y ya.


document.addEventListener('DOMContentLoaded', () => {
    cargarerabiltzaileak();
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

async function cargarerabiltzaileak() {
    try {
        //APIra deitu eta emaitza jaso
        const resultado = await llamarAPI('GET');
        // Emaitza baliozkoa bada, erakutsi
        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarerabiltzaileak(resultado);
        }
    } catch (err) {
        console.error('Error al cargar erabiltzaileak:', err);
        const tbody = document.getElementById('erabiltzailea-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

function mostrarerabiltzaileak(erabiltzaileak) {
    // Taularen gorputza garbitu
    const tbody = document.getElementById('erabiltzailea-body');
    tbody.innerHTML = '';

    // erabiltzaileak taulan gehitu
    erabiltzaileak.forEach(async erabiltzailea => {
        const tr = document.createElement('tr');
        let kategoria= await cargarKategoria(erabiltzailea.idKategoria);
        
        tr.innerHTML = `
            <td>${erabiltzailea.id}</td>
            <td>${erabiltzailea.izena}</td>
            <td>${kategoria.izena}</td>
            <td>${erabiltzailea.deskribapena}</td>
            <td>${erabiltzailea.marka || '-'}</td>
            <td>${erabiltzailea.modelo || '-'}</td>
            <td>${erabiltzailea.stock}</td>
            <td> 
                <button onclick="dialogPrepared(${erabiltzailea.id})" class="edit-btn">
                    <img src="../img/general/editatu.png" alt="Editar" class="editatu">
                </button>
                <button onclick="ezabatuerabiltzailea(${erabiltzailea.id})" class="delete-btn">
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
        const dialog = document.getElementById('aldatuerabiltzailea');
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
            aldatuerabiltzailea(id);
        });
        document.getElementById('aldatuerabiltzailea').showModal()
}

async function aldatuerabiltzailea(id) {
    try {
        let izena = document.getElementById('ekipamenduIzena').value;
        let deskribapena = document.getElementById('deskribapena').value;
        let marka= document.getElementById('marka').value;
        let modelo = document.getElementById('modeloa').value;
        let stock = document.getElementById('stock').value;
        let idKategoria = document.getElementById('kategoria').value;

        console.log('ID aldatuerabiltzailea funtzioan:', id, izena, deskribapena, marka, modelo, stock, idKategoria);
        
        result = await llamarAPI('PUT', {
            id,
            izena,
            deskribapena,
            marka,
            modelo,
            stock,
            idKategoria
        });
        const dialog = document.getElementById('aldatuerabiltzailea');
        dialog.close();
        await cargarerabiltzaileak();
        const data = await result.json();
    } catch (err) {
        console.error('Error:', err);
    }
}

async function ezabatuerabiltzailea(id) {
    try {
        const result = await llamarAPI('DEL', { id });
        if (result.success) {
            alert('erabiltzailea ezabatuta');
            await cargarerabiltzaileak();
        }
        return result;
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}

async function crearerabiltzailea() {
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

        const result = await llamarAPI('POST', {
            izena,
            deskribapena,
            marka,
            modelo,
            stock,
            idKategoria
        });
        console.log('Resultado de crearerabiltzailea:', result);
        if (result && result.success) {
            // Cerrar modal si existe
            const dialog = document.getElementById('sortuerabiltzailea');
            try { dialog.close(); } catch (e) { /* ignore */ }
            alert('erabiltzailea sortuta');
            await cargarerabiltzaileak();
        }
    } catch (err) {
        console.error('Error al crear erabiltzailea:', err);
        alert('Error al crear el erabiltzailea: ' + err.message);
    }
}