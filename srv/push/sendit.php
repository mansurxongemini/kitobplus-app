<?php   
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');
   
    require_once('send_functions.php');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit($db->error . "\n");
        return $qr;
    }

//    exit(json_encode(['sended' => $_SERVER['argv'][1], 'errors' => json_decode($_SERVER['argv'][1], true)]));

	if (
        count($_SERVER['argv']) != 2 ||
        !($json = json_decode($_SERVER['argv'][1], true)) ||
        !($books_id = intval($json['books_id'] ?? 0))
    ) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');

    ($q = mysqli_query($db, "select * from books_view where id = $books_id")) || exit(1);

    ($book = mysqli_fetch_assoc($q)) || exit(1);

    $title = 'Yangi kitob!';
    $body = (trim($book['authors_name']) ? trim($book['authors_name']) . " - " : "") . $book['name'] . (trim($book['dictors_name']) ? " (" . trim($book['dictors_name']) . ")" : "");

    if (!($notifications_id = ($json['notifications_id'] ?? 0))) {
        if (!mysqli_query($db, "insert into notifications (books_id, dt, process_start) values ($books_id, now(), now())")) exit(1);
        $notifications_id = mysqli_insert_id($db);
    } else {
        if (!mysqli_query($db, "update notifications set process_start = now() where id = $notifications_id")) exit(1);
    }

	$all = ($book['id'] == 1314 ? 100 : 0);

    ($users_query = mysqli_query($db, "
        select u.id as users_id, t2.fcm, u.email, u.phone, u.name, t2.model, u.notification
        from users u
        join tokens2 t2 on u.id = t2.users_id and t2.fcm is not null
        where
            u.notification = $all
            or
            (u.notification = 1 and (
                u.id in (select f.users_id from favorites f where f.target = 'authors' and f.id in (select b2a.authors_id from books2authors b2a where b2a.books_id=$books_id))
                or
                u.id in (select f.users_id from favorites f where f.target = 'dictors' and f.id in (select b2d.dictors_id from books2dictors b2d where b2d.books_id=$books_id))
                or
                u.id in (select f.users_id from favorites f where f.target = 'genres' and f.id in (select b2g.genres_id from books2genres b2g where b2g.books_id=$books_id))
            ))
    ")) || exit(2);

    $users = [];
    while ($row = mysqli_fetch_assoc($users_query)) {
        $row['success'] = 0;
        $users[$row['fcm']] = $row;
    }

    $successes = [];
    if ($users) {
        list($sended, $errors, $successes) = send($title, $body, array_column($users, 'fcm'), ['link' => "https://kitobplus.uz/books/$books_id"]);
    }

    foreach ($successes as $token) {
        $users[$token]['success'] = 1;
    }

    $fields = ['users_id', 'fcm', 'email', 'phone', 'name', 'model', 'notification', 'success'];
    foreach ($users as $user) {
        $values = [];
        foreach ($fields as $field) {
            $values[] = ($user[$field] ? "'" . mysqli_real_escape_string($db, $user[$field]) . "'" : "NULL");
        }
        $query = "insert into notifications_detail (notifications_id, dt, " . implode(",", $fields) . ") values ($notifications_id, now(), " . implode(",", $values) . ")";
        mysqli_query($db, $query) || exit(3);
    }

    mysqli_query($db, "update notifications set process_end = now() where id = $notifications_id") || exit(4);

	echo json_encode(['sended' => $sended ?? 0, 'errors' => $errors ?? 0, 'successes' => $successes], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
