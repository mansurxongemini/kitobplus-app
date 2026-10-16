<?php
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=utf-8');

        require_once('connect2db.php');

        $params = validate([]);

        $favorites = fetch_all("select * from favorites where users_id = " . $params['user']['id']);
/*        
        $targets = ['authors', 'dictors', 'genres'];
        $favorites = [];
        foreach(fetch_all("select * from favorites where users_id = " . $params['user']['id']) as $row) {
                $row['target'] = $targets[$row['target'] - 1];
                $favorites[] = $row;
        }
*/

        exit(json_encode(['success' => true, 'favorites' => $favorites]));
