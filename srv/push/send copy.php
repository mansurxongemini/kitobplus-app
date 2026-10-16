<?php   
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

	if (
        !array_key_exists("token", $_GET) ||
        ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token'])) ||
        !($json = json_decode(file_get_contents('php://input'), true)) ||
        !array_key_exists('title', $json) ||
        !array_key_exists('body', $json) ||
        !array_key_exists('books_id', $json)
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

        $books_id = intval($json['books_id']);
        $users_query = mysqli_query($db, "
            select u.id
            from users u
            join tokens2 t2 on u.id = t2.users_id and t2.fcm is not null
            where
                u.notification = 0
                or
                (u.notification = 1 and (
                    u.id in (select f.users_id from favorites f where f.target = 'authors' and f.id in (select b2a.authors_id from books2authors b2a where b2a.books_id=$books_id))
                    or
                    u.id in (select f.users_id from favorites f where f.target = 'dictors' and f.id in (select b2d.dictors_id from books2dictors b2d where b2d.books_id=$books_id))
                    or
                    u.id in (select f.users_id from favorites f where f.target = 'genres' and f.id in (select b2g.genres_id from books2genres b2g where b2g.books_id=$books_id))
                ))
        ");
        $json['users'] = [];
        while ($row = mysqli_fetch_assoc($users_query)) {
            $json['users'][] = $row['id'];
        }        
    } else {
        echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    
    exec("/usr/bin/php8.4 sendit.php 2>&1 " . escapeshellarg(json_encode($json)), $out, $ec);
    //exec("/usr/bin/php8.4 sendit.php 2>&1 {}", $out, $ec);
    if ($ec) {
        exit(json_encode(['success' => false, 'error' => 'Push-notificatoin send error!', 'ec' => $ec, 'log' => implode("\n", $out)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $response = json_decode(implode("\n", $out), true);    
	exit(json_encode(['success' => true, 'result' => ['sended' => $response['sended'], 'errors' => $response['errors']]], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    