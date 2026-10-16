<?php

    function users($user) {
        global $db;
        $where = ['((state != 0 or disability is not null) and deleted is null)'];
        if ($user['levels_id']) {
            $where[] = "users_id = $user[id]";
        }

	    $f = trim($_GET['filter']);
	    if ($f) {
            $where[] = "(u.name like '%" . $db->escape_string($f) . "%' or email like '%" . $db->escape_string($f) . "%' or phone like '%" . $db->escape_string($f) . "%' or address like '%" . $db->escape_string($f) . "%')";
        }

        if (intval($_GET['id'])) {
            $where[] = 'u.id=' . intval($_GET['id']);
        }

        if (preg_replace('/[^0-9]/', '', trim($_GET['phone'] ?? ''))) {
            $where[] = "u.phone like '%" . $db->escape_string(preg_replace('/[^0-9]/', '', trim($_GET['phone'] ?? ''))) . "%'";
        }

        foreach(['state', 'levels_id', 'plans_id'] as $f) {
            if ($_GET[$f] && ($_ = json_decode($_GET[$f]))) {
                $vals = array_map("intval", $_);
                if (count($vals)) {
                    $where[] = "$f in (" . implode(",", $vals) . ")";
                }
            }
        }

        //$request = "u.*,uf1.ext image1_ext,uf2.ext image2_ext from users u left join users_files uf1 on u.image1_id = uf1.id left join users_files uf2 on u.image2_id = uf2.id";
        $request = "u.*, p.name plans_name, uf1.ext image1_ext,uf2.ext image2_ext, count(distinct bh.dt) as deployed, count(distinct bs.books_id) bookshelfed, if(u.plan_end is null, '', date_format(plan_end, '%d.%m.%Y')) plan_end_str";
        $request .= " from users u left join users_files uf1 on u.image1_id = uf1.id left join users_files uf2 on u.image2_id = uf2.id";
        $request .= " left join bookshelfs_history bh on bh.users_id = u.id and bh.is_add = 1";
        $request .= " left join bookshelfs bs on bs.users_id = u.id";
        $request .= " left join plans p on u.plans_id = p.id";

        $order_direction = ($_GET['orderDirection'] == 'desc' ? ' desc' : '');

        $order_field = $db->escape_string($_GET['order'] == 'name' ? 'u.name' : $_GET['order']);

        if (!in_array($order_field, ['name', 'levels_id', 'phone', 'state', 'register_date', 'deployed', 'bookshelfed'])) {
            $order_field = 'u.name';
        }

        $order_field .= $order_direction;

        $order = " order by state, " . $order_field;
        if ($_GET['per_page']) {
            $limit = " LIMIT " . (intval($_GET['per_page']) * (intval($_GET['page']) - 1)) . ", " . intval($_GET['per_page']);
        }

	    $query_string = "select SQL_CALC_FOUND_ROWS $request " . (count($where) ? " where " . implode(' and ', $where) : '') . " group by u.id " . $order . $limit;
        //exit($query_string);
        ($query = mysqli_query($db, $query_string)) || exit($query_string . "\n" . mysqli_error($db));

        $found_rows = mysqli_fetch_array(mysqli_query($db, 'SELECT FOUND_ROWS()'));
        $found_rows = $found_rows[0];

        $data = [];
        $P = ['Администратор' , 'Читатель', 'Библиотека', 'Школа'];
        while ($row = mysqli_fetch_assoc($query)) {
			foreach (['deployed', 'bookshelfed', 'state', 'levels_id', 'plans_id', 'allow_retry'] as $f) {
            	$row[$f] = intval($row[$f]);
			}
			$row['disability'] = is_null($row['disability']) ? NULL : intval($row['disability']);
            $row['policies'] = $P[$row['levels_id']];
            foreach ([1, 2] as $n) {
                $row['image' . $n] = ($row['image' . $n . '_ext'] ? ("/srv/uf.php?id=" . $row["image${n}_id"]) : NULL);
            }
            //$row['info'] = ' Проверк фыва ыфва фыва фы';
            $data[] = $row;
        }

        $res = [
            'success' => true,
            'page' => intval($_GET['page']),
            'per_page' => intval($_GET['per_page']),
            'total' => intval($found_rows),
            'query' => $query_string,
            'filters' => implode("|", $filters),
            'data' => $data,
            'user' => $user,
        ];
        
        if (intval($_GET['per_page'])) {
            $res['total_pages'] = ceil($found_rows / intval($_GET['per_page']));
        }
        
        return json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
