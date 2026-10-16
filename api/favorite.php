<?php
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=utf-8');

        require_once('connect2db.php');

        $params = validate(['target', 'id', 'favorite']);

        $targets = ['authors', 'dictors', 'genres'];

        if (!in_array($params['target'], $targets)) {
            exit(json_encode(['success' => false, 'error' => 'Incorect request']));
        }

        $params['id'] = intval($params['id']);
        $params['favorite'] = intval($params['favorite']);

        if ($params['favorite']) {
            query("insert into favorites (users_id, target, id, favorite, dt) values (" . $params['user']['id'] . ", '$params[target]', $params[id], $params[favorite], NOW()) on duplicate key update dt = NOW()");
        } else {
            query("delete from favorites where users_id = " . $params['user']['id'] . " and target = '$params[target]' and id = $params[id]");
        }
        query("insert into favorites_history (users_id, target, id, favorite, dt) values (" . $params['user']['id'] . ", '$params[target]', $params[id], $params[favorite], NOW())");

        exit(json_encode(['success' => true]));
