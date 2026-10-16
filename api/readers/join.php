<?php
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=utf-8');

        require_once('../connect2db.php');

        $params = validate(['join']);

        query("update users set readers_club = " . ($params['join'] ? 1 : 0) . " where id = " . $params['user']['id']);

        exit(json_encode(['success' => true]));
