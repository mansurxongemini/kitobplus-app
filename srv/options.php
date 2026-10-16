<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

	if (!array_key_exists("token", $_GET) || ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token']))) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

	if (preg_match('/^\d+$/', $_GET['token'])) {
		$aq = mysqli_query($db, "select u.id from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
		if (!mysqli_fetch_assoc($aq)) {
			echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		}
	}
    
    $options = [];
    foreach (['authors', 'dictors', 'genres', 'publishers'] as $table) {
        $options[$table] = [];
        if ($table == 'publishers') {
            $query = "select name from publishers order by name";
        } else {
            $query = "select name from $table where id in (select ${table}_id from books2${table}) order by name";
        }
        if (!($q = $db->query($query))) exit($db->error);
        while ($row = $q->fetch_assoc()) {
            $options[$table][] = $row['name'];
        }
    }

	$options['free_space'] = disk_free_space("/kitobplus/books/storage");

	exit(json_encode(['success' => true, 'options' => $options], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
