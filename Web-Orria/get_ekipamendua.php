<?php
require_once 'DB.php';
require_once 'ekipamendua.php';
require_once 'kategoria.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = new DB();
    $db->konektatu();

    // Creamos los objetos
    $ekipObj = new Ekipamendua($db);
    $katObj = new Kategoria($db);

    // Obtenemos todos los equipos
    $ekipamenduak = $ekipObj->getEkipamenduak();

    // Añadimos el nombre de la categoría
    foreach ($ekipamenduak as &$ekip) {
        $kategoriak = $katObj->getKategoria($ekip['idKategoria']);
        $ekip['kategoria'] = $kategoriak[0]['izena'] ?? '-';
    }

    echo json_encode($ekipamenduak);
} catch (Exception $e) {
    echo json_encode(["errorea" => $e->getMessage()]);
}
