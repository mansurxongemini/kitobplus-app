<?php
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=utf-8');

        require_once('connect2db.php');

        $params = validate(['books_id', 'liked']);

        $params['books_id'] = intval($params['books_id']);
        $params['liked'] = intval($params['liked']);

        query("insert into likes (books_id, users_id, liked, dt) values ($params[books_id], " . $params['user']['id'] . ", $params[liked], NOW()) on duplicate key update liked = $params[liked], dt = NOW()");
        query("insert into likes_history (books_id, users_id, liked, dt) select books_id, users_id, liked, dt from likes where books_id = $params[books_id] and users_id = " . $params['user']['id']);

        exit(json_encode(['success' => true]));
