<!DOCTYPE html>
<html lang="eus">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ekipamenduak</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="estilos/styles.css">
    <link rel="stylesheet" href="estilos/ekipamendua.css">
</head>

<body>
    <?php 
    $pageTitle = "Ekipamendua";
    include 'konponenteak/header.php'; 
    ?>

    <div class="filter-container">
        <button><img src="img/plus-pequeno.png" alt="Añadir" class="filter-icon" id="plus-icon"></button>
        <span>|</span>
        <button><img src="img/filtrar.png" alt="Filtros" class="filter-icon"></button>

        <div class="filter-list" id="filter-list">
            <?php
            // Ejemplo: filtros activos desde GET
            $filtros = [];

            if (isset($_GET['categoria'])) {
                $filtros[] = "Kategoria: " . htmlspecialchars($_GET['categoria']);
            }

            if (isset($_GET['egoera'])) {
                $filtros[] = "Egoera: " . htmlspecialchars($_GET['egoera']);
            }

            if (isset($_GET['data'])) {
                $filtros[] = "Data: " . htmlspecialchars($_GET['data']);
            }

            // Mostrar los filtros aplicados o mensaje si no hay ninguno
            if (!empty($filtros)) {
                echo "<ul>";
                foreach ($filtros as $filtro) {
                    echo "<li>$filtro</li>";
                }
                echo "</ul>";
            } else {
                echo "<p>Ez dago filtrorik</p>"; // "No hay filtros"
            }
            ?>
        </div>
    </div>

    <table id="ekipamendua">
        <tr>
            <th>ID</th>
            <th>Izena</th>
            <th>Kategoria</th>
            <th>Deskribapena</th>
            <th>Marka</th>
            <th>Modeloa</th>
            <th>Kokalekua</th>
            <th>Stock</th>
            <th>Kudeaketak</th>
        </tr>
        <tr>
            <td>1</td>
            <td>Ejemplo</td>
            <td>Ejemplo</td>
            <td>EjemploEjemploEjemploEjemploEjemploEjemploEjemplo</td>
            <td>Ejemplo</td>
            <td>Ejemplo</td>
            <td>Ejemplo</td>
            <td>Ejemplo</td>
            <td>Ejemplo</td>

        </tr>
    </table>


    <script src="script/menu.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const plusIcon = document.getElementById("plus-icon");
            const filterList = document.getElementById("filter-list");

            // Cuando se haga clic en el icono
            plusIcon.addEventListener("click", function(event) {
                event.stopPropagation(); // evita que se cierre inmediatamente
                filterList.style.display =
                    filterList.style.display === "block" ? "none" : "block";
            });

            // Si haces clic fuera, se cierra el menú
            document.addEventListener("click", function(event) {
                if (!filterList.contains(event.target) && event.target !== plusIcon) {
                    filterList.style.display = "none";
                }
            });
        });
    </script>
</body>

</html>