<?php
    require_once('../connect2db.php');
    require_once('../passwords.php');

    $params = validateAnon(['email', 'password', 'fcm_token?']);

    $email = "'" . escape($params['email']) . "'";

    query("select * from users where email = $email and deleted is null");
    if (!($user = fetch()) || !kp_password_matches($user['password'], $params['password'])) {
        exit(json_encode(['success' => false, 'error' => 'Пользователь не найден']));
    }
    kp_password_upgrade($DB, $user['id'], $user['password'], $params['password']);
    unset($user['password']);
    
    array_map(
        function($_) use (&$user) {$user[$_] = intval($user[$_]);},
        ['id', 'state', 'levels_id']
    );

    $token = issueToken($user['id'], $params['platform'], $params['model'], $params['fcm_token'] ?? '');

    exit(json_encode(['success' => true, 'token' => $token, 'user' => $user]));
