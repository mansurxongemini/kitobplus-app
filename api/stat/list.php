<?php
    //$action = 'Получение списка пользователей';
    require_once('../connect2db.php');
    
    $params = validate(['interval', 'begin', 'end', 'groupby']);

    onlyAdmin($params);

    $groupby = 'date(dt)';
    if ($params['groupby'] == 1) $groupby = "date_format(dt, '%Y-%m')";
    if ($params['groupby'] == 2) $groupby = "concat(date_format(dt, '%Y'), '-', ceil(date_format(dt, '%m')/3))";
    if ($params['groupby'] == 3) $groupby = "date_format(dt, '%Y')";

    $intervals = ['1 day', '1 month', '4 month', '1 year']; 
    $q = "
        select $groupby `interval`,
        count(distinct(concat(date(dt),'/',users_id))) visits,
        count(distinct(concat(date(dt),'/',users_id,'/',books_id))) orders
        from bookshelfs_history
        where " . ($params['user']['levels_id'] ? 'users_id in (select id from users where users_id = ' . $params['user']['id'] . ') and ' : '') . " dt >= '$params[begin]' and dt < date_add('$params[end]', interval " . $intervals[$params['interval']] . ")
        group by $groupby
    ";

    $data = fetch_all($q);
    $Q = ['?', 'I', 'II', 'III', 'IV'];
    $M = ['?', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    $summary = ['visits' => 0, 'orders' => 0];
    foreach ($data as &$row) {
        $title = $row['interval'];
        
        if ($params['groupby'] == 0 && preg_match('/^(\d+)-(\d+)-(\d+)$/', $row['interval'], $m)) {
            $title = "$m[3].$m[2].$m[1]";
        }

        if ($params['groupby'] == 1 && preg_match('/^(\d+)-(\d+)$/', $row['interval'], $m)) {
            $title = $M[intval($m[2])] . '/'. $m[1];
        }

        if ($params['groupby'] == 2 && preg_match('/^(\d+)-(\d+)$/', $row['interval'], $m)) {
            $title = $Q[intval($m[2])] . '/'. $m[1];
        }

        $row['interval_title'] = $title;

        $summary['visits'] += intval($row['visits']);
        $summary['orders'] += intval($row['orders']);
    }

    exit(json_encode(['success' => true, 'data' => $data, 'summary' => $summary, 'query' => $q]));