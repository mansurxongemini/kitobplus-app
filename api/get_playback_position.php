<?php
    require_once('connect2db.php');

    $params = validate(['books_id']);

    query("select *, UNIX_TIMESTAMP(dt) ts from playback_positions where users_id = " . $params['user']['id'] . " and books_id = " . intval($params['books_id']));
    if (!($row = fetch())) {
        exit(json_encode(['success' => false, 'error' => 'Playback position not found']));
    }

    $row['success'] = true;
    exit(json_encode($row));
