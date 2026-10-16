<?php
        require_once('../connect2db.php');

        query("select * from translation");
        
        $fd = fopen('php://memory', 'rw');
        $result = [];
        while ($row = fetch()) {
            fputcsv($fd, $row, ';', '"');
        }
        $csv = stream_get_contents($fd, -1, 0);
        fclose($fd);

        echo $csv;
