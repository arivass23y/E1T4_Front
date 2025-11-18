const API_URL = 'http://localhost/Reto1/E1T4_Back/Kontrolagailuak/erabiltzailea-controller.php';

async function login() {
    const erabiltzailea = document.getElementById("erabiltzailea").value.trim();
    const pasahitza = document.getElementById("pasahitza").value.trim();

    if (!erabiltzailea || !pasahitza) {
        alert("Mesedez, bete eremu guztiak.");
    }
    else{
        try {
            const resultado = await llamarAPI('LOGIN', { erabiltzailea, pasahitza });

            if (resultado.success && resultado.success.toString().trim().toLowerCase() === "true") {
                localStorage.setItem('apiKey', resultado.apiKey);
                window.location.href ='../index.html';
            } else {
                alert("Erabiltzaile edo pasahitz okerra.");
            }
        } catch (err) {
            console.error("Errorea login egiten:", err);
            alert("Errorea login egiten: " + err.message);
        }
    }
}

async function llamarAPI(metodo, datos = {}) {
    const params = new URLSearchParams(); 
    params.append('_method', metodo);

    // Añadir datos
    for (const [key, value] of Object.entries(datos)) {
        if (value !== null && value !== undefined) {
            params.append(key, value);
        }
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        const text = await response.text();

        let resultado;
        try {
            resultado = JSON.parse(text);
        } catch (err) {
            console.error('Respuesta API no es JSON válido:', { status: response.status, text });
            throw new Error(`API devolvió algo que no es JSON. Estado: ${response.status}`);
        }

        if (!response.ok) {
            const mensaje = resultado?.error || `HTTP error ${response.status}`;
            throw new Error(mensaje);
        }

        return resultado;
    } catch (err) {
        throw new Error("Error en la petición a la API: " + err.message);
    }
}
