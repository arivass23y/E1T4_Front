<nav>
        <div class="nav-left">
            <img class="nav-img" src="../img/barra-de-menus.png" alt="Menú" id="menu-icon">
            <span class="nav-text"><?= $pageTitle ?? 'Orria' ?></span>
        </div>

        <div class="nav-center">
            <div class="search-wrapper">
                <input type="text" placeholder="<?= $searchLabel ?? 'Bilaketa...' ?>" class="nav-search">
                <img src="../img/search.png" class="search-icon" alt="Buscar">
            </div>
        </div>

        <div class="nav-right">
            <a href="saioa-hasi.php"><img class="nav-img" src="../img/usuario.png" alt="Usuario"></a>
            <button class="nav-btn">Saioa itxi</button>
        </div>

        <div class="mobile-menu" id="mobile-menu">
            <div>
                <img src="img/inventario-disponible.png" alt="">
                <h3>Biltegia</h3>
            </div>
            <a href="ekipamenduak.php">Ekipamendua</a>
            <a href="kategoriak.php">Kategoriak</a>
            <a href="inbentarioak.php">Inbentarioa</a>
            <a href="gelak.php">Gelak</a>
            <div>
                <img src="img/avatar.png" alt="Parametrizazioa">
                <h3>Parametrizazioa</h3>
            </div>
            <a href="profila.php">Profila</a>
            <a href="erabiltzaileak.php">Erabiltzaileak</a>
        </div>
    </nav>

    <a href="../index.php"><img id="botoi-atzera" src="../img/flecha-izquierda.png" alt="Atzera"></a>