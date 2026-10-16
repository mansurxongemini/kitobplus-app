<?php   
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');
   
    require_once('send_functions.php');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit($db->error . "\n");
        return $qr;
    }

	if (
        count($_SERVER['argv']) != 2 ||
        !($json = json_decode($_SERVER['argv'][1], true))
    ) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

    $successes = [];
    if ($json['users']) {
        $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
        assert($db);

        $tokens = [];
        $query = $db->query("select
            distinct fcm as fcm
            from tokens2
            where fcm is not null and users_id in (" . implode(",", $json['users']) . ")
        ");

        while ($row = $query->fetch_assoc()) {
            $tokens[] = $row['fcm'];
        }

        if ($tokens) {
            list($sended, $errors, $successes) = send($json['title'], $json['body'], $tokens, $json['books_id']);
        }
    }

	echo json_encode(['sended' => $sended ?? 0, 'errors' => $errors ?? 0, 'successes' => $successes], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    