<?php
    require_once '../connect2db.php';

    $params = validate(['provider', 'id', 'email', 'name', 'fcm_token?'], FALSE, FALSE, FALSE, TRUE);

    $user = signin($params['provider'], $params['id'], $params['email'], $params['name']);

    $token = issueToken($user['id'], $params['platform'], $params['model'], $params['fcm_token'] ?? '');

    echo json_encode(['success' => true, 'token' => $token, 'user' => $user]);
