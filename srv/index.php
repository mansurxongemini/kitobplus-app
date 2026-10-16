<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

	if (!array_key_exists("token", $_GET) || ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token']))) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

/*
	if (!array_key_exists("token", $_GET) || !preg_match("/^[0-9a-f]{32}$/", $_GET["token"])) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

//	$credentials = file("http://__KP_AV3715_HOST__:30080/login/session?token=$_GET[token]");
//	var_dump($credentials); exit;
	$opts = ['http' => [
        'method' => 'POST',
        'header' => 'Content-Nype: application/json',
        'content' => json_encode(['token' => $_GET['token']])
    ]];
	$context = stream_context_create($opts);
	$result = json_decode(file_get_contents('http://__KP_AV3715_HOST__:30080/login/session', false, $context), true);
//	echo $result; exit;
	if (!is_array($result) || !$result['success'] || ($result['user']['users_levels_id'] != "1" && !in_array('mybook', $result['user']['access']))) {
		echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}
*/
	$table = $_GET['table'];
	if (!in_array($table, ['authors', 'dictors', 'publishers', 'books', 'genres', 'import', 'users', 'bookshelfs', 'journal'])) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

	$db = mysqli_connect('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

	if (!mysqli_query ($db, "set character_set_client='utf8'"))exit(mysqli_error($db));
	mysqli_query ($db, "set character_set_results='utf8'");
	mysqli_query ($db, "set collation_connection='utf8_general_ci'");

	if (preg_match('/^\d+$/', $_GET['token'])) {
		$aq = mysqli_query($db, "select u.* from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
		if (!($user = mysqli_fetch_assoc($aq))) {
			echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		}
	}

	if ($table == 'import') {
		require_once('import.php');
		exit(import());
	}

	if ($table == 'users') {
		require_once('users.php');
		exit(users($user));
	}

	if ($table == 'bookshelfs') {
		require_once('bookshelfs.php');
		exit(bookshelfs());
	}

    $where = [];
	$f = $_GET['filter'];
	$filters = [];
	while (preg_match('/^([^"]*)"([^"]*)"(.*)$/', $f, $m)) {
		if (trim($m[2]) && trim($m[2]) != '-') {
			$filters[] = trim($m[2]);
		}

		$f = $m[1] . $m[3];
	}

	$fs = preg_split("/\s+/", $_GET['filter']);
	if (count($fs)) {
		$filters = $filters + $fs;
	}
	$filters = array_filter($filters);

    $actors = [];
    $dictors = [];

	if (count($filters)) {
        $where = array_merge(
            array_map(function($filter) use ($db) {
//				$field = ($_GET['table'] == 'books' ? 'b.name' : 'name');
				$exclude = false;
				if ($filter[0] == '-') {
					$exclude = true;
					$filter = substr($filter, 1);
				}
				$field = 'name';
				$neg = ($exclude ? 'not' : '');
				$sep = ($exclude ? 'and' : 'or');
                $res = "$field $neg like '%" . mysqli_real_escape_string($db, $filter) . "%'";
                if($_GET['table'] == 'books') {
                    if (preg_match("/^\d+\+$/", $filter)) {
						$res = "(concat(adult, '+') = '" . mysqli_real_escape_string($db, $filter) . "')";
                    //} elseif ($filter == '18+') {
						//$res = "adult = 1";
					} else {
						$res = "($res $sep coalesce(is_readable_from, '') $neg like '%" . mysqli_real_escape_string($db, $filter) . "%' $sep authors_name $neg like '%" . mysqli_real_escape_string($db, $filter) . "%' $sep dictors_name $neg like '%" . mysqli_real_escape_string($db, $filter) . "%' $sep publishers_name $neg like '%" . mysqli_real_escape_string($db, $filter) . "%')";
//						$res = "($res or date_format(`b`.`is_readable_from`,'%d.%m.%Y')  like '%" . mysqli_real_escape_string($db, $filter) . "%' or a.name like '%" . mysqli_real_escape_string($db, $filter) . "%' or d.name like '%" . mysqli_real_escape_string($db, $filter) . "%' or p.name like '%" . mysqli_real_escape_string($db, $filter) . "%')";
//						$res = "($res or added like '%" . mysqli_real_escape_string($db, $filter) . "%' or authors_name like '%" . mysqli_real_escape_string($db, $filter) . "%' or dictors_name like '%" . mysqli_real_escape_string($db, $filter) . "%' or publishers_name like '%" . mysqli_real_escape_string($db, $filter) . "%' or annotation like '%" . mysqli_real_escape_string($db, $filter) . "%')";
					}
                }
				if ($exclude) {
				//	$res = "not $res";
				}
                return $res;
            }, $filters)
        );
    }

    if (array_key_exists('authors_id', $_GET) && intval($_GET['authors_id'])) {
        $where[] = "id in (select books_id from books2authors where authors_id = " . intval($_GET['authors_id']) . ")";
    }

    if (array_key_exists('dictors_id', $_GET) && intval($_GET['dictors_id'])) {
        $where[] = "id in (select books_id from books2dictors where dictors_id = " . intval($_GET['dictors_id']) . ")";
    }

    if (array_key_exists('publishers_id', $_GET) && intval($_GET['publishers_id'])) {
        $where[] = "publishers_id = " . intval($_GET['publishers_id']);
    }

    if (array_key_exists('genres_id', $_GET) && intval($_GET['genres_id'])) {
        $where[] = "id in (select books_id from books2genres where genres_id = " . intval($_GET['genres_id']) . ")";
    }

	if (array_key_exists('id', $_GET) && intval($_GET['id'])) {
		$where[] = "id = " . intval($_GET['id']);
	}

    if (array_key_exists('states', $_GET) && strlen($_GET['states'])) {
        $states = array_filter(explode(",", $_GET['states']), function($a) {return preg_match('/^\d+$/', $a);});
        if (count($states)) {
			$w = [];
			foreach ($states as $_) {
				if ($_ == 100) {$w[] = "deleted is not null";}
				if ($_ == 0) {$w[] = "deleted is null and is_readable_from is null";}
				if ($_ == 1) {$w[] = "deleted is null and date(is_readable_from) > date(now())";}
				if ($_ == 2) {$w[] = "deleted is null and date(is_readable_from) <= date(now())";}
			}
        	$where[] = "(" . implode(" or ", $w) . ")";
        } else {
			$where[] = "deleted is null";
		}
    } else {
		if ($_GET['table'] == 'books') {
			$where[] = "deleted is null";
		}
	}

    $request = "*" . ($_GET['table'] == 'books' ? ', if(deleted is not null, -1, if(is_readable_from is null, 0, if(date(is_readable_from) > date(now()), 1, 2))) states_id' : '') . " from $_GET[table]_view ";

	if ($_GET['table'] != 'books') {
		$where[] = "id in (" . ($_GET['table'] == 'publishers' ? "select publishers_id from books" : "select " . $_GET['table'] . "_id from books2" . $_GET['table']) . ")";
	}

    $order_direction = ($_GET['orderDirection'] == 'desc' ? ' desc' : '');

    $order_field = mysqli_real_escape_string($db, ($_GET['order'] ?? 'name')) . $order_direction;
    if ($order_field == 'duration') {
        $order_field = "seconds $order_direction";
    }

    if (preg_match('/^added(\s+\S+)?$/', $order_field)) {
        $order_field = "is_readable_from $order_direction";
    }

    if ($_GET['table'] == 'books' && $_GET['order'] == 'name') {
        $order_field = "authors_name $order_direction, name $order_direction, dictors_name $order_direction";
    }
//	$order_field = "authors_name desc";
    $order = " order by " . $order_field;
    if (intval($_GET['per_page'])) {
		$limit = " LIMIT " . (intval($_GET['per_page']) * (intval($_GET['page']) - 1)) . ", " . intval($_GET['per_page']);
	}
	$query_string = "select SQL_CALC_FOUND_ROWS $request" . (count($where) ? " where " . implode(' and ', $where) : '') . $order . $limit;

	if ($_GET['table'] == 'books') {
//		$query_string = "select SQL_CALC_FOUND_ROWS `b`.`id` AS `id`,`b`.`name` AS `name`,`b`.`preview_id` AS `preview_id`,`b`.`url` AS `url`,`b`.`dictors_id` AS `dictors_id`,`b`.`is_readable_from` AS `is_readable_from`,`b`.`seconds` AS `seconds`,sec_to_time(`b`.`seconds`) AS `duration`,date_format(`b`.`is_readable_from`,'%d.%m.%Y') AS `added`,`b`.`annotation` AS `annotation`,`b`.`adult` AS `adult`,`p`.`name` AS `publishers_name`,`p`.`id` AS `publishers_id`, coalesce(if(b2i.states_id = 4 or b2i.states_id = 5 or b2i.states_id = 6, b2i.states_id, null), max(`astates`.`states_id`),`dstates`.`states_id`,`pstates`.`states_id`,`b2i`.`states_id`,0) AS `states_id`,`s`.`name` AS `states_name`,`d`.`name` AS `dictors_name`,group_concat(`a`.`name` order by `b2a`.`pos` ASC separator ', ') AS `authors_name`,max(`astates`.`states_id`) AS `authors_states_id`,`dstates`.`states_id` AS `dictors_states_id`,`pstates`.`states_id` AS `publishers_states_id`,`b2i`.`states_id` AS `books_states_id`,`b2i`.`inbox_id` AS `inbox_id` from (((((((((`books` `b` left join `dictors` `d` on((`b`.`dictors_id` = `d`.`id`))) left join `books2authors` `b2a` on((`b`.`id` = `b2a`.`books_id`))) left join `authors` `a` on((`b2a`.`authors_id` = `a`.`id`))) left join `books2inbox` `b2i` on((`b2i`.`books_id` = `b`.`id`))) left join `states` `s` on((`s`.`id` = `b2i`.`states_id`))) left join `authors_states` `astates` on((`astates`.`authors_id` = `a`.`id`))) left join `dictors_states` `dstates` on((`dstates`.`dictors_id` = `d`.`id`))) left join `publishers` `p` on((`p`.`id` = `b`.`publishers_id`))) left join `publishers_states` `pstates` on((`pstates`.`publishers_id` = `p`.`id`))) " . (count($where) ? " where " . implode(' and ', $where) : '') . ' group by b.id ' . $order . $limit;
	}

    ($query = mysqli_query($db, $query_string)) || exit($query_string . "\n" . mysqli_error($db));

    $found_rows = mysqli_fetch_array(mysqli_query($db, 'SELECT FOUND_ROWS()'));
    $found_rows = $found_rows[0];

	$inbox_genres = [];
	if ($_GET['table'] == 'genres') {
/*		
		$inbox_db = mysqli_connect('__KP_AV3715_HOST__', 'root', '__KP_AV3715_ROOT_PASSWORD__', 'av3715');
    	assert($inbox_db);
    	mysqli_set_charset($inbox_db, "utf8");
		($genres_query = mysqli_query($inbox_db, "select id, name from genre")) || exit(mysqli_error($inbox_db));
		while ($row = mysqli_fetch_assoc($genres_query)) {
			$inbox_genres[$row['id']] = $row;
		}
*/
		$inbox_genres = json_decode(file_get_contents('inbox_genres.json'), true);
	}

    $data = [];
    while ($row = mysqli_fetch_assoc($query)) {
        if($_GET['table']=='books') {
            $name = $row['name'];
			$row['title'] = $name;
            if (!(array_key_exists('authors_id', $_GET) && intval($_GET['authors_id']))) {
                $name = ($row['authors_name'] ? $row['authors_name'] . ' - ' : '') . $name;
            }

            if (!(array_key_exists('dictors_id', $_GET) && intval($_GET['dictors_id']))) {
                $name .= ($row['dictors_name'] ? " ($row[dictors_name])" : '');
            }

            $row['name'] = $name;
			//$row['fullname'] = $name;
            //$row['states_id'] = rand(0, 6);
//            $book = book($row['id']);
//			$row['annotation'] = $book['annotation'];

			$row['genres'] = [];
			$gq = mysqli_query($db, 'select id, name, url from genres where id in (select genres_id from books2genres where books_id = ' . $row['id'] . ')');
			while ($gr = mysqli_fetch_assoc($gq))
				$row['genres'][] = $gr;

			$row['adult'] = $row['adult'];

			$row['states_id'] = intval($row['states_id']);
			$row['downloads_count'] = intval($row['downloads_count']);
			$row['bookshelfs_count'] = intval($row['bookshelfs_count']);
			$row['adult'] = (is_null($row['adult']) ? NULL : intval($row['adult']));
		}
		
		if (in_array($_GET['table'], ['books', 'authors', 'dictors'])) {
			$row['annotation'] = ($row['annotation'] ?? '');
        }

		if ($_GET['table'] == 'genres') {
			//$row['inbox_genres'] = $row['genre_links'];//array_map(function ($_) {return $inbox_genres[$_];}, explode(",", $row['genre_links']));
			//$row['inbox_genres'] = array_map(function ($_) {return $inbox_genres[$_];}, explode(",", $row['genre_links']));
			//$row['inbox_genres'] = array_values($inbox_genres);//explode(",", $row['genre_links']);
			//$row['inbox_genres'] = $row['inbox_genres'][0];
			$row['inbox_genres'] = [];
			$ig = explode(",", $row['genre_links']);			
			foreach ($ig as $_) {
				if (array_key_exists($_, $inbox_genres)) {
					$row['inbox_genres'][] = $inbox_genres[$_];
				}
			}

			if (count($row['inbox_genres'])) {
				$row['genre_links'] = implode(", ", array_column($row['inbox_genres'], 'name'));
			}
		}

        $data[] = $row;
    }

	$res = [
		'success' => true,
		'page' => intval($_GET['page']),
		'total' => intval($found_rows),
		'filters' => implode("|", $filters),
		'data' => $data
	];
	
	if (intval($_GET['per_page'])) {
		$res['per_page'] = intval($_GET['per_page']);
		$res['total_pages'] = ceil($found_rows / intval($_GET['per_page']));
	}

	echo json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
