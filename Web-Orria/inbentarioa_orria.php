<!DOCTYPE html>
<html lang="eus">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inbentarioa</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="estilos/styles.css">
    <link rel="stylesheet" href="estilos/ekipamendua.css"> <!-- usa el mismo CSS general -->
</head>

<body>
    <?php
    $pageTitle = "Inbentarioa";
    include 'konponenteak/header.php';
    ?>

    <div class="tabla-wrapper">
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
    </div>

    <script src="script/menu.js"></script>
    <script src="script/filtros.js"></script>


</body>

</html>