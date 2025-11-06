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
    $pageTitle = "Kategoria";
    include 'konponenteak/header.php';
    ?>
    <div class="tabla-wrapper">
        <table id="ekipamendua">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Izena</th>
                    <th>Kudeaketak</th>
                </tr>
            </thead>
            <tbody id="kategoria-body">
                <!-- Aquí se añadirán filas dinámicamente -->
            </tbody>
        </table>
    </div>

    <script src="script/menu.js"></script>
    <script src="script/filtros.js"></script>
    <script src="script/kategoria.js"></script>
</body>

</html>