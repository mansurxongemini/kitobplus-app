<?php
    require_once('../connect2db.php');

    $params = validate(['notification']);

    query("update users set notification = " . intval($params['notification']) . " where id = " . $params['user']['id']);

    exit(json_encode(['success' => true, 'user' => getUser($params['user']['id'])]));
