<?php
header('Content-Type: application/json');
include_once 'db.php';
include_once 'inbentarioa.php';
include_once 'ekipamendua.php';
include_once 'kokalekua.php';
include_once 'gela.php';

$db = new DB();
$inbObj = new Inbentarioa($db);
$ekipObj = new Ekipamendua($db);
$kokObj  = new Kokalekua($db);
$gelaObj = new Gela($db);

// Consulta unida: obtenemos todo con los nombres correspondientes
$sql = "SELECT 
            i.etiketa, 
            e.izena AS ekipamenduIzena, 
            i.erosketaData, 
            k.hasieraData, 
            k.amaieraData, 
            g.izena AS gelaIzena
        FROM inbentarioa i
        LEFT JOIN ekipamendua e ON i.idEkipamendua = e.id
        LEFT JOIN kokalekua k ON i.etiketa = k.etiketa
        LEFT JOIN gela g ON k.idGela = g.id";

$result = $db->getKonexioa()->query($sql);
$data = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
?>

