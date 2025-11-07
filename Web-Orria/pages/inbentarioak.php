<!DOCTYPE html>
<html lang="eus">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inbentarioa</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/ekipamendua.css"> <!-- usa el mismo CSS general -->
</head>

<body>
    <?php
    $pageTitle = "Inbentarioa";
    $searchLabel = "Inbentarioa billatu...";
    include '../components/header.php';
    ?>

    <main class="tabla-wrapper">
        <header class="filter-container">
            <button>
                <img src="../img/plus-pequeno.png" alt="Añadir" class="filter-icon" id="plus-icon">
            </button>
            <span>|</span>
            <button>
                <img src="../img/filtrar.png" alt="Filtros" class="filter-icon" id="boton-filtro">
            </button>

            <aside class="filter-list" id="filter-list" style="display:none;">
                <p>Ez dago filtrorik</p>
            </aside>
        </header>

        <section>
            <table id="inbentarioa">
                <thead>
                    <tr>
                        <th>Etiketa</th>
                        <th>Ekipamendua</th>
                        <th>Erosketa data</th>
                        <th>Hasiera data</th>
                        <th>Amaiera data</th>
                        <th>Gela</th>
                        <th>Kudeaketak</th>
                    </tr>
                </thead>
                <tbody id="inbentarioa-body">
                    <!-- Datuak hemen gehituko dira dinamikan -->
                </tbody>
            </table>
        </section>
    </main>

    <script src="script/menu.js"></script>
    <script src="script/filtros.js"></script>

    <script>
        async function kargatuInbentarioa() {
            try {
                const response = await fetch("get_inbentarioa.php");
                const datuak = await response.json();

                const tbody = document.getElementById("inbentarioa-body");
                tbody.innerHTML = "";

                datuak.forEach(d => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td>${d.etiketa}</td>
                    <td>${d.ekipamenduIzena}</td>
                    <td>${d.erosketaData}</td>
                    <td>${d.hasieraData}</td>
                    <td>${d.amaieraData}</td>
                    <td>${d.gela}</td>
                    <td>
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">🗑️</button>
                    </td>
                `;
                    tbody.appendChild(tr);
                });
            } catch (err) {
                console.error("Errorea datuak kargatzean:", err);
            }
        }

        kargatuInbentarioa();
    </script>
</body>

</html>