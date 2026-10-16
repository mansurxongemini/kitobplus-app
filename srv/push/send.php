<?php   
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

	if (
        !array_key_exists("token", $_GET) ||
        ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token'])) ||
        !($json = json_decode(file_get_contents('php://input'), true)) ||
        !array_key_exists('title', $json) ||
        !array_key_exists('body', $json) ||
        !array_key_exists('books_id', $json) ||
        !($books_id = intval($json['books_id']))
    ) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

    if (preg_match('/^\d+$/', $_GET['token'])) {
        $aq = mysqli_query($db, "
            select u.*
            from users u
            join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2
            where t2.token = $_GET[token]
        ");
        
        if (!($user = mysqli_fetch_assoc($aq))) {
            echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        mysqli_query($db, "delete from notifications where books_id = $books_id and process_start is null");
    } else {
        echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    
    exec("/usr/bin/php8.4 sendit.php " . escapeshellarg(json_encode($json)) . " 2>&1", $out, $ec);
    //exec("/usr/bin/php8.4 sendit.php 2>&1 {}", $out, $ec);
    if ($ec) {
        exit(json_encode(['success' => false, 'error' => 'Push-notificatoin send error!', 'ec' => $ec, 'log' => implode("\n", $out)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $response = json_decode(implode("\n", $out), true);    
	exit(json_encode(['success' => true, 'result' => ['sended' => $response['sended'], 'errors' => $response['errors']]], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    