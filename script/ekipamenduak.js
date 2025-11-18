//Erabili diren kontrolagailu guztien URL
const API_URL = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';
const KATEGORIA_API_URL = '../../E1T4_Back/Kontrolagailuak/kategoria-controller.php';
// API KEY hemen sortu, gero artxibo osoan erabiltzeko
let API_KEY = '';
const botonCrear = document.getElementById('botoia');

document.addEventListener('DOMContentLoaded', () => { //HTML-a kargatzerakoan
    const apiKey = sessionStorage.getItem('apiKey');//ApiKey hartzen dugu
    if (!apiKey) {//Ez bada existitzen, berriro logatzera bidaltzen digu
        alert('Ez dago saio aktiborik, hasi saioa berriro.');
        window.location.href = 'saioa-hasi.html';
    }
    else{
        API_KEY = apiKey;//Api Key gordetzen dugu aldagaian
    }
    //HTML guztia datuekin kargatzen dugu
    cargarEkipamenduak();
    cargarKategorias();
});

//Ekipamendua klasea deiak egiteko metodo berrerabilgarria
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

//Ekipamenduak lortu gero bistaratzeko
async function cargarEkipamenduak() {
    try {
        //APIra deitu eta emaitza jaso
        const resultado = await llamarAPI('GET');
        // Emaitza baliozkoa bada, erakutsi
        if (Array.isArray(resultado) || typeof resultado === 'object') {
            mostrarEkipamenduak(resultado);
        }
    } catch (err) { //Erroreak kudeatu
        console.error('Error al cargar ekipamenduak:', err);
        const tbody = document.getElementById('ekipamendua-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="8">Error al cargar datos: ${err.message}</td></tr>`;
    }
}

//Kategoria bakarra lortu, gero taulan bistaratzeko
async function cargarKategoria(idKategoria) {
    let data = null;
    try {
        //Deia prestatu
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);
        params.append('id', idKategoria);

        //Deia egin
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
    return data; //Datuak bidali
}

//EKipamenduak taulan bistaratzeko metodo dinamikoa
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
                <section> 
                    <button onclick="dialogPrepared(${ekipamendua.id})" class="kudeaketak-btn" id="editatu-btn">
                        <img src="../img/general/editatu.png" alt="Editar" class="kudeaketak-img">
                    </button>
                    <button onclick="ezabatuEkipamendua(${ekipamendua.id})" class="kudeaketak-btn" id="ezabatu-btn">
                        <img src="../img/general/ezabatu.png" alt="Borrar" class="kudeaketak-img">
                    </button>
                </section>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

//Ekipamendua aldatzeko dialog prestatu, bere datuekin hautatuta, zer aldatzen ari duzun jakiteko
async function dialogPrepared(id) {

    const current = await llamarAPI('GET', { id }); //Datuak lortu

        // Elkarrizketaren eremuei buruzko erreferentziak lortzea

        const dialog = document.getElementById('aldatuEkipamendua');
        const izenaInput = document.getElementById('ekipamenduIzena');
        const deskribapenaInput = document.getElementById('deskribapena');
        const markaInput = document.getElementById('marka');
        const modeloaInput = document.getElementById('modeloa');
        const stockInput = document.getElementById('stock');
        const kategoriaInput = document.getElementById('kategoria');

        // Bete eremuak ekipoaren datuekin

        izenaInput.value = current.izena || '';
        deskribapenaInput.value = current.deskribapena || '';
        markaInput.value = current.marka || '';
        modeloaInput.value = current.modelo || '';
        stockInput.value = current.stock || '';
        kategoriaInput.value = current.idKategoria || '';

        botonCrear.addEventListener('click', () => { // Sortzeko botoia sakatzerakoan, ekipamendua aldatzeko metodoa deitzen da, bere id-arekin
            aldatuEkipamendua(id);
        });

        dialog.showModal()
}

//Ekipamendua aldatzeko metodoa
async function aldatuEkipamendua(id) {
    try {
        //Hautagai guztiak hartu
        let izena = document.getElementById('ekipamenduIzena').value;
        let deskribapena = document.getElementById('deskribapena').value;
        let marka= document.getElementById('marka').value;
        let modelo = document.getElementById('modeloa').value;
        let stock = document.getElementById('stock').value;
        let idKategoria = document.getElementById('kategoria').value;

        if (stock < 0){ //Stock negatiboa ez badago konprobatu
            alert('Stock-a ezin izan da negatiboa.')
            return;
        }
        
        result = await llamarAPI('PUT', { //API deia egin
            id,
            izena,
            deskribapena,
            marka,
            modelo,
            stock,
            idKategoria
        });
        if (result.success) {
            alert('Ekipamendua aldatuta');
            const dialog = document.getElementById('aldatuEkipamendua');
            dialog.close();
            await cargarEkipamenduak();
            const data = await result.json();
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

//Ekipamendua ezabatzeko metodos
async function ezabatuEkipamendua(id) {
    try {
        const result = await llamarAPI('DEL', { id }); //API deia egin
        if (result.success) {
            alert('Ekipamendua ezabatuta');
            await cargarEkipamenduak();
        }
        return result;
    } catch (err) { //Erroreak kudeatu
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}

//Ekipamendua sortzeko metodoa
async function crearEkipamendua() {
    try {
        //Hautagai guztiak lortu
        const izena = document.getElementById('ekipamenduIzenaSortu')?.value ?? '';
        const idKategoria = document.getElementById('kategoriaSortu')?.value ?? '';
        const deskribapena = document.getElementById('deskribapenaSortu')?.value ?? '';
        const marka = document.getElementById('markaSortu')?.value ?? '';
        const modelo = document.getElementById('modeloaSortu')?.value ?? '';
        const stock = document.getElementById('stockSortu')?.value ?? '';

        // Hautagai guztiak konprobatu
        if (!izena.trim() || !deskribapena.trim() || !stock.toString().trim() || !idKategoria.toString().trim()) {
            alert('Izena, deskribapena, stock eta idKategoria derrigorrezkoak dira');
            return;
        }

        if (stock < 0){ //Stock negatiboa ez badago konprobatu
            alert('Stock-a ezin izan da negatiboa.')
            return;
        }

        const result = await llamarAPI('POST', { //API deia egin
            izena,
            deskribapena,
            marka,
            modelo,
            stock,
            idKategoria
        });
        if (result && result.success) {
            alert('Ekipamendua sortuta');
            const dialog = document.getElementById('sortuEkipamendua');
            try { dialog.close(); } catch (e) { /* ignore */ }
            await cargarEkipamenduak();
        }
    } catch (err) {
        console.error('Error al crear ekipamendua:', err);
        alert('Error al crear el ekipamendua: ' + err.message);
    }
}

//kategoria huztiak hartu, select-etan bistaratzeko
async function cargarKategorias() {
    try {
        // Eskaerarako parametroak sortu
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);

        // deia egin
        const response = await fetch(KATEGORIA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        const text = await response.text();
        let categorias = JSON.parse(text);

        // Select hartu
        const select = document.getElementById('kategoriaSortu');
        let selectAldatu = document.getElementById('kategoria');

        // Select bete kategorien izenekin
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