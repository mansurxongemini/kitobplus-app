<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit($db->error . "\n");
        return $qr;
    }

    function getId($table, $name) {
        global $db;
        if ($row = sql("select id from $table where name = '" . $db->escape_string($name) . "'")->fetch_assoc()) return $row['id'];
        sql("insert into $table (name) values ('" . $db->escape_string($name) . "')");
        return $db->insert_id;
    }

	if (!array_key_exists("token", $_GET) || ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token'])) || !($book = json_decode(file_get_contents('php://input'), true)) || ((!array_key_exists('id', $book) || !intval($book['id'])) && !$book['import'])) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

    //exit(json_encode($book));

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

    if (preg_match('/^\d+$/', $_GET['token'])) {
        $aq = mysqli_query($db, "select u.* from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
        if (!($user = mysqli_fetch_assoc($aq))) {
            echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }
    }

    if ($book['import']) {
        sql("insert into books (folder) values ('" . $db->escape_string($book['import']) . "')");
        $book['id'] = $db->insert_id;
    }

    $old = $db->query("select * from books_view where id = " . intval($book['id']))->fetch_assoc();

    function sync($id, $table, $value) {
        global $old;
        if (is_array($old) && $old["${table}_name"] == $value) return;

        $values = explode(",", $value);
        $values = array_map("trim", $values);
        $values = array_filter($values);

        sql("delete from books2${table} where books_id = $id");
        $pos = 1;
        foreach ($values as $_) {
            sql("insert into books2${table} (books_id, ${table}_id, pos) values ($id, " . getId($table, $_) . ", " . ($pos++) . ")");
        }
    }

	if (!$db->query("set character_set_client='utf8'"))exit(mysqli_error($db));
	$db->query("set character_set_results='utf8'");
	$db->query("set collation_connection='utf8_general_ci'");

    sync(intval($book['id']), 'authors', $book['authors_name']);
    sync(intval($book['id']), 'dictors', $book['dictors_name']);
    sync(intval($book['id']), 'genres', $book['genres_name']);

    if (!$db->query("update books set
        name = '" . $db->escape_string($book['name']) . "',
        annotation = '" . $db->escape_string($book['annotation']) . "',
        publishers_id = " . getId('publishers', $book['publishers_name']) . ",
        adult = " . ($book['adult'] ? 18 : 'NULL') . "
        where id = " . intval($book['id']))) {
        exit(json_encode(['success' => false, 'error' => $db->error], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

	$db->query("insert into books_cache_dirty (dt) values (now())");

	echo json_encode(['success' => true], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
