<?php
    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit("$q: " . $db->error . "\n");
        return $qr;
    }

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');

    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }
