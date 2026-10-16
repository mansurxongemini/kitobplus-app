<?php
    require_once('../connect2db.php');
    require_once('../upload_file.php');
	require_once('../bot.php');

    $params = validate(['name', 'nickname', 'birthday', 'email', 'disability', 'readers_club']);

	$data = [
        "name = '" . escape($params['name']) . "'",
        "nickname = '" . escape($params['nickname']) . "'",
        "birthday = " . ($params['birthday'] ? "'" . escape($params['birthday']) . "'" : "NULL"),
        "disability = " . intval($params['disability']),
        "readers_club = " . intval($params['readers_club']),
    ];

    query("update users set " . implode(", ", $data) . " where id = " . $params['user']['id']);

    $user = getUser($params['user']['id']);

    exit(json_encode(['success' => true, 'user' => $user]));
