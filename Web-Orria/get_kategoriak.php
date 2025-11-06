<?php
require_once 'DB.php';
require_once 'kategoria.php';

header('Content-Type: application/json; charset=utf-8');

try {
    // Crear conexión
    $db = new DB();
    $db->konektatu(); // Muy importante: inicializa la conexión
    $kategoriaObj = new Kategoria($db);

    // Obtener categorías
    $kategoriak = $kategoriaObj->getKategoriak();

    // Enviar resultado en JSON
    echo json_encode($kategoriak);
} catch (Exception $e) {
    echo json_encode(["errorea" => $e->getMessage()]);
}
