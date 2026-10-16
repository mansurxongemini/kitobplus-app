<?php
    require_once '../connect2db.php';

    $params = validate(['fcm_token']);

    if ($params['fcm_token']) {
        query("update tokens2 set fcm = NULL where fcm = '" . escape($params['fcm_token']) . "'");
    }

    query("update tokens2 set fcm = '" . escape($params['fcm_token']) . "' where token = $params[token]");

    echo json_encode(['success' => true]);
