const API_URL = '../../E1T4_Back/Kontrolagailuak/erabiltzailea-controller.php';

async function login() {
    const erabiltzaile = document.getElementById("erabiltzailea").value;
    const pasahitza = document.getElementById("pasahitza").value;
    if(erabiltzaile === "" || pasahitza === "") {
        alert("Mesedez, bete eremu guztiak.");
    }   
    else{
        const resultado = await llamarAPI('LOGIN', { erabiltzaile, pasahitza });
        if(resultado.success === "true") {
            alert("penecius jr");
            localStorage.setItem('apiKey', resultado.apiKey);
            window.location.href = 'profila.html';
        } else {
            alert(" jr");
            alert("Erabiltzaile edo pasahitz okerra.");
        }
    }
}

async function llamarAPI(metodo, datos = {}) {
    //Bidaliko parametroak prestatu
    const params = new URLSearchParams(); 
    params.append('_method', metodo);

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