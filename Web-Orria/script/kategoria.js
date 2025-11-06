document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("kategoria-body");

    // Petición AJAX a PHP
    fetch("get_kategoriak.php")
        .then(response => response.json())
        .then(data => {
            console.log("Datuak:", data);

            // Si hay error desde PHP
            if (data.errorea) {
                tbody.innerHTML = `<tr><td colspan="3">Errorea: ${data.errorea}</td></tr>`;
                return;
            }

            // Si no hay categorías
            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3">Ez dago kategoriarik.</td></tr>`;
                return;
            }

            // Crear filas dinámicamente
            data.forEach(kat => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${kat.id}</td>
                    <td>${kat.izena}</td>
                    <td>
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">🗑️</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => {
            console.error("Errorea datuak eskuratzean:", err);
            tbody.innerHTML = `<tr><td colspan="3">Errorea datuak eskuratzean.</td></tr>`;
        });
});
