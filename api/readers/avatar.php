<?php
    require_once('../connect2db.php');

	$params = validate(['users_id'], ['users_id' => $_GET['users_id']]);

    if (!($row = fetch(query("select uf.* from users u join users_files uf on u.avatar_id = uf.id where u.id = " . intval($params['users_id']))))) {
   		exit(json_encode(['success' => false, 'error' => 'Файл не найден'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

	error_log("/var/www/html/restricted/users_files/$row[id].$row[ext]");

	header("X-SendFile: /var/www/html/restricted/users_files/$row[id].$row[ext]");
