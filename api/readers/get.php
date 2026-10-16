<?php
        require_once('../connect2db.php');

        $params = validate(['id']);

        $params['id'] = intval($params['id']);

        if (!intval($params['id'])) {
                exit(json_encode(['success' => false, 'error' => 'Incorrect request']));
        }

        if (!$row = query("select * from users_view where id = $params[id]")->fetch_assoc()) {
                exit(json_encode(['success' => false, 'error' => "Record #$params[id] not found!"]));
        }

        exit(json_encode(['success' => true, 'data' => $row]));
