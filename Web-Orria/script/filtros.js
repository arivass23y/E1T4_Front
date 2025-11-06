document.addEventListener("DOMContentLoaded", function() {
  const filterIcon = document.getElementById("boton-filtro");
  const filterList = document.getElementById("filter-list");

  filterIcon.addEventListener("click", async function(e) {
    e.stopPropagation();

    const isVisible = filterList.style.display === "block";
    document.querySelectorAll(".filter-list").forEach(el => el.style.display = "none");
    if (isVisible) return;

    filterList.style.display = "block";
    filterList.innerHTML = "<p>Kategoriak kargatzen...</p>";

    try {
      const response = await fetch("get_kategoriak.php");
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        filterList.innerHTML = "<p>Ez dago kategoririk</p>";
        return;
      }

      // 🔹 Creamos lista clicable
      let html = "<ul>";
      data.forEach(k => {
        html += `<li class="categoria-item" data-id="${k.id}" data-izena="${k.izena}">
                   ${k.izena}
                 </li>`;
      });
      html += "</ul>";

      filterList.innerHTML = html;

      // 🔹 Añadir evento a cada categoría
      document.querySelectorAll(".categoria-item").forEach(item => {
        item.addEventListener("click", function() {
          const categoria = this.dataset.izena;
          // Redirigir a la misma página con ?categoria=...
          window.location.href = `ekipamendua_orria.php?categoria=${encodeURIComponent(categoria)}`;
        });
      });

    } catch (err) {
      console.error(err);
      filterList.innerHTML = "<p>Errorea datuak kargatzean</p>";
    }
  });

  // 🔹 Cerrar el menú al clicar fuera
  document.addEventListener("click", function(e) {
    if (!filterList.contains(e.target) && e.target !== filterIcon) {
      filterList.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("ekipamendua-body");

    try {
        const response = await fetch("get_ekipamendua.php");
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='8'>Ez dago ekipamendurik</td></tr>";
            return;
        }

        let html = "";
        data.forEach(e => {
            html += `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.izena}</td>
                    <td>${e.kategoria ?? '-'}</td>
                    <td>${e.deskribapena}</td>
                    <td>${e.marka ?? '-'}</td>
                    <td>${e.modelo ?? '-'}</td>
                    <td>${e.stock}</td>
                    <td>
                        <button id="kudeaketa-icon"><img class="nav-img" src="img/lapiz.png" alt="Menú"></button>
                        <button id="kudeaketa-icon"><img class="nav-img" src="img/tacho-de-reciclaje.png" alt="Menú"></button>
                    </td>
                </tr>`;
        });
        tbody.innerHTML = html;
    } catch (err) {
        console.error(err);
        tbody.innerHTML = "<tr><td colspan='8'>Errorea datuak kargatzean</td></tr>";
    }
});