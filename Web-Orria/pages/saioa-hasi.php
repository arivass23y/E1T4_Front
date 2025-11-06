<!DOCTYPE html>
<html lang="eu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saioa Hasi</title>
    <link rel="stylesheet" href="../styles/saioa-hasi.css">
</head>
<body>
    <img class="nav-img" src="../img/Logo vertical.png" alt="Usuario">

    <div id="div-hasi">
        <form method="login" action="../Kontrolagailuak/erabiltzailea-controller.php">
            <label for="Erabiltzailea">Erabiltzailea</label><br>
            <input type="text" id="erabiltzailea" name="erabiltzailea"><br>

            <label for="pasahitza">Pasahitza</label><br>
            <input type="password" id="pasahitza" name="pasahitza">
            <button id="saioa-botoia" type="submit">Saioa Hasi</button>
        </form>
    </div>

</body>
</html>
