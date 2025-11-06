<?php
require_once 'DB.php';
require_once 'inbentarioa.php';
require_once 'ekipamendua.php';
require_once 'kokaleku.php';
require_once 'gela.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = new DB();
    $db->konektatu();

    $inbObj = new Inbentarioa($db);
    $ekipObj = new Ekipamendua($db);
    $kokObj  = new Kokalekua($db);
    $gelaObj = new Gela($db);

    // 1️⃣ Lortu inbentario guztiak
    $inbentarioak = $inbObj->getInbentarioak();

    // 2️⃣ Gehitu ekipamendu, kokalekua eta gela informazioa
    foreach ($inbentarioak as &$inb) {
        // Ekipamendua
        $ekip = $ekipObj->getEkipamendua($inb['idEkipamendua']);
        $inb['ekipamenduIzena'] = $ekip[0]['izena'] ?? '-';

        // Kokalekua (bilatu etiketa bidez)
        $kokalekua = $db->getKonexioa()->query("SELECT * FROM kokalekua WHERE etiketa = '".$inb['etiketa']."'")->fetch_assoc();
        if ($kokalekua) {
            $inb['hasieraData'] = $kokalekua['hasieraData'];
            $inb['amaieraData'] = $kokalekua['amaieraData'];

            // Gela
            $gela = $gelaObj->getGela($kokalekua['idGela']);
            $inb['gela'] = $gela[0]['izena'] ?? '-';
        } else {
            $inb['hasieraData'] = '-';
            $inb['amaieraData'] = '-';
            $inb['gela'] = '-';
        }
    }

    echo json_encode($inbentarioak);
} catch (Exception $e) {
    echo json_encode(["errorea" => $e->getMessage()]);
}
