<?php
    require_once('connect2db.php');

    $params = validate(['books_id', 'rate', 'track', 'position']);

    query(" INSERT INTO playback_positions (users_id, books_id, rate, track, position, dt) VALUES (" . $params['user']['id'] . ", " . intval($params['books_id']) . ", " . floatval($params['rate']) . ", " . intval($params['track']) . ", " . intval($params['position']) . ", NOW())            
            ON DUPLICATE KEY UPDATE rate = " . floatval($params['rate']) . ", track = " . intval($params['track']) . ", position = " . intval($params['position']) . ", dt = NOW()");

    exit(json_encode(['success' => true]));
