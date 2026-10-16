<?php
	header('Access-Control-Allow-Origin: *');

	if (!array_key_exists("token", $_GET) || ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token'])) || !($id = intval($_GET['id']))) {
		exit(json_encode(['success' => false, 'error' => 'Неправильный запрос'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
	}

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit($db->error . "\n");
        return $qr;
    }

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
    assert($db);

	if (!($row = sql("select * from users_files where id = $id")->fetch_assoc())) {
		exit(json_encode(['success' => false, 'error' => 'Файл не найден'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
	}

	if (preg_match('/^\d+$/', $_GET['token'])) {
		$aq = mysqli_query($db, "select u.* from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
		if (!($USER = mysqli_fetch_assoc($aq))) {
			exit(json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
		}

		if ($USER['levels_id']) {
			$cq = mysqli_query($db, "select * from users where users_id = $USER[id] and (image1_id = $id or image2_id = $id)");
			if (!mysqli_fetch_assoc($cq)) {
				exit(json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
			}
		}
	}

	header("X-SendFile: /var/www/html/restricted/users_files/$id.$row[ext]");
