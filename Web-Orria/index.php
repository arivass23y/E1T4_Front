<!DOCTYPE html>
<html lang="eus">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biltegia</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/main.css">
</head>

<body>
    <?php
    $pageTitle = "Biltegia";
    include 'components/header-no-search.php';
    ?>

    <!-- Contenedor principal de categorías -->

    <div id="div-principal">
        <div class="principal-header">
            <img src="img/inventario-disponible.png" alt="Biltegia" class="principal-icon">
            <h2 class="kategoriak-titulo">Biltegia</h2>
        </div>

        <div id="Kategoriak">
            <div class="category-column">
                <div class="category">
                    <img src="img/computer.png" class="category-icon" alt="">
                    <a href="ekipamenduak.php">Ekipamendua</a>
                </div>
                <div class="category">
                    <img src="img/write.png" class="category-icon" alt="">
                    <a href="inbentarioa_orria.php">Inbentarioa</a>
                </div>
            </div>

            <div class="category-column">
                <div class="category">
                    <img src="img/categorizacion.png" class="category-icon" alt="">
                    <span>Kategoriak</span>
                </div>
                <div class="category">
                    <img src="img/pizarra.png" class="category-icon" alt="">
                    <a href="inbentarioa_orria.php">Gelak</a>
                </div>

            </div>
            <div class="category-column">
                <div class="category">
                    <img src="img/avatar.png" class="category-icon" alt="">
                    <span>Erabiltzaileak</span>
                </div>
            </div>
        </div>
    </div>


    <script src="script/menu.js"></script>
</body>

</html>