<?php
    function bookshelfs() {
        global $db;

        $where = [];

	    if (trim($_GET['users_name']) && !intval($_GET['users_id'])) {
            $where[] = "(users_name like '%" . $db->escape_string(trim($_GET['users_name'])) . "%')";
        } else {
            $where[] = "users_name is not null";
        }

	    $group_by = '';

        if (intval($_GET['users_id'])) {
            $where[] = "users_id=" . intval($_GET['users_id']);
            $group_by = " group by books_id ";
        }

	    if (intval($_GET['books_id'])) {
            $where[] = "books_id=" . intval($_GET['books_id']);
            $group_by = " group by users_id ";
        }

	    if (trim($_GET['books_name'])) {
            $where[] = "(books_name like '%" . $db->escape_string(trim($_GET['books_name'])) . "%')";
        } else {
            $where[] = "books_name is not null";
        }

        if (in_array($_GET['order'], ['books_name', 'users_name', 'dt'])) {
            $order_field = $_GET['order'] . ($_GET['orderDirection'] == 'desc' ? ' desc' : '');
        } else {
            $order_field = 'dt desc';
        }

        $limit = " LIMIT " . (intval($_GET['per_page']) * (intval($_GET['page']) - 1)) . ", " . intval($_GET['per_page']);
	    $query_string = "select SQL_CALC_FOUND_ROWS * from bookshelfs_" . ($_GET['history'] ? 'history_' : '') . "view " . (count($where) ? " where " . implode(' and ', $where) : '') . $group_by . " order by " . $order_field;

        ($query = mysqli_query($db, $query_string)) || exit($query_string . "\n" . mysqli_error($db));

        $found_rows = mysqli_fetch_array(mysqli_query($db, 'SELECT FOUND_ROWS()'));
        $found_rows = $found_rows[0];

        $data = [];
        while ($row = mysqli_fetch_assoc($query)) {
            $data[] = $row;
        }

        $res = [
            'success' => true,
            'page' => intval($_GET['page']),
            'per_page' => intval($_GET['per_page']),
            'total' => intval($found_rows),
            'total_pages' => ceil($found_rows / intval($_GET['per_page'])),
            'filters' => "",
            'data' => $data
        ];

        return json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
