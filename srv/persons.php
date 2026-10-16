<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

	$db = mysqli_connect('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

	if (!mysqli_query ($db, "set character_set_client='utf8'"))exit(mysqli_error($db));
	mysqli_query ($db, "set character_set_results='utf8'");
	mysqli_query ($db, "set collation_connection='utf8_general_ci'");

    if (!in_array($_GET['table'], ['authors', 'dictors', 'genres'])) {
        exit(json_encode(['success' => false, 'error' => 'Incorrect request']));
    }

    $sort = "name";
    if (array_key_exists('sort', $_GET)) {
        if ($_GET['sort'] == 'new') $sort = 'updated desc, name';
        if ($_GET['sort'] == 'popular') $sort = 'books_count desc, name';
        if ($_GET['sort'] == 'recommend') $sort = 'id, name';
    }
      
    $where = [];
	if (!array_key_exists('all', $_GET)) {
		$where[] = 'updated is not null';
	}
    $where[] = "id in (select id from pics where target = '$_GET[table]')";

    $users_id = FALSE;
    if (array_key_exists('token', $_GET) && preg_match('/^\d+$/', $_GET['token'])) {
        $q = mysqli_query($db, "select * from tokens2 where token = $_GET[token]");
        if ($row = mysqli_fetch_assoc($q)) {
            $users_id = $row['users_id'];
        }
    }

    if (array_key_exists('favorites', $_GET) && $_GET['favorites'] && $users_id ) {
        $where[] = "id in (select f.id from favorites f where f.target = '$_GET[table]' and f.users_id = $users_id)";
    }

    if (array_key_exists('filter', $_GET) && trim($_GET['filter'])) {
        $where[] = "concat(' ', name) like '% " . mysqli_real_escape_string($db, trim($_GET['filter'])) . "%'";
    }

    $query = "select * from $_GET[table]_view where " . implode(" and ", $where) . " order by $sort";
    file_put_contents("persons.sql", $query);

    $q = mysqli_query($db, $query);

    $data = [];
    while ($row = mysqli_fetch_assoc($q)) {
        $data[] = $row;
    }

	$res = [
		'success' => true,
		'data' => $data,
	];

	echo json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
