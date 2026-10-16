<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

	$db = mysqli_connect('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

	if (!mysqli_query ($db, "set character_set_client='utf8'"))exit(mysqli_error($db));
	mysqli_query ($db, "set character_set_results='utf8'");
	mysqli_query ($db, "set collation_connection='utf8_general_ci'");

    $sort = "name";
    if (array_key_exists('sort', $_GET)) {
        if ($_GET['sort'] == 'new') $sort = 'updated desc, name';
        if ($_GET['sort'] == 'popular') $sort = 'books_count desc, name';
        if ($_GET['sort'] == 'recommend') $sort = 'id, name';
    }

    $where = [];

    if ($filter = trim($_GET['filter'] ?? '')) {
        $where[] = "concat(' ', name) like '% " . mysqli_real_escape_string($db, $filter) . "%'";
    }

    ($q = mysqli_query($db, "select * from genres_view " . (count($where) ? "where " . implode(" and ", $where) : "") . " order by $sort")) || exit(json_encode(['success' => false, 'error' => mysqli_error($db)]));

    $data = [];
    while ($row = mysqli_fetch_assoc($q)) {
        $data[] = $row;
    }

	$res = [
		'success' => true,
		'data' => $data,
	];

	echo json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
