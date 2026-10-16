<?php
    require_once('../connect2db.php');

    $params = validateAnon(['id']);
    
    $params['id'] = intval($params['id']);

    if (!($row = fetch_row("select id, (dt <= now()) is_active from news where id = $params[id] and deleted is null"))) {
        exit(json_encode(['success' => false, 'error' => 'Новость не найдена']));
    }

    if ($row['is_active']) {
        query("insert into news_views (news_id, ip, dt, users_id) values ($params[id], inet_aton('" . $_SERVER['REMOTE_ADDR'] . "'), now(), " . ($params['user'] ? $params['user']['id'] : 'NULL') . ")");
    }
    
    exit(json_encode(['success' => true]));