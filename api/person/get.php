<?php
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=utf-8');

        require_once('../connect2db.php');

        $params = validate(['table', 'id'], FALSE, FALSE, FALSE);

        $params['id'] = intval($params['id']);
        if (!intval($params['id']) || !in_array($params['table'], ['authors', 'dictors', 'publishers', 'genres'])) {
                exit(json_encode(['success' => false, 'error' => 'Incorrect request']));
        }

        if (!$row = query("select * from " . $params['table'] . "_view where id = $params[id]")->fetch_assoc()) {
                exit(json_encode(['success' => false, 'error' => "Record #$params[id] not found!"]));
        }

        exit(json_encode(['success' => true, 'data' => $row]));
