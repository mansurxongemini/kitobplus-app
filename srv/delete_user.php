<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit($db->error . "\n");
        return $qr;
    }

	if (!array_key_exists("token", $_GET) || ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token'])) || !($user = json_decode(file_get_contents('php://input'), true)) || !array_key_exists('id', $user) || !intval($user['id'])) {
		exit(json_encode(['success' => false, 'error' => 'Неправильный запрос'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
	}

    //exit(json_encode($book));

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

	if (preg_match('/^\d+$/', $_GET['token'])) {
		$aq = mysqli_query($db, "select u.* from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
		if (!($USER = mysqli_fetch_assoc($aq)) || ($levels_id = intval($USER['levels_id'])) == 1) {
			echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		}
	}

    if ($user = sql("select * from users where id = " . intval($user['id']))->fetch_assoc()) {
        if ($levels_id && $USER['id'] != $user['users_id']) {
            echo json_encode(['success' => false, 'error' => "Access denied"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'error' => "Record #$user[id] not found"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    sql("delete from users where id = " . intval($user['id']));

    if ($levels_id) {
        require_once('../api/bot.php');
        notify("Пользователь $USER[name] удалил читателя:\n$user[name]\n+$user[phone]");
    }

	echo json_encode(['success' => true], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
