<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');

	$db = mysqli_connect('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

	if (!mysqli_query ($db, "set character_set_client='utf8'"))exit(mysqli_error($db));
	mysqli_query ($db, "set character_set_results='utf8'");
	mysqli_query ($db, "set collation_connection='utf8_general_ci'");

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

    $actors = [];
    $dictors = [];
    //error_log(json_encode($filters));
    if (count($filters)) {
        //file_put_contents('filters.sql', json_encode($filters, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $where = array_merge(
            $where,
            array_map(function($filter) use ($db) {
//				$field = ($_GET['table'] == 'books' ? 'b.name' : 'name');
				$exclude = false;
				if ($filter[0] == '-') {
					$exclude = true;
					$filter = substr($filter, 1);
				}
				$field = 'b.name';
				$neg = ($exclude ? 'not' : '');
				$sep = ($exclude ? 'and' : 'or');
                $res = "$field $neg like '%" . mysqli_real_escape_string($db, $filter) . "%'";
                //if($_GET['table'] == 'books') {
                    if (preg_match("/^\d+\+$/", $filter))
						$res = "(concat(adult, '+') = '" . mysqli_real_escape_string($db, $filter) . "')";
                    else
						$res = "($res $sep coalesce(is_readable_from, '') $neg like '%" . mysqli_real_escape_string($db, $filter) . "%' $sep authors_name $neg like '%" . mysqli_real_escape_string($db, $filter) . "%' $sep dictors_name $neg like '%" . mysqli_real_escape_string($db, $filter) . "%' $sep publishers_name $neg like '%" . mysqli_real_escape_string($db, $filter) . "%')";
//						$res = "($res or date_format(`b`.`is_readable_from`,'%d.%m.%Y')  like '%" . mysqli_real_escape_string($db, $filter) . "%' or a.name like '%" . mysqli_real_escape_string($db, $filter) . "%' or d.name like '%" . mysqli_real_escape_string($db, $filter) . "%' or p.name like '%" . mysqli_real_escape_string($db, $filter) . "%')";
//						$res = "($res or added like '%" . mysqli_real_escape_string($db, $filter) . "%' or authors_name like '%" . mysqli_real_escape_string($db, $filter) . "%' or dictors_name like '%" . mysqli_real_escape_string($db, $filter) . "%' or publishers_name like '%" . mysqli_real_escape_string($db, $filter) . "%' or annotation like '%" . mysqli_real_escape_string($db, $filter) . "%')";
                //}
				if ($exclude) {
				//	$res = "not $res";
				}
                return $res;
            }, $filters)
        );

        error_log(json_encode($where));
    }

    if (array_key_exists('only_with_pics', $_GET) && intval($_GET['only_with_pics'])) {
        $where[] = "b.id in (select id from pics where target = 'books')";
    }

    if (array_key_exists('authors_id', $_GET) && intval($_GET['authors_id'])) {
        $where[] = "b.id in (select books_id from books2authors where authors_id = " . intval($_GET['authors_id']) . ")";
    }

    if (array_key_exists('authors', $_GET) && trim($_GET['authors'])) {
        $where[] = "b.id in (select books_id from books2authors join authors on books2authors.authors_id = authors.id and authors.name like '" . mysqli_real_escape_string($db, trim($_GET['authors'])) . "%')";
    }

    if (array_key_exists('dictors_id', $_GET) && intval($_GET['dictors_id'])) {
        $where[] = "b.id in (select books_id from books2dictors where dictors_id = " . intval($_GET['dictors_id']) . ")";
    }

    if (array_key_exists('dictors', $_GET) && trim($_GET['dictors'])) {
        $where[] = "b.id in (select books_id from books2dictors join dictors on books2dictors.dictors_id = dictors.id and dictors.name like '" . mysqli_real_escape_string($db, trim($_GET['dictors'])) . "%')";
    }

    if (array_key_exists('publishers_id', $_GET) && intval($_GET['publishers_id'])) {
        $where[] = "publishers_id = " . intval($_GET['publishers_id']);
    }

    if (array_key_exists('genres_id', $_GET)) {
        if (!is_array($_GET['genres_id'])) $_GET['genres_id'] = [$_GET['genres_id']];
        if ($genres_id = array_filter(array_map("intval", $_GET['genres_id']))) {            
            $where[] = "b.id in (select books_id from books2genres where genres_id in (" . implode(",", $genres_id) . "))";
        }
    }

    if (array_key_exists('genres', $_GET) && trim($_GET['genres'])) {
        $where[] = "b.id in (select books_id from books2genres join genres on books2genres.genres_id = genres.id and genres.name like '" . mysqli_real_escape_string($db, trim($_GET['genres'])) . "%')";
    }

    if (array_key_exists('ids', $_GET) && strlen(trim($_GET['ids']))) {
        $ids = array_filter(array_map("intval", explode(",", $_GET['ids'])));
        if (!$ids) $ids = [0];
        $where[] = "b.id in (" . implode(",", $ids) . ")";
    }

    if (array_key_exists('recommendations', $_GET) && intval($_GET['recommendations'])) {
        require_once('li_functions.php');
        $ids = li_recommend(intval($_GET['recommendations']));
        if (false && count($ids)) {
            $where = ["b.id in (" . implode(",", $ids) . ") "];
        } else {
            $where = ["b.id in (0)"];
        }
        
        //$where = ["b.id in (0)"];
    }    

//    $request = "bv.*, group_concat(f.seconds order by f.pos) files";
    //$request = "bv.*";
    $users_id = FALSE;
    if (array_key_exists('token', $_GET) && preg_match('/^\d+$/', $_GET['token'])) {
        $q = mysqli_query($db, "select * from tokens2 where token = $_GET[token]");
        if ($row = mysqli_fetch_assoc($q)) {
            $users_id = $row['users_id'];
        }
    }

    $request = "b.*\n";
    
    if ($users_id) {
        $request .= ", bookshelfs.dt bookshelfed, pp.rate pp_rate, pp.track pp_track, pp.position pp_position, pp.dt pp_dt\n";
    }

    $request .= "from books_cache b\n";

    $REALM = (array_key_exists('realm', $_GET) ? $_GET['realm'] : '');
	if (!$REALM && $_GET['bookshelf']) {
		$REALM = 'bookshelf';
	}

    if ($users_id) {
        $request .= ($REALM == 'bookshelf' ? " " : " left") . " join bookshelfs on bookshelfs.users_id = $users_id and b.id = bookshelfs.books_id";
        $request .= ($REALM == 'liked' ? " " : " left") . " join likes on likes.users_id = $users_id and likes.books_id = b.id and likes.liked = 1";
        $request .= ($REALM == 'listened' ? " " : " left") . " join playback_positions pp on pp.users_id = $users_id and pp.books_id = b.id";
    }

    $where[] = "date(b.is_readable_from) <= date(now())";

    if ($_GET['filter'] == '1314') {
        $where[] = "b.id = 1314";
    }
    
    $order_direction = ($_GET['orderDirection'] == 'desc' ? ' desc' : '');

    $order_field = mysqli_real_escape_string($db, $_GET['order']) . $order_direction;
    if ($order_field == 'duration') {
        $order_field = "seconds $order_direction";
    }

    if (preg_match('/^added(\s+\S+)?$/', $order_field)) {
        $order_field = "is_readable_from $order_direction";
    }

    $order_field = "authors_name $order_direction, b.name $order_direction, dictors_name $order_direction";
    if (array_key_exists('sort', $_GET)) {
        if ($_GET['sort'] == 'new') $order_field = "is_readable_from desc, $order_field";
        if ($_GET['sort'] == 'popular') $order_field = "duration desc, $order_field";
        if ($_GET['sort'] == 'recommend') $order_field = "authors_name desc, $order_field";
        if ($_GET['sort'] == 'rand') $order_field = "RAND()";
    }

    $order_field = "if(exists (select * from pics where target='books' and id = b.id), 0, 1), $order_field";

    if ($REALM && $users_id && !array_key_exists('sort', $_GET)) {
        if ($REALM === 'bookshelf') $order_field = 'bookshelfs.dt desc';
        if ($REALM === 'liked') $order_field = 'likes.dt desc';
        if ($REALM === 'listened') $order_field = 'pp.dt desc';
    }

	$order_field .= ($order_field ? "," : "") . "authors_name,b.name,dictors_name";

    $order = "\ngroup by b.id\norder by " . $order_field;
    //$limit = " LIMIT " . (intval($_GET['per_page']) * (intval($_GET['page']) - 1)) . ", " . intval($_GET['per_page']);
    if (array_key_exists('sneakpeaks', $_GET) && $_GET['sneakpeaks']) {
        $limit = " LIMIT 12";
    } else {
        if (array_key_exists('per_page', $_GET) && intval($_GET['per_page'])) {
            $limit = "\nLIMIT " . (intval($_GET['per_page']) * intval($_GET['page'])) . ", " . intval($_GET['per_page']);
        } else {
            //$limit = " LIMIT 100";
        }
    }
	$query_string = "select SQL_CALC_FOUND_ROWS $request" . (count($where) ? "\nwhere " . implode(' and ', $where) : '') . $order . $limit;

	if ($_GET['table'] == 'books') {
//		$query_string = "select SQL_CALC_FOUND_ROWS `b`.`id` AS `id`,`b`.`name` AS `name`,`b`.`preview_id` AS `preview_id`,`b`.`url` AS `url`,`b`.`dictors_id` AS `dictors_id`,`b`.`is_readable_from` AS `is_readable_from`,`b`.`seconds` AS `seconds`,sec_to_time(`b`.`seconds`) AS `duration`,date_format(`b`.`is_readable_from`,'%d.%m.%Y') AS `added`,`b`.`annotation` AS `annotation`,`b`.`adult` AS `adult`,`p`.`name` AS `publishers_name`,`p`.`id` AS `publishers_id`, coalesce(if(b2i.states_id = 4 or b2i.states_id = 5 or b2i.states_id = 6, b2i.states_id, null), max(`astates`.`states_id`),`dstates`.`states_id`,`pstates`.`states_id`,`b2i`.`states_id`,0) AS `states_id`,`s`.`name` AS `states_name`,`d`.`name` AS `dictors_name`,group_concat(`a`.`name` order by `b2a`.`pos` ASC separator ', ') AS `authors_name`,max(`astates`.`states_id`) AS `authors_states_id`,`dstates`.`states_id` AS `dictors_states_id`,`pstates`.`states_id` AS `publishers_states_id`,`b2i`.`states_id` AS `books_states_id`,`b2i`.`inbox_id` AS `inbox_id` from (((((((((`books` `b` left join `dictors` `d` on((`b`.`dictors_id` = `d`.`id`))) left join `books2authors` `b2a` on((`b`.`id` = `b2a`.`books_id`))) left join `authors` `a` on((`b2a`.`authors_id` = `a`.`id`))) left join `books2inbox` `b2i` on((`b2i`.`books_id` = `b`.`id`))) left join `states` `s` on((`s`.`id` = `b2i`.`states_id`))) left join `authors_states` `astates` on((`astates`.`authors_id` = `a`.`id`))) left join `dictors_states` `dstates` on((`dstates`.`dictors_id` = `d`.`id`))) left join `publishers` `p` on((`p`.`id` = `b`.`publishers_id`))) left join `publishers_states` `pstates` on((`pstates`.`publishers_id` = `p`.`id`))) " . (count($where) ? " where " . implode(' and ', $where) : '') . ' group by b.id ' . $order . $limit;
	}

    file_put_contents('books.sql', $query_string);

    ($query = mysqli_query($db, $query_string)) || exit($query_string . "\n" . mysqli_error($db));

    $found_rows = mysqli_fetch_array(mysqli_query($db, 'SELECT FOUND_ROWS()'));
    $found_rows = $found_rows[0];

    $rows = [];

    if ($found_rows == 0) {
        $terms = preg_split('/\s+/', trim($_GET['filter']), -1, PREG_SPLIT_NO_EMPTY);
        $long = array_filter($terms, function($_) { return mb_strlen($_) >= 2;});
        if (count($long) >= 2) {
            header("X-Progress: long");
            header('Access-Control-Expose-Headers: X-Progress');
            if (ob_get_level() > 0) ob_flush();
            flush();
            require_once('li_functions.php');
            $ids = li_search($_GET['filter']);
            if (count($ids)) {
                $where = ["b.id in (" . implode(",", $ids) . ") "];
                $query_string = "select SQL_CALC_FOUND_ROWS $request" . (count($where) ? " where " . implode(' and ', $where) : '') . $order . $limit;
                ($query = mysqli_query($db, $query_string)) || exit($query_string . "\n" . mysqli_error($db));
                $found_rows = mysqli_fetch_array(mysqli_query($db, 'SELECT FOUND_ROWS()'));
                $found_rows = $found_rows[0];

                $r = [];
                while ($row = mysqli_fetch_assoc($query)) $r[] = $row;
                $rowsById = array_column($r, null, 'id');

                $sortedRows = array_filter(array_map(function($id) use ($rowsById) {
                    return array_key_exists($id, $rowsById) ? $rowsById[$id] : null;
                }, $ids));
                $rows = array_values($sortedRows);
            }
        }
    } else {
        while ($row = mysqli_fetch_assoc($query)) $rows[] = $row;
    }

    $data = [];
    foreach ($rows as $row) {
        $name = $row['name'];
        $row['title'] = trim($name);
        //if (!(array_key_exists('authors_id', $_GET) && intval($_GET['authors_id']))) {
            $name = ($row['authors_name'] ? $row['authors_name'] . ' - ' : '') . $name;
        //}

        //if (!(array_key_exists('dictors_id', $_GET) && intval($_GET['dictors_id']))) {
            $name .= ($row['dictors_name'] ? " ($row[dictors_name])" : '');
        //}

        $row['id'] = intval($row['id']);
        $row['name'] = $name;

        $row['bookshelfed'] = ($users_id ? $row['bookshelfed'] : FALSE);

        if ($users_id) {
            $row['pp_rate'] = floatval($row['pp_rate']);
            $row['pp_track'] = intval($row['pp_track']);
            $row['pp_position'] = intval($row['pp_position']);
        }

        $data[] = $row;
    }
/*
    $extra = [];
    foreach (['authors', 'dictors', 'genres', 'publishers'] as $_) {
        $q = mysqli_query($db,"select distinct({$_}_name) as name from books_view where {$_}_name is not null and {$_}_name != '' and date(is_readable_from) <= date(now()) order by {$_}_name");
        $extra[$_] = [];
        while ($row = mysqli_fetch_assoc($q)) {
            $extra[$_][] = $row['name'];
        }
    }
*/
	$res = [
		'success' => true,
		'page' => intval($_GET['page']),
		//'per_page' => intval($_GET['per_page']),
		'total' => intval($found_rows),
		/*'total_pages' => ceil($found_rows / intval($_GET['per_page'])),*/
		'query' => $query_string,
		'filters' => implode("|", $filters),
		'data' => $data,
  //      'extra' => $extra,
	];

	echo json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
