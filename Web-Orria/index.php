<!DOCTYPE html>
<html lang="eus">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kategoriak</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="estilos/styles.css">
</head>

<body>
    <?php 
    $pageTitle = "Kategoriak";
    include 'konponenteak/header.php'; 
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
                    <img src="img/ordenador-personal.png" class="category-icon" alt="">
                    <a href="ekipamendua.php">Ekipamendua</a>
                </div>
                <div class="category">
                    <img src="img/categorizacion.png" class="category-icon" alt="">
                    <span>Kategoriak eta Gelak</span>
                </div>
            </div>

            <div class="category-column">
                <div class="category">
                    <img src="img/listas-de-control.png" class="category-icon" alt="">
                    <span>Inbentarioa</span>
                </div>
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