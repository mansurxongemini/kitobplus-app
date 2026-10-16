<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validate(['books_id', 'track', 'position']);

    query("
        INSERT INTO bookmarks
        (users_id, books_id, track, position, dt)
        VALUES
        (" . $params['user']['id'] . ", " . intval($params['books_id']) . ", " . intval($params['track']) . ", " . intval($params['position']) . ", NOW())
        ON DUPLICATE KEY UPDATE dt = NOW()
    ");

    bookmarks_success();
