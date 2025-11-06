document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("inbentarioa-body");

    try {
        const response = await fetch("get_inbentarioa.php");
        const datuak = await response.json();

        if (!Array.isArray(datuak) || datuak.length === 0) {
            tbody.innerHTML = "<tr><td colspan='7'>Ez dago inbentariorik</td></tr>";
            return;
        }

        let html = "";
        datuak.forEach(d => {
            html += `
                <tr>
                    <td>${d.etiketa}</td>
                    <td>${d.ekipamenduIzena ?? '-'}</td>
                    <td>${d.erosketaData ?? '-'}</td>
                    <td>${d.hasieraData ?? '-'}</td>
                    <td>${d.amaieraData ?? '-'}</td>
                    <td>${d.gela ?? '-'}</td>
                    <td>
                        <button id="kudeaketa-icon"><img class="nav-img" src="img/lapiz.png" alt="Menú"></button>
                        <button id="kudeaketa-icon"><img class="nav-img" src="img/tacho-de-reciclaje.png" alt="Menú"></button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

    } catch (err) {
        console.error("Errorea datuak kargatzean:", err);
        tbody.innerHTML = "<tr><td colspan='7'>Errorea datuak kargatzean</td></tr>";
    }
});
