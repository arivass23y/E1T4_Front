<head>
    <link rel="stylesheet" href="../styles/navbar.css">
</head>

<nav>
    <section class="nav-left">
        <img class="nav-img" src="../img/navbar/menua.png" alt="Menú" id="menu-icon">
        <span class="nav-text"><?= $pageTitle ?? 'Orria' ?></span>
    </section>

    <section class="nav-center">
        <form class="search-wrapper" role="search">
            <input type="text" placeholder="<?= $searchLabel ?? 'Bilaketa...' ?>" class="nav-search">
            <img src="../img/navbar/search.png" class="search-icon" alt="Buscar">
        </form>
    </section>

    <section class="nav-right">
        <a href="../pages/profila.php">
            <img class="nav-img" src="../img/navbar/profila.png" alt="Profila">
        </a>
        <a href="../pages/saioa-hasi.php" class="nav-btn">Saioa itxi</a>
    </section>

    <section class="mobile-menu" id="mobile-menu">
        <header>
            <img src="img/inventario-disponible.png" alt="">
            <h3>Biltegia</h3>
        </header>
        <ul>
            <li><a href="ekipamenduak.php">Ekipamendua</a></li>
            <li><a href="kategoriak.php">Kategoriak</a></li>
            <li><a href="inbentarioak.php">Inbentarioa</a></li>
            <li><a href="gelak.php">Gelak</a></li>
        </ul>

        <header>
            <img src="img/avatar.png" alt="Parametrizazioa">
            <h3>Parametrizazioa</h3>
        </header>
        <ul>
            <li><a href="profila.php">Profila</a></li>
            <li><a href="erabiltzaileak.php">Erabiltzaileak</a></li>
        </ul>
    </section>
</nav>

<a href="../index.php">
    <img id="botoi-atzera" src="../img/general/atzera.png" alt="Atzera">
</a>