<?php
class Gela {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getGelak() {
        $result = $this->db->getKonexioa()->query("SELECT * FROM gela");
        if (!$result) {
            echo 'ERROREA: ezin izan dira gelak eskuratu.';
            die();
        } else {
            $gelak = [];
            while ($row = $result->fetch_assoc()) {
                $gelak[] = $row;
            }
            return $gelak;
        }
    }
}
?>
