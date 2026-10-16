<?php
        require_once('../connect2db.php');

        query("select * from translation");
        
        $result = [];
        while ($row = fetch()) {
            $result[$row['ru']] = [
                'UZ' => $row['uz'],
                'US' => $row['us'],
            ];
        }

        echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);