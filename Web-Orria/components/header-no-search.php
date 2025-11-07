<nav>
    <div class="nav-left">
        <img class="nav-img" src="img/barra-de-menus.png" alt="Menú" id="menu-icon">
        <span class="nav-text"><?= $pageTitle ?? 'Orria' ?></span>
    </div>

    <div class="nav-right">
        <a href="saioa-hasi.php"><img class="nav-img" src="img/usuario.png" alt="Usuario"></a>
        <button class="nav-btn">Saioa itxi</button>
    </div>

    <div class="mobile-menu" id="mobile-menu">
        <div>
            <img src="img/inventario-disponible.png" alt="">
            <h3>Biltegia</h3>
        </div>
        <a href="pages/ekipamenduak.php">Ekipamendua</a>
        <a href="pages/kategoriak.php">Kategoriak</a>
        <a href="pages/inbentarioak.php">Inbentarioa</a>
        <a href="pages/gelak.php">Gelak</a>
        <div>
            <img src="img/avatar.png" alt="Parametrizazioa">
            <h3>Parametrizazioa</h3>
        </div>
        <a href="pages/profila.php">Profila</a>
        <a href="pages/erabiltzaileak.php">Erabiltzaileak</a>
    </div>
</nav>