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
    <div class="tabla-wrapper">
        <div class="filter-container">
            <button><img src="img/plus-pequeno.png" alt="Añadir" class="filter-icon" id="plus-icon"></button>
            <span>|</span>
            <button><img src="img/filtrar.png" alt="Filtros" class="filter-icon" id="boton-filtro"></button>

            <div class="filter-list" id="filter-list" style="display:none;">
                <p>Ez dago filtrorik</p>
            </div>
        </div>

        <table id="ekipamendua">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Izena</th>
                    <th>Kategoria</th>
                    <th>Deskribapena</th>
                    <th>Marka</th>
                    <th>Modeloa</th>
                    <th>Stock</th>
                    <th>Kudeaketak</th>
                </tr>
            </thead>
            <tbody id="ekipamendua-body">
                <!-- Aquí se añadirán filas dinámicamente -->
            </tbody>
        </table>
    </div>

    <script src="script/menu.js"></script>
    <script src="script/filtros.js"></script>
</body>

</html>