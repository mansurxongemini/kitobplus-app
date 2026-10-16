<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');
    require_once('../api/upload_file.php');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit($db->error . "\n");
        return $qr;
    }

/*
	if (!array_key_exists("token", $_GET) || $_GET["token"] != '__KP_ADMIN_TOKEN__' || !($user = json_decode(file_get_contents('php://input'), true)) || !array_key_exists('name', $user) || !array_key_exists('email', $user) || !array_key_exists('password', $user) || !$user['name'] || !$user['email'] || !$user['password']) {
		exit(json_encode(['success' => false, 'error' => 'Неправильный запрос'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
	}
*/
	if (!array_key_exists("token", $_GET) || ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token'])) || $_SERVER['REQUEST_METHOD'] != 'POST' || !array_key_exists('name', $_POST) || !$_POST['name']) {
//         || !($user = json_decode(file_get_contents('php://input'), true))) {
		exit(json_encode(['success' => false, 'error' => 'Неправильный запрос ' . json_encode($_POST)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
	}

    $user = [];
    foreach ($_POST as $k => $v) {
        $user[$k] = $v;
    }

    //exit(json_encode($book));

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

	if (preg_match('/^\d+$/', $_GET['token'])) {
		$aq = mysqli_query($db, "select u.* from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
		if (!($USER = mysqli_fetch_assoc($aq)) || ($levels_id = intval($USER['levels_id'])) == 1) {
			exit(json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
		}
	}

    if ($levels_id == 0 && trim($user['email']) && ($row = sql("select id from users where deleted is null and email = '" . $db->escape_string($user['email']) . "'")->fetch_assoc()) && (!$user['id'] || ($user['id'] != $row['id']))) {
        exit(json_encode(['success' => false, 'error' => "Пользователь с e-mail $user[email] уже существует"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    if (trim($user['phone']) && ($row = sql("select id from users where deleted is null and phone = '" . $db->escape_string($user['phone']) . "'")->fetch_assoc()) && (!$user['id'] || ($user['id'] != $row['id']))) {
        exit(json_encode(['success' => false, 'error' => "Пользователь с телефоном $phone уже существует"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $fields = [
        'name',
        'first_name',
        'patronymic',
        'last_name',
        'phone',
        'birthday',
        'address',
        'gender',
        'state',
    ];

    if (!$levels_id) {
        $fields = array_merge($fields, [
            'state',
            'info',
            'allow_retry',
            'email',
            'password',
            'levels_id',
			'plans_id',
			'plan_end',
			'disability'
        ]);
    } else {
        $fields[] = 'users_id';
        $user['users_id'] = $USER['id'];
        $fields[] = 'levels_id';
        $user['levels_id'] = 1;
		$fields[] = 'disablity';
		$user['disability'] = 1;
    }

    $image1_id = null;
    $image2_id = null;

    if (array_key_exists('image1', $_FILES)) {
        $image1_id = uploadFile('image1');
        $fields[] = 'image1_id';
        $user['image1_id'] = $image1_id;
    }

    if (array_key_exists('image2', $_FILES)) {
        $image2_id = uploadFile('image2');
        $fields[] = 'image2_id';
        $user['image2_id'] = $image2_id;
    }

    $values = [];
    $previos_state = 0;

    if (!$user['id']) {
        foreach ($fields as $field) {
            if ($field != 'birthday' && $field != 'plan_end') {
                $values[] = ($user[$field] == 'null' ? 'NULL' : "'" . $db->escape_string($user[$field]) . "'");
            } else {
                $values[] = (($user[$field] && $user[$field] != 'null') ? "'" . $db->escape_string($user[$field]) . "'" : "NULL");
            }
		}

        sql("insert into users (" . implode(',', $fields) . ", register_date) values (" . implode(",", $values)  . ", NOW())");
    } else {
        if ($row = sql("select * from users where id = $user[id]")->fetch_assoc()) {
            if ($levels_id && $USER['id'] != $row['users_id']) {
                echo json_encode(['success' => false, 'error' => "Access denied"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                exit;
            }

            $previos_state = $row['state'];
        } else {
            echo json_encode(['success' => false, 'error' => "Record #$user[id] not found"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            exit;
        }

        foreach ($fields as $field) {
			if ($field != 'birthday' && $field != 'plan_end') {
	            $values[] = "$field = " . ($user[$field] == 'null' ? 'NULL' : "'" . $db->escape_string($user[$field]) . "'");
			} else {
				$values[] = "$field =  " . (($user[$field] && $user[$field] != 'null') ? "'" . $db->escape_string($user[$field]) . "'" : "NULL");
			}
        }

		if (!$levels_id) {
			if ($row['plans_id'] == 0) {
				$values[] = 'plan_end = NULL';
			}

			if ($user['plans_id'] == 1 && $row['plans_id'] != $user['plans_id']) {
				$values[] = 'plan_end = DATE_ADD(NOW(), INTERVAL 7 DAY)';
			}
		}

        sql("update users set " . implode(",", $values) . " where id = " . intval($user['id']));
    }

    if ($previos_state != $user['state'] && in_array($user['state'], [2, 3])) {
        if (trim($user['phone'])) {
            require_once('../api/auth/sendSMS.php');
            sendSMS(preg_replace('/[^0-9]/', '', $user['phone']), $user['state'] == 2 ? 
/*				"Ro'yxatdan o'tish so'rovingiz muvaffaqiyatli tasdiqlandi.\nKitobPlus kutubxonasiga xush kelibsiz!"*/
/*				"Kitob Plus kutubxonasidan\nRo'yxatdan o'tish so'rovingiz muvaffaqiyatli tasdiqlandi!"*/
				"Ro'yxatdan o'tish so'rovingiz muvaffaqiyatli tasdiqlandi. KitobPlus kutubxonasiga xush kelibsiz!"
			:
/*				"Kitob Plus kutubxona\nRo'yxatdan o'tish rad etildi"*/
/*				"Kitob Plus kutubxonasidan\nRo'yxatdan o'tish so'rovingiz rad etildi."	*/
				"KitobPlus kutubxonasidan Ro'yxatdan o'tish so'rovingiz rad etildi."
			);
        }

        require_once('../api/bot.php');
        if (!($levels_id)) {
            notify("Изменение статуса читателя\n$user[name]\n+$user[phone]\n" . ($user['state'] == 2 ? 'Доступ подтверждён' : 'В доступе отказано' . ($user['info'] ? "\n$user[info]" : "")));
        } else {
            notify("Пользователь $USER[name] добавил читателя:\n$user[name]\n+" . preg_replace('/[^0-9]/', '', $user['phone']));
        }
    }

	echo json_encode(['success' => true], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
