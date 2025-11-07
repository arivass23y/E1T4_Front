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

    <main id="div-principal">
        <header class="principal-header">
            <img src="img/inventario-disponible.png" alt="Biltegia" class="principal-icon">
            <h2 class="kategoriak-titulo">Biltegia</h2>
        </header>

        <section id="Kategoriak">
            <section class="category-column">
                <a href="pages/ekipamenduak.php" class="category">
                    <img src="img/computer.png" class="category-icon" alt="">
                    Ekipamendua
                </a>
                <a href="pages/inbentarioak.php" class="category">
                    <img src="img/write.png" class="category-icon" alt="">
                    Inbentarioa
                </a>
                <a href="pages/erabiltzaileak.php" class="category">
                    <img src="img/avatar.png" class="category-icon" alt="">
                    Erabiltzaileak
                </a>
            </section>

            <section class="category-column">
                <a href="pages/kategoriak.php" class="category">
                    <img src="img/categorizacion.png" class="category-icon" alt="">
                    Kategoriak
                </a>
                <a href="pages/gelak.php" class="category">
                    <img src="img/pizarra.png" class="category-icon" alt="">
                    Gelak
                </a>
            </section>
        </section>
    </main>

    <script src="script/menu.js"></script>
</body>

</html>