//Erabili diren kontrolagailu guztien URL
const API_URL = '../../E1T4_Back/Kontrolagailuak/inbentarioa-controller.php';
const Ekipamendua_API_URL = '../../E1T4_Back/Kontrolagailuak/ekipamendua-controller.php';
const Kokalekua_API_URL = '../../E1T4_Back/Kontrolagailuak/kokalekua-controller.php';
const Gela_API_URL = '../../E1T4_Back/Kontrolagailuak/gela-controller.php';
// API KEY hemen sortu, gero artxibo osoan erabiltzeko
let API_KEY = "";
const botonCrear = document.getElementById('botoiaEditatu');
const botonSortu = document.getElementById('botoiaSortu');
const botonKokalekuaAldatu = document.getElementById('botoiaKokalekuaAldatu');

botonSortu.addEventListener('click', () => {  //Inbentarioa sortzeko botoia clicatzean, bere kokalekua ere bai sortzen da
    crearInbentarioa();
    sortuKokalekua();
});

document.addEventListener('DOMContentLoaded', () => { //HTML-a kargatzerakoan

    const apiKey = sessionStorage.getItem('apiKey'); //ApiKey hartzen dugu
    if (!apiKey) { //Ez bada existitzen, berriro logatzera bidaltzen digu
        alert('Ez dago saio aktiborik, hasi saioa berriro.');
        window.location.href = 'saioa-hasi.html';
    } 
    else{
        API_KEY = apiKey;//Api Key gordetzen dugu aldagaian
    }

    //HTML guztia datuekin kargatzen dugu
    cargarinbentarioak();
    cargarEkipamenduak();
    cargarGelak();
});

//Inbentarioa klasea deiak egiteko metodo berrerabilgarria
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

//Inbentaioko datu guztiak hartu eta gero bidali html-an ikusteko
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

//Inbentarioa HTML-ean sartu modu dinamikoan
function mostrarinbentarioak(inbentarioak) {
    // Taularen gorputza garbitu
    const tbody = document.getElementById('inbentarioa-body');
    tbody.innerHTML = '';

    // inbentarioak taulan gehitu
    inbentarioak.forEach(async inbentarioa => {
        const tr = document.createElement('tr');
        let ekipamendu= await cargarEkipamendua(inbentarioa.idEkipamendu);
        //Informazioa sartu
        tr.innerHTML = `
            <td>${inbentarioa.etiketa}</td>
            <td>${ekipamendu.izena}</td>
            <td>${inbentarioa.erosketaData}</td>
            <td>
                <section> 
                <button onclick="dialogPrepared('${inbentarioa.etiketa}')" class="kudeaketak-btn" id="editatu-btn">
                        <img src="../img/general/editatu.png" alt="Editar" class="kudeaketak-img">
                    </button>
                    <button onclick="ezabatuinbentarioa('${inbentarioa.etiketa}')" class="kudeaketak-btn" id="ezabatu-btn">
                        <img src="../img/general/ezabatu.png" alt="Borrar" class="kudeaketak-img">
                    </button>
                </section>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

//Inbentarioa aldatzeko <dialog> prestatu, inbentarioa zeukan informazioa jartzen, zer aldatzen ari den ikusteko
async function dialogPrepared(etiketa) {

    const current = await llamarAPI('GET', { etiketa }); //Hautatutako inbentarioaren informazioa lortu

        // Dialog eremuei buruzko erreferentziak lortzea

        const dialog = document.getElementById('aldatuinbentarioa');
        const etiketaInput = document.getElementById('inbentarioEtiketaAldatu');
        const ekipamenduaInput = document.getElementById('ekipamenduaAldatu');
        const dataInput = document.getElementById('dataAldatu');

        //Bete eremuak datuekin

        etiketaInput.value=current.etiketa || '';
        ekipamenduaInput.value = current.idEkipamendu || '';
        dataInput.value = current.erosketaData || '';

        botonCrear.addEventListener('click', () => { //Aldatzeko botoia clic egiterakoan, eremua aldatzeko metodoa deitzen da
            aldatuInbentarioa(etiketa);
        });
        document.getElementById('aldatuInbentarioa').showModal()
}

//Inbentarioa aldatzeko hautatutako parametro berriekin
async function aldatuInbentarioa(etiketa) {
    try {
        // Dialog eremuei buruzko erreferentziak lortzea
        const ekipamendua = document.getElementById('ekipamenduaAldatu').value;
        const erosketaData = document.getElementById('dataAldatu').value;
        const formData = new FormData();
        formData.append("erosketaData", erosketaData);
        
        //API deia egin
        result = await llamarAPI('PUT', {
            etiketa,
            ekipamendua,
            erosketaData

        });
        const data = await result.json();
        alert(data.message); //Aldaketa egin ahal izan bada bistaratu
    } catch (err) {
        console.error('Error:', err);
    }
}

// Inbentarioa ezabatzeko datu baseetik
async function ezabatuinbentarioa(etiketa) {
    try {
        const result = await llamarAPI('DEL', { etiketa }); //Ezabatu nahi den inbentarioaren etiketarekin API deitu
        if (result.success) { //Ezabatu bada
            alert('inbentarioa ezabatuta');
            await cargarinbentarioak(); //Inbentarioak berriro kargatu
        }
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}

//Inbentario berria sortzeko metodoa
async function crearInbentarioa() {
    // Dialog eremuei buruzko erreferentziak lortzea
    const etiketa = document.getElementById('inbentarioEtiketa').value;
    const ekipamendua = document.getElementById('ekipamendua').value;
    const erosketaData = document.getElementById('data').value;
    const gela = document.getElementById('gelaSortu').value;

    //Datuak huts ez daudela konprobatu
    if (!etiketa.trim() || !ekipamendua.trim() || !erosketaData.trim() || !gela) {
        alert('Datuak falta dira');
        return;
    }

    let inventarioCreado = false;

    // 
    try {
        const result = await llamarAPI('POST', { etiketa, ekipamendua, erosketaData, gela }); //API deia egin 
        if (result && result.success) { // Erroreren bat badago, bistaratu
            inventarioCreado = true;
        } else {
            console.warn('Inventario no confirmado por la API:', result);
        }
    } catch (err) {
        console.warn('Advertencia: fetch error al crear inventario (puede que ya esté creado):', err.message);
        inventarioCreado = true; // asumimos que pudo crearse
    }
}

//Ekipamenduak lortu, bere izenak bistarateko inbentarioa sortzeko orduan
async function cargarEkipamenduak() {
    try {
        // Deia prestatu
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);

        // Deia kudeatu
        const response = await fetch(Ekipamendua_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        // Erantzunak jaso
        const text = await response.text();
        let ekipamendus = JSON.parse(text);

        // Ekipamenduen izenak bistarateko select-ak hartu
        const select = document.getElementById('ekipamendua');
        let selectAldatu = document.getElementById('ekipamenduaAldatu');

        // Select bete
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

//Lortu ekipamendu bat, inbentarioen tablan izena bistarateko
async function cargarEkipamendua(idEkipamendua) {
    let data = null; 
    try {
        //Deia prestatu
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);
        params.append('id', idEkipamendua);

        //Deia egin
        const response = await fetch(Ekipamendua_API_URL, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        //Erantzuna ondo ez badago
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        data = JSON.parse(text);

    } catch (err) {
        console.error('Error:', err);
    }
    return data; //Datuak itzuli
}


//Gelak Select-etan bistaratzeko hartu
async function cargarGelak() {
    try {
        // Deia preparatu
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);

        // Deia egin
        const response = await fetch(Gela_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        // Erantzuna JSON bezala hartu
        const text = await response.text();
        let ekipamendus = JSON.parse(text);

        // Select lortu
        const select = document.getElementById('gelaSortu');
        let selectAldatu = document.getElementById('gelaAldatu');

        // Select bete
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

//Gela bakarra lortu kokalekuen taulan bistaratzeko
async function cargarGela(idGela) {
    let data = null; 
    try {
        //Deia prestatu
        const params = new URLSearchParams();
        params.append('_method', 'GET');
        params.append('HTTP_APIKEY', API_KEY);
        params.append('id', idGela);

        const response = await fetch(Gela_API_URL, {
            method: 'POST',
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


//Kokalekua klasea deiak egiteko metodo berrerabilgarria
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

//Kokaleku guztiak hartu taulan bistaratzeko
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
            if(kokalekua.amaieraData===null || kokalekua.amaieraData==='0000-00-00'){
                kokalekua.amaieraData='Ez ezarrita';
            }
            tr.innerHTML = `
            <td>${kokalekua.etiketa}</td>
            <td>${gela.izena}</td>
            <td>${kokalekua.hasieraData}</td>
            <td>${kokalekua.amaieraData}</td>
            <td> 
               <button onclick="dialogPreparedKokalekua('${kokalekua.etiketa}', '${kokalekua.hasieraData}')" class="kudeaketak-btn" id="editatu-btn">
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

//Kokalekua aldatzeko dialog prestatu
async function dialogPreparedKokalekua(etiketa,hasieraData) {
    const current = await llamarAPIKokalekuak('GET', { etiketa, hasieraData }); //Datuak hartzeko deia

        // Dialog eremuei buruzko erreferentziak lortzea
        const etiketaInput = document.getElementById('EtiketaKokalekuaAldatu');
        const klaseaInput = document.getElementById('gelaAldatu');

        // Bete eremuak ekipoaren datuekin

        etiketaInput.value=etiketa || '';
        klaseaInput.value = current.idGela || '';
        botonKokalekuaAldatu.addEventListener('click', () => { //Aldatzeko botoia clicatzerakoan, kokalekua aldatzeko metodoa eta kokaleku berria egiteko metodoa deitzen dira.
            aldatuKokalekua(etiketa,hasieraData);
            KokalekuBerria(hasieraData, etiketa);
        });
        document.getElementById('kokalekuAldatu').showModal()
}

//Kokalekua aldatzeko metodoa
async function aldatuKokalekua(etiketa, hasieraData) {
    try {
        //Datuak hartzen ditu
        const idGela = document.getElementById('gelaAldatu').value;
        const amaieraData = document.getElementById('kokalekuaDataAldatu').value;

        const result = await llamarAPIKokalekuak('PUT', { //API deia egiten du
            etiketa,
            hasieraData,
            amaieraData,
            idGela,
        });

    } catch (err) { //Erroreak kudeatzen ditu
        console.error('Error:', err);
    }
}

// Kokalekua aldatzeko metodoa
async function ezabatuKokalekua(etiketa,hasieraData) {
    try {
        const result = await llamarAPIKokalekuak('DEL', { etiketa, hasieraData });  //API deia egiten du, taulako bi Foreign-Keyrekin
        if (result.success) {
            alert('Kokalekua ezabatuta'); //Ezabatu bada, bistaratu
            await cargarKokalekuak();
        }
    } catch (err) { //Erroeak kudeatu
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo: ' + err.message);
        return null;
    }
}

//Kokaleku berria sortzeko metodoa, inbentario berria sortzerakoan
async function sortuKokalekua() {
        // Datu guztiak hartu
        const etiketa = document.getElementById('inbentarioEtiketa').value;
        const hasieraData = document.getElementById('data').value;
        const idGela = document.getElementById('gelaSortu').value;
        const resultKokaleku = await llamarAPIKokalekuak('POST', { //API deia egin
            etiketa,
            hasieraData,
            idGela
        }); 
}

//Kokaleku bati amaiera data jartzerakoan kokaleku berria non dagoen jakiteko beste kokaleku bat sortzen da
async function KokalekuBerria(hasieraData, etiketa) {
    try {
        const idGela = document.getElementById('gelaAldatu').value; // Balio bakarra hartu

        const resultKokaleku = await llamarAPIKokalekuak('POST', { //API deia egiten da
            etiketa,
            hasieraData,
            idGela
        });


    } catch (err) { //Erroreak kudeatu
        console.error('Error al crear kokalekua:', err);
    }
}