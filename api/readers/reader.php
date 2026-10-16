<?php
    require_once('../connect2db.php');
    require_once('../upload_file.php');
	require_once('../bot.php');

    $params = validate(['nickname'], $_POST);

	$data = ["nickname = '" . escape($params['nickname']) . "'"];

    if (is_array($_FILES) && array_key_exists('avatar', $_FILES)) {
		$data[] = 'avatar_id = ' . uploadFile('avatar');
	}

	$data[] = 'readers_club = 1';

    query("update users set " . implode(", ", $data) . " where id = " . $params['user']['id']);

    $user = getUser($params['user']['id']);

    exit(json_encode(['success' => true, 'user' => $user]));
