<?php
//	$http_origin = $_SERVER['HTTP_ORIGIN'];
//	var_dump($http_origin); exit;
//	if ($http_origin == "http://" || $http_origin == "http://www.domain2.com" || $http_origin == "http://www.domain3.com") {
//    	header("Access-Control-Allow-Origin: $http_origin");
//&	}

	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

    $db = mysqli_connect('__KP_AV3715_HOST__', 'root', '__KP_AV3715_ROOT_PASSWORD__', 'av3715');
    assert($db);
    mysqli_set_charset($db, "utf8");

    $words = explode(' ', $_GET['filter']);
    $filters = [];
    foreach($words as $word) {
        if (!($word = trim($word))) {
            continue;
        }

        $filters[] = "concat(author, ' - ', book) like '%" . mysqli_real_escape_string($db, $word) . "%'";
    }

    $where = 'where ' . (count($filters) ?  implode(' and ', $filters) : 'id is null');

    if (preg_match('/^\d+$/', $_GET['id'])) {
        $where = 'where id= ' . intval($_GET['id']);
    }

    ($q = mysqli_query($db, "select id, concat(author, ' - ', book) name from inbox $where order by author, book limit 0, 10")) || exit(mysqli_error($db));

    $result = [];
    while ($row = mysqli_fetch_assoc($q)) {
//		$row['name'] = $http_origin;
        $result[] = $row;
    }


    exit(json_encode($result));
