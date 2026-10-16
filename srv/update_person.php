<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit(json_encode(['success' => true, 'error' => $db->error], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $qr;
    }

	if (
        !array_key_exists("token", $_GET) ||
        ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token'])) ||
        !($person = json_decode(file_get_contents('php://input'), true)) ||
        (!array_key_exists('id', $person) || !intval($person['id'])) ||
        (!array_key_exists('table', $person) || !in_array($person['table'], ['authors', 'dictors', 'genres']))
    ) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

    if (preg_match('/^\d+$/', $_GET['token'])) {
        $aq = mysqli_query($db, "select u.* from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
        if (!($user = mysqli_fetch_assoc($aq))) {
            echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }
    }

	sql("set character_set_client='utf8'");
	sql("set character_set_results='utf8'");
	sql("set collation_connection='utf8_general_ci'");

    if (!$db->query("update $person[table] set
        name = '" . $db->escape_string($person['name']) . "',
        annotation = '" . $db->escape_string($person['annotation']) . "'
        where id = " . intval($person['id']))
    ) {
        exit(json_encode(['success' => false, 'error' => $db->error], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

	echo json_encode(['success' => true], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
