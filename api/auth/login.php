<?php
    require_once('../connect2db.php');

    $params = validateAnon(['email', 'password', 'fcm_token?']);

    $email = "'" . escape($params['email']) . "'";
    $password = "'" . escape($params['password']) . "'";

    query("select * from users where email = $email and password = $password and deleted is null");
    if (!($user = fetch())) {
        exit(json_encode(['success' => false, 'error' => 'Пользователь не найден']));
    }
    
    array_map(
        function($_) use (&$user) {$user[$_] = intval($user[$_]);},
        ['id', 'state', 'levels_id']
    );

    $token = issueToken($user['id'], $params['platform'], $params['model'], $params['fcm_token'] ?? '');

    exit(json_encode(['success' => true, 'token' => $token, 'user' => $user]));
